import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { School } from '../models/School';
import { AppError } from '../utils/errorHandler';
import { catchAsync } from '../utils/catchAsync';

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

   
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

   
  (req as any).user = currentUser;
  next();
});

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
     
    if (!roles.includes((req as any).user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

export const checkSchoolAccess = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   
  const user = (req as any).user;
  if (!user) return next(new AppError('Not authenticated', 401));
  if (user.role === 'ADMIN') return next();
  
  const targetSchoolId = req.params.id || req.params.schoolId;
  
  if (user.role === 'SCHOOL') {
    if (user.schoolId && user.schoolId.toString() === targetSchoolId) {
      return next();
    }
    
    // Fallback: check if this user is the adminUserId for the target school
    const school = await School.findById(targetSchoolId);
    if (school && school.adminUserId.toString() === user._id.toString()) {
      return next();
    }
    
    // Another fallback: if the route explicitly passed the user's ID as the school ID
    if (user._id.toString() === targetSchoolId) {
       return next();
    }
  }
  
  return next(new AppError('You do not have permission to access this school portal', 403));
});
