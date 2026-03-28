/**
 * What it is: Backend server entry point (starts Express API + connects DB).
 * Non-tech note: This is the “engine” that powers the website’s data.
 */

import './config/env.js'
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import apiRoutes from './routes/api.js'

// Connect to database
connectDB()
const app = express()

// Middleware  
const normalizeOrigin = value => {
  const s = String(value || '').trim()
  // Browsers never include a trailing slash in the Origin header,
  // but humans often paste one in env vars.
  return s.endsWith('/') ? s.slice(0, -1) : s
}

// If you do NOT set CORS_ORIGINS on the host (Render), we fall back to safe defaults here.
// Update these when you change your frontend domain.
const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  // Netlify production domain
  'https://loginsportsacademy.netlify.app',
  'https://loginsportsacademy.in',
  'https://www.loginsportsacademy.in',
  // Netlify deploy previews
  'https://*--loginsportsacademy.netlify.app',
  'https://login-sports-academy.onrender.com/api/admin/login'
]

const allowedOriginsRaw = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => normalizeOrigin(s))
  .filter(Boolean)

const effectiveOriginsRaw = allowedOriginsRaw.length ? allowedOriginsRaw : DEFAULT_ALLOWED_ORIGINS

// Supports exact origins and simple wildcard patterns using '*'.
// Examples:
// - https://loginsportsacademy.netlify.app
// - https://*--loginsportsacademy.netlify.app (Netlify deploy previews)
// - http://localhost:5173
const toOriginMatcher = value => {
  const v = normalizeOrigin(value)
  if (!v) return null
  if (!v.includes('*')) return { type: 'exact', value: v }

  const escaped = v.replace(/[.+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`^${escaped.replace(/\*/g, '.*')}$`)
  return { type: 'regex', value: v, regex }
}

const allowedOriginMatchers = effectiveOriginsRaw.map(toOriginMatcher).filter(Boolean)
const corsOrigins = allowedOriginMatchers

app.use(cors({
  // Checks if the incoming request's origin is in our whitelist (localhost dev + Netlify production)
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)

    const normalized = normalizeOrigin(origin)

    const allowed = corsOrigins.some(m => {
      if (!m) return false
      if (typeof m === 'string') return normalizeOrigin(m) === normalized
      if (m.type === 'exact') return m.value === normalized
      if (m.type === 'regex') return Boolean(m.regex?.test(normalized))
      return false
    })

    if (!allowed) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.'
      return callback(new Error(msg), false)
    }
    return callback(null, true)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key']
}))

// Capture raw body (needed for Razorpay webhook signature verification)
app.use(
  express.json({
    // Stores the raw request body for Razorpay webhook signature verification
    verify: (req, res, buf) => {
      req.rawBody = buf
    },
  })
)

// Health check endpoint
// Returns a status message confirming the API is running
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Login Swim Academy API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  })
})

// Health check endpoint for deployment monitors (Netlify/Vercel)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() })
})

// Routes
app.use('/api', apiRoutes)

// 404 handler
// Catches any unmatched routes and returns 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

// Error handler
// Global error handler — hides stack traces in production
app.use((err, req, res, _next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
})

const PORT = process.env.PORT || 8000

// Start the server and log the API URL
app.listen(PORT,
() => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
  console.log(`📍 API available at http://localhost:${PORT}/api`)
})