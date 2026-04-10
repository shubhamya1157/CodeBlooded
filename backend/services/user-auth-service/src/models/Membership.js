import mongoose from 'mongoose';

const MembershipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  role: { type: String, enum: ['admin', 'senior_exec', 'junior_exec'], required: true },
  joinedAt: { type: Date, default: Date.now }
});

export const Membership = mongoose.model('Membership', MembershipSchema);
