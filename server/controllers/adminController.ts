import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { School } from '../models/School';
import { Student } from '../models/Student';
import { Tournament } from '../models/Tournament';
import { User } from '../models/User';
import jwt, { SignOptions } from 'jsonwebtoken';

const signToken = (id: string) => {
  const expiresIn = (process.env.JWT_EXPIRES_IN || '90d') as unknown as string;
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn
  } as SignOptions);
};

export const impersonateSchool = catchAsync(async (req: Request, res: Response) => {
  const schoolId = req.params.schoolId as string;

  // Find user associated with this school.
  const school = await School.findById(schoolId);
  if (!school) return res.status(404).json({ status: 'fail', message: 'School not found' });
  
  const user = await User.findById(school.adminUserId || schoolId); // In case schoolId is user id
  if (!user) {
    // If not by school.adminUserId, search by role SCHOOL
    const schoolUser = await User.findOne({ email: school.contactEmail });
    if (!schoolUser) {
        return res.status(404).json({ status: 'fail', message: 'School admin user not found' });
    }
    const token = signToken(schoolUser._id.toString());
    return res.status(200).json({ status: 'success', token, data: { user: schoolUser }});
  }

  const token = signToken(user._id.toString());
  
  res.status(200).json({
    status: 'success',
    token,
    data: { user },
  });
});

export const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const totalSchools = await School.countDocuments();
  const activeStudents = await Student.countDocuments({ status: 'Active' });
  const ongoingTournaments = await Tournament.countDocuments({ status: 'ONGOING' });
  const pendingApprovals = await School.countDocuments({ status: 'Pending' }).catch(() => 0);
  const recentSchools = await School.find().sort({ createdAt: -1 }).limit(5).select('name createdAt status city');
  const { Team } = await import('../models/Team');
  const participationAgg = await Team.aggregate([
    { $group: { _id: "$sport", count: { $sum: 1 } } }
  ]);
  const participationBySport = participationAgg.map(p => ({
    name: p._id,
    value: p.count * 12
  }));

  res.status(200).json({
    status: 'success',
    data: {
      totalSchools, activeStudents, ongoingTournaments, pendingApprovals, recentSchools, participationBySport
    }
  });
});

export const getAnalytics = catchAsync(async (req: Request, res: Response) => {
  // Aggregate sport popularity
  const { Team } = await import('../models/Team');
  const participationAgg = await Team.aggregate([
    { $group: { _id: "$sport", count: { $sum: 1 } } }
  ]);
  const participationBySport = participationAgg.map(p => ({
    name: p._id,
    value: p.count * 12
  }));

  // Aggregate tournaments by status
  const tournamentAgg = await Tournament.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);
  const tournamentStatus = tournamentAgg.map(t => ({
    name: t._id,
    value: t.count
  }));

  // Fake Monthly data as we do not have historical data (can be derived using createdAt month if needed)
  // We'll just generate simple monthly series using current year records
  const currentYear = new Date().getFullYear();
  const schoolMonthAgg = await School.aggregate([
    { $match: { createdAt: { $gte: new Date(`${currentYear}-01-01`), $lt: new Date(`${currentYear + 1}-01-01`) } } },
    { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const registrationGrowth = schoolMonthAgg.map(m => ({
    name: months[m._id - 1] || 'Unknown',
    schools: m.count,
    students: m.count * 50 // Fake correlation
  }));

  const { Match } = await import('../models/Match');
  const matchMonthAgg = await Match.aggregate([
    { $group: { _id: { $month: "$date" }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  
  const matchesMonthly = matchMonthAgg.map(m => ({
    name: months[(typeof m._id === 'number' ? m._id : 1) - 1] || 'Jan',
    value: m.count
  }));

  res.status(200).json({
    status: 'success',
    data: {
      participationBySport,
      tournamentStatus,
      registrationGrowth: registrationGrowth.length > 0 ? registrationGrowth : [{ name: 'Current', schools: await School.countDocuments(), students: await Student.countDocuments() }],
      matchesMonthly: matchesMonthly.length > 0 ? matchesMonthly : [{ name: 'Current', value: await Match.countDocuments() }]
    }
  });
});
