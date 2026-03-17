import { Request, Response, NextFunction } from 'express';
import { Match } from '../models/Match';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/errorHandler';

export const getAllMatches = catchAsync(async (req: Request, res: Response) => {
  let filter = {};
  if (req.query.tournamentId) filter = { tournamentId: req.query.tournamentId };
  if (req.query.refereeId) filter = { ...filter, refereeId: req.query.refereeId };

  const matches = await Match.find(filter)
    .populate('teamA', 'name')
    .populate('teamB', 'name')
    .populate('refereeId', 'name');

  res.status(200).json({
    status: 'success',
    results: matches.length,
    data: {
      matches,
    },
  });
});

export const createMatch = catchAsync(async (req: Request, res: Response) => {
  const newMatch = await Match.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      match: newMatch,
    },
  });
});

export const updateMatch = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const match = await Match.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!match) {
    return next(new AppError('No match found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      match,
    },
  });
});
