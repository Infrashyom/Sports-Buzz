import mongoose from 'mongoose';

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sport: { type: String, required: true }, // Could be a reference to a Sport model if needed
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['UPCOMING', 'ONGOING', 'COMPLETED'], default: 'UPCOMING' },
  description: { type: String },
  location: { type: String },
  organizer: { type: String }, // Or ref to User/Admin
  prizePool: { type: String },
  participatingSchools: [{ type: mongoose.Schema.Types.ObjectId, ref: 'School' }],
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }], // Teams registered for this tournament
  pointsTable: [{
    team: { type: String },
    played: { type: Number, default: 0 },
    won: { type: Number, default: 0 },
    lost: { type: Number, default: 0 },
    draw: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    diff: { type: Number, default: 0 }
  }],
  refereeEditedPointsTable: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Tournament = mongoose.model('Tournament', tournamentSchema);
