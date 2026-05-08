import mongoose from 'mongoose';

const sportSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, enum: ['Indoor', 'Outdoor'], required: true },
  icon: { type: String, required: true },
  rules: [{ type: String }],
  badges: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export const SportModel = mongoose.model('Sport', sportSchema);
