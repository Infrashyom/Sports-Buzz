import { Request, Response, NextFunction } from 'express';
import { School } from '../models/School';
import { Team } from '../models/Team';
import { Student } from '../models/Student';
import { Match } from '../models/Match';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/errorHandler';
import cloudinary from '../utils/cloudinary';

export const getAllSchools = catchAsync(async (req: Request, res: Response) => {
  const schools = await School.find();

  res.status(200).json({
    status: 'success',
    results: schools.length,
    data: {
      schools,
    },
  });
});

export const getSchool = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let school;
  try {
    school = await School.findById(req.params.id).populate('adminUserId');
  } catch {
    // Ignore cast errors
  }

  if (!school) {
    return next(new AppError('No school found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      school,
    },
  });
});

export const updateSchool = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.logo && req.body.logo.startsWith('data:image')) {
    try {
      const uploadRes = await cloudinary.uploader.upload(req.body.logo, {
        folder: 'sportsbuzz/schools',
      });
      req.body.logo = uploadRes.secure_url;
    } catch {
      console.error('Cloudinary upload error');
    }
  }

  const school = await School.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!school) {
    return next(new AppError('No school found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      school,
    },
  });
});

export const addFacility = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let school;
  try {
    school = await School.findById(req.params.id);
  } catch {
    // Ignore cast errors
  }

  if (!school) {
    return next(new AppError('No school found with that ID', 404));
  }

  school.facilities.push(req.body);
  await school.save();

  res.status(200).json({
    status: 'success',
    data: {
      school,
    },
  });
});

export const updateFacility = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let school;
  try {
    school = await School.findById(req.params.id);
  } catch {
    // Ignore cast errors
  }

  if (!school) return next(new AppError('No school found with that ID', 404));

  const facility = school.facilities.id(String(req.params.facilityId));
  if (!facility) return next(new AppError('No facility found with that ID', 404));

  if (req.body.status) {
    facility.status = req.body.status;
  }
  await school.save();

  res.status(200).json({
    status: 'success',
    data: { school }
  });
});

export const getDashboardData = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let school;
  try {
    school = await School.findById(req.params.id);
    if (!school) {
        school = await School.findOne({ adminUserId: req.params.id });
    }
  } catch {
    // Ignore cast errors
  }

  if (!school) {
    return next(new AppError('No school found', 404));
  }

  // Find all teams for this school
  const teams = await Team.find({ schoolId: school._id });
  const teamIds = teams.map(t => t._id);

  const totalAthletes = await Student.countDocuments({ schoolId: school._id });
  
  // Recent Matches
  const recentMatches = await Match.find({ 
    $or: [{ teamA: { $in: teamIds } }, { teamB: { $in: teamIds } }],
    status: { $in: ['COMPLETED', 'VERIFIED'] }
  })
  .populate('teamA', 'name')
  .populate('teamB', 'name')
  .sort('-date')
  .limit(3);

  // Next Match
  const nextMatch = await Match.findOne({
    $or: [{ teamA: { $in: teamIds } }, { teamB: { $in: teamIds } }],
    status: { $in: ['SCHEDULED', 'UPCOMING'] }
  })
  .populate('teamA', 'name')
  .populate('teamB', 'name')
  .sort('date');

  const topTeams = await Team.find({ schoolId: school._id })
    .sort({ 'stats.won': -1, 'stats.points': -1 })
    .limit(5);

  res.status(200).json({
    status: 'success',
    data: {
      schoolName: school.name,
      cityRank: school.cityRank,
      totalAthletes,
      recentMatches,
      nextMatch,
      topTeams
    }
  });
});
