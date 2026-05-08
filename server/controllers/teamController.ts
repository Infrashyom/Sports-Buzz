import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { Team } from '../models/Team';
import { School } from '../models/School';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/errorHandler';

export const getAllTeams = catchAsync(async (req: Request, res: Response) => {
  const filter: Record<string, any> = {};
  const reqUser = (req as any).user;

  if (reqUser && (reqUser.role === 'SCHOOL' || reqUser.role === 'STUDENT')) {
    if (reqUser.schoolId) {
      filter.schoolId = reqUser.schoolId;
    } else {
      const school = await School.findOne({ adminUserId: reqUser._id });
      if (school) filter.schoolId = school._id;
    }
  } else if (req.params.schoolId) {
    if (!mongoose.Types.ObjectId.isValid(String(req.params.schoolId))) {
      const school = await School.findOne({ adminUserId: req.params.schoolId });
      if (school) filter.schoolId = school._id;
      else return res.status(200).json({ status: 'success', results: 0, data: { teams: [] } });
    } else {
      filter.schoolId = req.params.schoolId;
    }
  }

  const teams = await Team.find(filter).populate('players');

  res.status(200).json({
    status: 'success',
    results: teams.length,
    data: {
      teams,
    },
  });
});

export const createTeam = catchAsync(async (req: Request, res: Response) => {
  if (!req.body.schoolId) {
    if (mongoose.Types.ObjectId.isValid(String(req.params.schoolId))) {
      req.body.schoolId = req.params.schoolId;
    } else {
      const school = await School.findOne({ adminUserId: req.params.schoolId });
      if (school) req.body.schoolId = school._id;
    }
  }

  const newTeam = await Team.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      team: newTeam,
    },
  });
});

export const updateTeam = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!team) {
    return next(new AppError('No team found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      team,
    },
  });
});
