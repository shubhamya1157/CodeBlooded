import mongoose from 'mongoose';

const RegistrationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    orgId: { type: mongoose.Schema.Types.ObjectId },
    status: {
      type: String,
      enum: ['confirmed', 'waitlisted', 'cancelled'],
      default: 'confirmed',
    },
    source: { type: String, default: 'api' },
  },
  { timestamps: true }
);

RegistrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

export const Registration = mongoose.model('Registration', RegistrationSchema);
