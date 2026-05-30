/**
 * What it is: Admin authentication controller (login + CRUD + OTP forgot-password).
 * Non-tech note: Handles admin sign-in, account management, OTP sending, and password retrieval.
 */

import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import Admin from '../models/Admin.js'

// Reads JWT_SECRET from env; throws if not configured
const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET
    if (!secret) {
        const err = new Error('Server JWT secret is not configured (JWT_SECRET)')
        err.statusCode = 500
        throw err
    }
    return secret
};

// Reversible encryption configurations
const ALGORITHM = 'aes-256-cbc'
const getEncryptionKey = () => {
    const secret = process.env.JWT_SECRET || 'logins_secret_key_2025'
    return crypto.createHash('sha256').update(secret).digest()
}

// Encrypts plaintext password symmetrically using aes-256-cbc
export const encryptPassword = (text) => {
    if (!text) return null
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv)
    let encrypted = cipher.update(String(text), 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return `${iv.toString('hex')}:${encrypted}`
}

// Decrypts encrypted password string using aes-256-cbc
export const decryptPassword = (encryptedText) => {
    if (!encryptedText || !encryptedText.includes(':')) return null
    try {
        const [ivHex, encrypted] = encryptedText.split(':')
        const iv = Buffer.from(ivHex, 'hex')
        const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv)
        let decrypted = decipher.update(encrypted, 'hex', 'utf8')
        decrypted += decipher.final('utf8')
        return decrypted
    } catch (err) {
        console.error('Decryption failed:', err)
        return null
    }
}

// In-memory OTP storage map for forgot-password flow
const otpStore = new Map()

// Authenticates admin by email/ID + password and returns a JWT token
export const adminLogin = asyncHandler(async (req, res) => {
    const { password } = req.body || {}
    const identifier = req.body?.identifier ?? req.body?.adminId ?? req.body?.email

    if (!identifier || !password) {
        return res
            .status(400)
            .json({ success: false, message: 'Admin ID/email and password are required' })
    }

    const normalized = String(identifier).trim().toLowerCase()
    const admin = await Admin.findOne({ $or: [{ email: normalized }, { adminId: normalized }] })
    if (!admin || admin.isActive === false) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const ok = await bcrypt.compare(String(password), String(admin.passwordHash))
    if (!ok) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    // Gracefully upgrade legacy accounts by storing encrypted copy of password upon successful login
    if (!admin.passwordEncrypted) {
        admin.passwordEncrypted = encryptPassword(password)
        await admin.save()
    }

    const token = jwt.sign(
        {
            role: admin.role || 'admin',
            email: admin.email,
            adminDbId: String(admin._id),
            typ: 'admin',
        },
        getJwtSecret(),
        { expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || '7d' }
    )

    return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            token,
            expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || '7d',
            admin: {
                id: String(admin._id),
                adminId: admin.adminId || null,
                email: admin.email,
                role: admin.role || 'admin',
            },
        },
    })
})

// Returns the currently logged-in admin's profile from the token
export const adminMe = asyncHandler(async (req, res) => {
    return res.status(200).json({
        success: true,
        data: { admin: req.admin || null },
    })
})

// Fetch all registered admin accounts (safely excluding passwordHash)
export const getAllAdmins = asyncHandler(async (req, res) => {
    const admins = await Admin.find({})
        .select({ passwordHash: 0 })
        .sort({ createdAt: -1 })
        .lean()
    return res.status(200).json({
        success: true,
        data: admins
    })
})

// Create a new admin account (Email + Password only)
export const createAdminAccount = asyncHandler(async (req, res) => {
    const { email, password, role } = req.body || {}

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' })
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    
    // Check duplicate email
    const existing = await Admin.findOne({ email: normalizedEmail })
    if (existing) {
        return res.status(400).json({ success: false, message: 'An admin with this Email already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(String(password), salt)
    const passwordEncrypted = encryptPassword(password)
    
    // Maintain backward compatibility for queries using adminId by using email prefix
    const adminId = normalizedEmail.split('@')[0]

    const newAdmin = await Admin.create({
        adminId,
        email: normalizedEmail,
        passwordHash,
        passwordEncrypted,
        role: role || 'admin',
        isActive: true
    })

    return res.status(201).json({
        success: true,
        message: 'Admin account created successfully',
        data: {
            id: newAdmin._id,
            email: newAdmin.email,
            role: newAdmin.role
        }
    })
})

// Update an existing admin account
export const updateAdminAccount = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { email, password, role, isActive } = req.body || {}

    const admin = await Admin.findById(id)
    if (!admin) {
        return res.status(404).json({ success: false, message: 'Admin account not found' })
    }

    if (email !== undefined) {
        const normalizedEmail = email ? String(email).trim().toLowerCase() : ''
        if (!normalizedEmail) {
            return res.status(400).json({ success: false, message: 'Email is required' })
        }
        if (normalizedEmail !== admin.email) {
            const dup = await Admin.findOne({ email: normalizedEmail })
            if (dup) return res.status(400).json({ success: false, message: 'Email is already taken' })
            admin.email = normalizedEmail
            admin.adminId = normalizedEmail.split('@')[0]
        }
    }

    if (password) {
        const salt = await bcrypt.genSalt(10)
        admin.passwordHash = await bcrypt.hash(String(password), salt)
        admin.passwordEncrypted = encryptPassword(password)
    }

    if (role) {
        admin.role = role
    }

    if (isActive !== undefined) {
        admin.isActive = !!isActive
    }

    await admin.save()

    return res.status(200).json({
        success: true,
        message: 'Admin account updated successfully',
        data: {
            id: admin._id,
            email: admin.email,
            role: admin.role,
            isActive: admin.isActive
        }
    })
})

// Delete an admin account
export const deleteAdminAccount = asyncHandler(async (req, res) => {
    const { id } = req.params

    // Prevent admin from deleting themselves
    if (req.admin && String(req.admin.adminDbId) === String(id)) {
        return res.status(400).json({ success: false, message: 'You cannot delete your own active session account' })
    }

    const result = await Admin.deleteOne({ _id: id })
    if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, message: 'Admin account not found' })
    }

    return res.status(200).json({
        success: true,
        message: 'Admin account deleted successfully'
    })
})

// Reveal plaintext password for Super Admins
export const revealAdminPassword = asyncHandler(async (req, res) => {
    // Only allow superadmin to view passwords
    if (req.admin?.role !== 'superadmin') {
        return res.status(403).json({ success: false, message: 'Forbidden: Only Super Admins can reveal passwords' })
    }

    const { id } = req.params
    const admin = await Admin.findById(id).select('passwordEncrypted').lean()
    if (!admin) {
        return res.status(404).json({ success: false, message: 'Admin account not found' })
    }

    if (!admin.passwordEncrypted) {
        return res.status(400).json({ success: false, message: 'Password is not viewable (legacy account). Please reset the password to enable viewing.' })
    }

    const plaintext = decryptPassword(admin.passwordEncrypted)
    if (!plaintext) {
        return res.status(500).json({ success: false, message: 'Failed to decrypt password' })
    }

    return res.status(200).json({
        success: true,
        data: { password: plaintext }
    })
})

// Send OTP via email to recover password
export const forgotPasswordRequest = asyncHandler(async (req, res) => {
    const { email } = req.body || {}
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' })
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    const admin = await Admin.findOne({ email: normalizedEmail }).lean()
    if (!admin) {
        return res.status(404).json({ success: false, message: 'No admin account found with this email' })
    }

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000))
    
    // Expire in 10 minutes
    otpStore.set(normalizedEmail, {
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000
    })

    console.log(`\n======================================================`)
    console.log(`[OTP FORGOT PASSWORD] Generated OTP ${otp} for ${normalizedEmail}`)
    console.log(`======================================================\n`)

    // Send email using nodemailer
    try {
        const smtpHost = process.env.SMTP_HOST
        const smtpPort = process.env.SMTP_PORT || 587
        const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER
        const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS

        if (smtpUser && smtpPass) {
            const transporter = nodemailer.createTransport({
                host: smtpHost || 'smtp.gmail.com',
                port: Number(smtpPort),
                secure: Number(smtpPort) === 465,
                auth: {
                    user: smtpUser,
                    pass: smtpPass
                }
            })

            const emailText = `Hello,

You requested a 6-digit OTP verification code to retrieve/reset your Login Sports Academy admin password.

Verification Code: ${otp}

This code will expire in 10 minutes. For security, please do not share this code with anyone.

Best regards,
Login Sports Academy Support`;

            const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>LSA OTP Verification</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 20px; background-color: #f9fafb; color: #1f2937;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <tr>
      <td style="padding: 24px 32px; background-color: #111827; text-align: center;">
        <h2 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">Login Sports Academy</h2>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px 32px 24px 32px;">
        <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.5; color: #374151;">Hello,</p>
        <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.5; color: #4b5563;">You requested a verification OTP to retrieve or reset your admin login password. Please use the following code to proceed:</p>
        
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center" style="padding: 16px; background-color: #f3f4f6; border-radius: 6px;">
              <span style="font-family: Monaco, Consolas, 'Courier New', monospace; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #2563eb; display: inline-block; padding-left: 6px;">${otp}</span>
            </td>
          </tr>
        </table>

        <p style="margin: 24px 0 0 0; font-size: 14px; line-height: 1.5; color: #ef4444; font-weight: 500;">
          Note: This code will expire in 10 minutes. For security reasons, do not share it with anyone.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 32px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #9ca3af;">
        <p style="margin: 0 0 4px 0;">This is an automated system email. Please do not reply directly to this message.</p>
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Login Sports Academy. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

            await transporter.sendMail({
                from: `"Login Sports Academy" <${smtpUser}>`,
                to: normalizedEmail,
                subject: `LSA Admin OTP Code: ${otp}`,
                text: emailText,
                html: emailHtml
            })
            console.log(`[OTP FORGOT PASSWORD] Sent email successfully to ${normalizedEmail}`)
        } else {
            console.warn(`[OTP FORGOT PASSWORD] SMTP credentials are not configured in server/.env. OTP printed to server log above.`)
        }
    } catch (err) {
        console.error(`[OTP FORGOT PASSWORD] Failed to send email:`, err)
    }

    return res.status(200).json({
        success: true,
        message: 'OTP verification code sent to your registered email successfully'
    })
})

// Verify OTP, return plaintext password and log them in
export const verifyForgotOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body || {}
    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP are required' })
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    const stored = otpStore.get(normalizedEmail)

    if (!stored) {
        return res.status(400).json({ success: false, message: 'No OTP requested or expired' })
    }

    if (Date.now() > stored.expiresAt) {
        otpStore.delete(normalizedEmail)
        return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' })
    }

    if (String(stored.otp).trim() !== String(otp).trim()) {
        return res.status(400).json({ success: false, message: 'Invalid OTP code. Please check and try again.' })
    }

    // OTP is valid! Clear it
    otpStore.delete(normalizedEmail)

    // Retrieve the admin details
    const admin = await Admin.findOne({ email: normalizedEmail })
    if (!admin) {
        return res.status(404).json({ success: false, message: 'Admin account not found' })
    }

    let plaintextPassword = ''
    if (admin.passwordEncrypted) {
        plaintextPassword = decryptPassword(admin.passwordEncrypted)
    } else {
        // Legacy user without passwordEncrypted. Let's generate a new random password, update both, and show it.
        plaintextPassword = Math.random().toString(36).slice(-10) + 'Lsa!'
        const salt = await bcrypt.genSalt(10)
        admin.passwordHash = await bcrypt.hash(plaintextPassword, salt)
        admin.passwordEncrypted = encryptPassword(plaintextPassword)
        await admin.save()
    }

    // Automatically log the admin in
    const token = jwt.sign(
        {
            role: admin.role || 'admin',
            email: admin.email,
            adminDbId: String(admin._id),
            typ: 'admin',
        },
        getJwtSecret(),
        { expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || '7d' }
    )

    return res.status(200).json({
        success: true,
        message: 'OTP verified successfully. Welcome back!',
        data: {
            token,
            expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || '7d',
            password: plaintextPassword,
            admin: {
                id: String(admin._id),
                email: admin.email,
                role: admin.role || 'admin',
            }
        }
    })
})
