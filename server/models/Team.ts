import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sport: { type: String, required: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament' }, // Optional, if a team is specific to a tournament
  coach: { type: String },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  season: { type: String },
  stats: {
    played: { type: Number, default: 0 },
    won: { type: Number, default: 0 },
    lost: { type: Number, default: 0 },
    draw: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    nrr: { type: Number, default: 0 } // Net Run Rate for Cricket
  },
  createdAt: { type: Date, default: Date.now }
});

export const Team = mongoose.model('Team', teamSchema);
