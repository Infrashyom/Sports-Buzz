import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/errorHandler';

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const userData = { ...req.body };
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 12);
  }

  const newUser = await User.create(userData);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

export const updateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findByIdAndUpdate(req.params.id, { status: req.body.status }, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const getReferees = catchAsync(async (req: Request, res: Response) => {
  const referees = await User.find({ role: 'REFEREE' });

  res.status(200).json({
    status: 'success',
    results: referees.length,
    data: {
      referees,
    },
  });
});
