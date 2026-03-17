import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contactEmail: { type: String, required: true },
  phone: { type: String },
  description: { type: String },
  logo: { type: String },
  isSubscribed: { type: Boolean, default: false },
  paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
  studentCount: { type: Number, default: 0 },
  cityRank: { type: Number },
  adminUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to the user managing this school
  facilities: [{
    name: { type: String },
    type: { type: String, enum: ['Indoor', 'Outdoor', 'Pool', 'Gym', 'Field'] },
    status: { type: String, enum: ['Available', 'Booked', 'Maintenance'] }
  }],
  createdAt: { type: Date, default: Date.now }
});

export const School = mongoose.model('School', schoolSchema);
