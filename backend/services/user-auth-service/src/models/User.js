import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  avatar: { type: String },
  role: { type: String, enum: ['student', 'organiser', 'admin'], default: 'student' },
  eventsRegistered: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  eventsAttended: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  registrationStatus: { type: String, enum: ['pending', 'confirmed', 'waitlisted'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', UserSchema);
