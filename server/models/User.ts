import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'SCHOOL', 'REFEREE', 'STUDENT'], required: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' }, // For SCHOOL and STUDENT roles
  avatar: { type: String },
  mobile: { type: String },
  // Referee Specific
  rating: { type: Number, min: 0, max: 5, default: 0 },
  experience: { type: String },
  certifications: [{ 
    name: { type: String },
    status: { type: String, enum: ['Pending', 'Verified'], default: 'Pending' }
  }],
  availability: { type: Boolean, default: true },
  status: { type: String, enum: ['Active', 'Pending', 'Inactive'], default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
