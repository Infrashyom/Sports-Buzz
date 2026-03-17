import { Request, Response, NextFunction } from 'express';
import { School } from '../models/School';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/errorHandler';

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
  const school = await School.findById(req.params.id).populate('adminUserId');

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
  const school = await School.findById(req.params.id);

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
