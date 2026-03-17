import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AppError } from '../utils/errorHandler';
import { catchAsync } from '../utils/catchAsync';
import { mockUsers } from '../controllers/authController';

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;

  // Check for mock user
  if (decoded.id && decoded.id.startsWith('mock-')) {
    const mockUser = Object.values(mockUsers).find(u => u._id === decoded.id);
    if (mockUser) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).user = mockUser;
      return next();
    }
  }

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as any).user = currentUser;
  next();
});

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!roles.includes((req as any).user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
