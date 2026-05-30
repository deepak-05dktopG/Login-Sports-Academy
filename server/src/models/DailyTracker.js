// DailyTracker.js - Mongoose model for daily money interactions
import mongoose from 'mongoose';

const dailyTrackerSchema = new mongoose.Schema({
  type: { type: String, required: true },
  name: { type: String, required: true },
  serviceType: { type: String, enum: ['swimming', 'badminton'], default: 'swimming' },
  paymentType: { type: String, enum: ['cash', 'gpay', 'razorpay', 'mock', 'phonepay', 'paytm'], required: true },
  amount: { type: Number, required: true },
  sessionAmount: { type: Number },
  headsCount: { type: Number, default: 1 },
  stockTotal: { type: Number, default: 0 },
  stockItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true, default: 1 },
      price: { type: Number, required: true },
      total: { type: Number, required: true }
    }
  ],
  date: { type: String, required: true }, // YYYY-MM-DD
  time: { type: String, required: true }, // HH:mm
  notes: { type: String },
  // Optionally link to member/payment for registrations
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
}, { timestamps: true });

export default mongoose.model('DailyTracker', dailyTrackerSchema);
