import { Request, Response, NextFunction } from 'express';
import { Tournament } from '../models/Tournament';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/errorHandler';

export const getAllTournaments = catchAsync(async (req: Request, res: Response) => {
  const tournaments = await Tournament.find();

  res.status(200).json({
    status: 'success',
    results: tournaments.length,
    data: {
      tournaments,
    },
  });
});

export const createTournament = catchAsync(async (req: Request, res: Response) => {
  const newTournament = await Tournament.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tournament: newTournament,
    },
  });
});

export const updatePointsTable = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const tournament = await Tournament.findById(req.params.id);

  if (!tournament) {
    return next(new AppError('No tournament found with that ID', 404));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = (req as any).user;

  if (user.role === 'REFEREE') {
    if (tournament.refereeEditedPointsTable) {
      return next(new AppError('Referee can only edit the points table once', 403));
    }
    tournament.refereeEditedPointsTable = true;
  }

  tournament.pointsTable = req.body.pointsTable;
  await tournament.save();

  res.status(200).json({
    status: 'success',
    data: {
      tournament,
    },
  });
});
export const registerTeam = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const tournament = await Tournament.findById(req.params.id);

  if (!tournament) {
    return next(new AppError('No tournament found with that ID', 404));
  }

  // Check if team is already registered
  if (tournament.teams.includes(req.body.teamId)) {
    return next(new AppError('Team already registered for this tournament', 400));
  }

  tournament.teams.push(req.body.teamId);
  await tournament.save();

  res.status(200).json({
    status: 'success',
    data: {
      tournament,
    },
  });
});
