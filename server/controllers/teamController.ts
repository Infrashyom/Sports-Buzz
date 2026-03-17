import { Request, Response, NextFunction } from 'express';
import { Team } from '../models/Team';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/errorHandler';

export const getAllTeams = catchAsync(async (req: Request, res: Response) => {
  let filter = {};
  if (req.params.schoolId) filter = { schoolId: req.params.schoolId };

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
  if (!req.body.schoolId) req.body.schoolId = req.params.schoolId;

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
