import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
  sport: { type: String, required: true },
  date: { type: Date, required: true },
  teamA: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  teamB: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  scoreA: { type: Number },
  scoreB: { type: Number },
  details: {
    overs: { type: String },
    wicketsA: { type: Number },
    wicketsB: { type: Number },
    setsA: { type: Number },
    setsB: { type: Number },
    quarters: { type: String }
  },
  status: { type: String, enum: ['SCHEDULED', 'LIVE', 'COMPLETED', 'VERIFIED'], default: 'SCHEDULED' },
  refereeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Referee assigned
  location: { type: String },
  manOfTheMatchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  createdAt: { type: Date, default: Date.now }
});

export const Match = mongoose.model('Match', matchSchema);
