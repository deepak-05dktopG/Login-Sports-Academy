/**
 * What it is: API route list (maps URLs to controller functions).
 * Non-tech note: This file decides “which link does what” on the backend.
 */

import express from 'express';
import { adminLogin, adminMe, getAllAdmins, createAdminAccount, updateAdminAccount, deleteAdminAccount, revealAdminPassword, forgotPasswordRequest, verifyForgotOtp } from '../controllers/adminAuthController.js';
import requireAdminAuth from '../middleware/requireAdminAuth.js';
import {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedbackStatus,
  deleteFeedback,
  getFeedbackStats
} from '../controllers/feedbackController.js';
import Settings from '../models/Settings.js';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostStats
} from '../controllers/postController.js';
import {
  createWorksheet,
  getAllWorksheets,
  getWorksheetById,
  updateWorksheet,
  deleteWorksheet,
  incrementClick,
  getWorksheetStats
} from '../controllers/worksheetController.js';
import {
  createGalleryImage,
  getAllGalleryImages,
  getGalleryImageById,
  updateGalleryImage,
  deleteGalleryImage,
  getGalleryStats
} from '../controllers/galleryController.js';
import {
  getDailyTrackerByDate,
  getAllTrackerEntries,
  addDailyTrackerEntry,
  updateDailyTrackerEntry,
  deleteDailyTrackerById,
  deleteDailyTrackerByDate,
  deleteAllTrackerEntries
} from '../controllers/dailyTrackerController.js';

import {
  listPlans,
  seedOfficialPlans,
  registerPaidMembership,
  registerOfflineMembership,
  createRazorpayOrder,
  verifyRazorpayPayment,
  razorpayWebhook,
  listMembers,
  bulkDeleteMembersByIds,
  deleteMember,
  getPublicMemberData,
  updateMember,
  createPlan,
  updatePlan,
  deletePlan,
} from '../controllers/membershipController.js';

import { scanAttendance, listAttendance, exportAttendanceCsv, deleteAttendance, bulkDeleteAttendance, purgeAttendanceBefore } from '../controllers/attendanceController.js';
import whatsappRoutes from './whatsappRoutes.js';


const router = express.Router();

// Admin auth
router.post('/admin/login', adminLogin);
router.get('/admin/me', requireAdminAuth, adminMe);
router.get('/admin/accounts', requireAdminAuth, getAllAdmins);
router.post('/admin/accounts', requireAdminAuth, createAdminAccount);
router.put('/admin/accounts/:id', requireAdminAuth, updateAdminAccount);
router.delete('/admin/accounts/:id', requireAdminAuth, deleteAdminAccount);
router.get('/admin/accounts/:id/password', requireAdminAuth, revealAdminPassword);
router.post('/admin/forgot-password', forgotPasswordRequest);
router.post('/admin/verify-otp', verifyForgotOtp);

// Feedback routes
// Public routes
router.post('/feedback', createFeedback);
// Admin routes (you can add auth middleware later)
router.get('/feedback', requireAdminAuth, getAllFeedback);
router.get('/feedback/stats', requireAdminAuth, getFeedbackStats);
router.get('/feedback/:id', requireAdminAuth, getFeedbackById);
router.patch('/feedback/:id', requireAdminAuth, updateFeedbackStatus);
router.delete('/feedback/:id', requireAdminAuth, deleteFeedback);

// Post routes
// Public routes
router.get('/posts', getAllPosts);
router.get('/posts/:id', getPostById);
// Admin routes (you can add auth middleware later)
router.post('/posts', requireAdminAuth, createPost);
router.get('/posts/stats', requireAdminAuth, getPostStats);
router.patch('/posts/:id', requireAdminAuth, updatePost);
router.delete('/posts/:id', requireAdminAuth, deletePost);

// Worksheet routes
// Team/Admin routes (accessible to team members)
router.get('/worksheets', getAllWorksheets);
router.get('/worksheets/stats', requireAdminAuth, getWorksheetStats);
router.get('/worksheets/:id', getWorksheetById);
router.post('/worksheets', requireAdminAuth, createWorksheet);
router.patch('/worksheets/:id', requireAdminAuth, updateWorksheet);
router.delete('/worksheets/:id', requireAdminAuth, deleteWorksheet);
router.patch('/worksheets/:id/click', incrementClick);

// Gallery routes
// Public routes
router.get('/gallery', getAllGalleryImages);
router.get('/gallery/:id', getGalleryImageById);
// Admin routes
router.post('/gallery', requireAdminAuth, createGalleryImage);
router.get('/gallery/stats', requireAdminAuth, getGalleryStats);
router.patch('/gallery/:id', requireAdminAuth, updateGalleryImage);
router.delete('/gallery/:id', requireAdminAuth, deleteGalleryImage);

// Membership registration (Payment integration later)
router.get('/membership/plans', listPlans);
router.get('/membership/public-id/:id', getPublicMemberData);
router.post('/membership/plans/seed', requireAdminAuth, seedOfficialPlans);
router.post('/membership/register', registerPaidMembership);

// Admin simple plan management
router.post('/admin/membership/plans', requireAdminAuth, createPlan);
router.patch('/admin/membership/plans/:id', requireAdminAuth, updatePlan);
router.delete('/admin/membership/plans/:id', requireAdminAuth, deletePlan);

// Admin-only: offline (cash) registration
router.post('/admin/membership/offline-register', requireAdminAuth, registerOfflineMembership);

router.get('/membership/members', requireAdminAuth, listMembers);
router.put('/admin/membership/members/:id', requireAdminAuth, updateMember);
router.post('/membership/members/bulk-delete', requireAdminAuth, bulkDeleteMembersByIds);
router.delete('/membership/members/:id', requireAdminAuth, deleteMember);

// Payments (Razorpay)
router.post('/payments/razorpay/order', createRazorpayOrder);
router.post('/payments/razorpay/verify', verifyRazorpayPayment);
router.post('/payments/razorpay/webhook', razorpayWebhook);

// Attendance
router.post('/attendance/scan', requireAdminAuth, scanAttendance);
router.get('/attendance', requireAdminAuth, listAttendance);
router.get('/attendance/export', requireAdminAuth, exportAttendanceCsv);
router.delete('/attendance/purge', requireAdminAuth, purgeAttendanceBefore);
router.delete('/attendance/:id', requireAdminAuth, deleteAttendance);
router.post('/attendance/bulk-delete', requireAdminAuth, bulkDeleteAttendance);

// Daily Tracker routes
router.get('/daily-tracker/all', requireAdminAuth, getAllTrackerEntries);
router.get('/daily-tracker', requireAdminAuth, getDailyTrackerByDate);
router.post('/daily-tracker', requireAdminAuth, addDailyTrackerEntry);
router.patch('/daily-tracker/:id', requireAdminAuth, updateDailyTrackerEntry);
router.delete('/daily-tracker/all', requireAdminAuth, deleteAllTrackerEntries);
router.delete('/daily-tracker/:id', requireAdminAuth, deleteDailyTrackerById);
router.delete('/daily-tracker', requireAdminAuth, deleteDailyTrackerByDate);

// WhatsApp notification routes
router.use('/whatsapp', whatsappRoutes);

// Generic Settings routes
router.get('/settings/:key', async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: req.params.key });
    res.json({ success: true, value: setting ? setting.value : null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/admin/settings/:key', requireAdminAuth, async (req, res) => {
  try {
    const { value } = req.body;
    const setting = await Settings.findOneAndUpdate(
      { key: req.params.key },
      { value },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: setting });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
