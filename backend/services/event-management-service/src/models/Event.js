import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ["hackathon", "cultural", "sports", "workshop", "lecture"], required: true },
  orgId: { type: mongoose.Schema.Types.ObjectId, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
  venue: { type: String },
  capacity: { type: Number, default: 0 },
  registeredCount: { type: Number, default: 0 },
  registrationDeadline: { type: Date },
  startsAt: { type: Date },
  endsAt: { type: Date },
  status: { type: String, enum: ["draft", "published", "cancelled", "completed"], default: "published" },
  tags: [{ type: String }],
  aiSummary: { type: String }
}, { timestamps: true });

export const Event = mongoose.model('Event', EventSchema);
