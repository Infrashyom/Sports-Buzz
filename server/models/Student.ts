import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentId: { type: String, required: true }, // Internal School ID
  grade: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  sports: [{ type: String }], // e.g., ['Cricket', 'Basketball']
  status: { type: String, enum: ['Active', 'Injured', 'Alumni'], default: 'Active' },
  avatar: { type: String },
  badges: [{ type: String }], // e.g., ['Man of the Match', 'Best Defender']
  stats: {
    matchesPlayed: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    // Add more specific stats as needed (e.g., runs, goals)
  },
  createdAt: { type: Date, default: Date.now }
});

export const Student = mongoose.model('Student', studentSchema);
