import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { School } from '../models/School';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/errorHandler';

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: (process.env.JWT_EXPIRES_IN || '90d') as jwt.SignOptions['expiresIn'],
  });
};

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, role, mobile, schoolName, schoolAddress, schoolEmail } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already in use', 400));
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    mobile,
  });

  if (role === 'SCHOOL') {
    if (!schoolName || !schoolAddress || !schoolEmail) {
      return next(new AppError('School details are required for SCHOOL role', 400));
    }
    const newSchool = await School.create({
      name: schoolName,
      address: schoolAddress,
      contactEmail: schoolEmail,
      adminUserId: newUser._id,
    });
    newUser.schoolId = newSchool._id as mongoose.Types.ObjectId;
    await newUser.save();
  }

  const token = signToken((newUser._id as mongoose.Types.ObjectId).toString());

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

export const mockUsers: Record<string, Record<string, unknown>> = {
  'admin@sportsbuzz.com': { _id: 'mock-admin-id', id: 'mock-admin-id', name: 'Super Admin', email: 'admin@sportsbuzz.com', role: 'ADMIN', status: 'Active' },
  'school@springfield.edu': { _id: 'mock-school-id', id: 'mock-school-id', name: 'Principal Skinner', email: 'school@springfield.edu', role: 'SCHOOL', status: 'Active' },
  'referee@sportsbuzz.com': { _id: 'mock-referee-id', id: 'mock-referee-id', name: 'John Referee', email: 'referee@sportsbuzz.com', role: 'REFEREE', status: 'Active' },
  'student@springfield.edu': { _id: 'mock-student-id', id: 'mock-student-id', name: 'Bart Simpson', email: 'student@springfield.edu', role: 'STUDENT', status: 'Active' }
};

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Demo accounts bypass
  if (mockUsers[email] && password === 'password123') {
    const user = mockUsers[email];
    const token = signToken(user._id as string);
    return res.status(200).json({
      status: 'success',
      token,
      data: { user },
    });
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = signToken((user._id as mongoose.Types.ObjectId).toString());

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  // User is attached by auth middleware
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reqUser = (req as any).user;
  
  if (reqUser.id && reqUser.id.startsWith('mock-')) {
    return res.status(200).json({
      status: 'success',
      data: { user: reqUser },
    });
  }

  const user = await User.findById(reqUser.id);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
