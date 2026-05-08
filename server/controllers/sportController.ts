import { Request, Response, NextFunction } from 'express';
import { SportModel } from '../models/Sport';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/errorHandler';

export const getAllSports = catchAsync(async (req: Request, res: Response) => {
  const sports = await SportModel.find();
  res.status(200).json({
    status: 'success',
    data: { sports },
  });
});

export const createSport = catchAsync(async (req: Request, res: Response) => {
  const sport = await SportModel.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { sport },
  });
});

export const updateSport = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const sport = await SportModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!sport) {
    return next(new AppError('No sport found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { sport },
  });
});

export const deleteSport = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const sport = await SportModel.findByIdAndDelete(req.params.id);
  if (!sport) {
    return next(new AppError('No sport found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
