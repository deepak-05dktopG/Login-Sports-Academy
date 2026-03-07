/**
 * What it is: Feedback API controller.
 * Non-tech note: Saves and manages messages users submit from the Contact page.
 */

import Feedback from '../models/Feedback.js';
import { sendEmail } from '../utils/emailService.js';

const DEFAULT_CONTACT_TO_EMAIL = 'loginsportsacadamy@gmail.com';

// @desc    Submit new feedback
// @route   POST /api/feedback
// @access  Public
export // Saves a new contact form submission from a website visitor
const createFeedback = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, phone, and message'
      });
    }

    // Get IP address and user agent
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    // Create new feedback
    const feedback = await Feedback.create({
      name,
      email,
      phone,
      message,
      ipAddress,
      userAgent,
      source: 'contact-form'
    });

    // Best-effort email notification (don’t fail the request if SMTP isn’t configured)
    const contactTo = process.env.CONTACT_TO_EMAIL || DEFAULT_CONTACT_TO_EMAIL;
    const emailConfigured = Boolean(process.env.EMAIL_SERVICE && process.env.EMAIL_USER && process.env.EMAIL_PASS);
    let emailNotification = { attempted: false, sent: false };

    if (emailConfigured) {
      emailNotification.attempted = true;
      try {
        await sendEmail({
          to: contactTo,
          subject: `New website enquiry — ${name}`,
          text: [
            'New contact message received:',
            `Name: ${name}`,
            `Email: ${email}`,
            `Phone: ${phone}`,
            '',
            message,
            '',
            `Feedback ID: ${feedback._id}`,
          ].join('\n'),
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5;">
              <h2 style="margin: 0 0 12px;">New website enquiry</h2>
              <p style="margin: 0 0 12px; color: #1c2a36;">A new message was submitted from the Contact page.</p>
              <table cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
                <tr><td><strong>Name</strong></td><td>${name}</td></tr>
                <tr><td><strong>Email</strong></td><td>${email}</td></tr>
                <tr><td><strong>Phone</strong></td><td>${phone}</td></tr>
                <tr><td><strong>Feedback ID</strong></td><td>${feedback._id}</td></tr>
              </table>
              <div style="margin-top: 12px; padding: 12px; background: #f5fbff; border: 1px solid rgba(6,24,38,0.12); border-radius: 10px;">
                <div style="font-weight: 700; margin-bottom: 6px;">Message</div>
                <div style="white-space: pre-wrap;">${message}</div>
              </div>
            </div>
          `,
        })
        emailNotification.sent = true;
      } catch (emailError) {
        console.error('Feedback email notification failed:', emailError);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! We will get back to you soon.',
      data: {
        id: feedback._id,
        name: feedback.name,
        email: feedback.email,
        createdAt: feedback.createdAt,
        emailNotification,
      }
    });
  } catch (error) {
    console.error('Error creating feedback:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(
      // Extract each validation error message
      err => {
        return err.message;
      });
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback. Please try again later.'
    });
  }
};

// @desc    Get all feedback (Admin only)
// @route   GET /api/feedback
// @access  Private/Admin
export // Returns paginated list of all feedback for the admin panel
const getAllFeedback = async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;

    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get feedback with pagination
    const feedback = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count
    const total = await Feedback.countDocuments(query);

    res.status(200).json({
      success: true,
      count: feedback.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: feedback
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback'
    });
  }
};

// @desc    Get single feedback by ID
// @route   GET /api/feedback/:id
// @access  Private/Admin
export // Returns a single feedback entry by its database ID
const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback'
    });
  }
};

// @desc    Update feedback status
// @route   PATCH /api/feedback/:id
// @access  Private/Admin
export // Updates feedback status (unread/read/replied) for admin tracking
const updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['unread', 'read', 'replied'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: unread, read, or replied'
      });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback status updated successfully',
      data: feedback
    });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update feedback status'
    });
  }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private/Admin
export // Permanently removes a feedback entry from the database
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete feedback'
    });
  }
};

// @desc    Get feedback statistics
// @route   GET /api/feedback/stats
// @access  Private/Admin
export // Returns feedback counts by status (unread/read/replied) for the dashboard
const getFeedbackStats = async (req, res) => {
  try {
    const totalFeedback = await Feedback.countDocuments();
    const unreadFeedback = await Feedback.countDocuments({ status: 'unread' });
    const readFeedback = await Feedback.countDocuments({ status: 'read' });
    const repliedFeedback = await Feedback.countDocuments({ status: 'replied' });

    // Get feedback from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentFeedback = await Feedback.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalFeedback,
        unread: unreadFeedback,
        read: readFeedback,
        replied: repliedFeedback,
        lastWeek: recentFeedback
      }
    });
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback statistics'
    });
  }
};
