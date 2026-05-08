import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { School } from '../models/School';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/errorHandler';
import cloudinary from '../utils/cloudinary';

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: (process.env.JWT_EXPIRES_IN || '90d') as jwt.SignOptions['expiresIn'],
  });
};

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, role, mobile, schoolName, schoolAddress, schoolEmail, schoolPhone, schoolId, isSubscribed, paymentStatus, studentCount, participatedStudents } = req.body;

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
    schoolId,
  });

  if (role === 'SCHOOL') {
    if (!schoolName || !schoolAddress || !schoolEmail) {
      return next(new AppError('School details are required for SCHOOL role', 400));
    }
    const newSchool = await School.create({
      name: schoolName,
      address: schoolAddress,
      contactEmail: schoolEmail,
      phone: schoolPhone,
      adminUserId: newUser._id,
      isSubscribed: isSubscribed !== undefined ? isSubscribed : false,
      paymentStatus: paymentStatus || 'Pending',
      studentCount: studentCount || 0,
      participatedStudents: participatedStudents || 0
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

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const userDoc = await User.findOne({ email }).select('+password');

  if (!userDoc || !(await bcrypt.compare(password, userDoc.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const user = userDoc.toObject() as any;
  if (user.role === 'SCHOOL' && !user.schoolId) {
      const school = await School.findOne({ adminUserId: user._id });
      if (school) {
          user.schoolId = school._id;
      }
  }

  delete user.password;

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
   
  const reqUser = (req as any).user;

  const user = await User.findById(reqUser.id).lean(); // Use lean to easily modify the response object
  if (user && user.role === 'SCHOOL' && !user.schoolId) {
      const school = await School.findOne({ adminUserId: user._id });
      if (school) {
          user.schoolId = school._id;
      }
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const updateMe = catchAsync(async (req: Request, res: Response) => {
   
  const reqUser = (req as any).user;
  
  let avatarUrl = req.body.avatar;

  if (avatarUrl && avatarUrl.startsWith('data:image')) {
    try {
      const uploadRes = await cloudinary.uploader.upload(avatarUrl, {
        folder: 'sportsbuzz/avatars',
      });
      avatarUrl = uploadRes.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      // If Cloudinary fails, we can either throw an error or just keep the base64.
      // For now, we'll keep the base64 as a fallback if Cloudinary is not configured.
    }
  }

  const updateData: any = {};
  if (avatarUrl) updateData.avatar = avatarUrl;
  if (req.body.name !== undefined) updateData.name = req.body.name;
  if (req.body.availability !== undefined) updateData.availability = req.body.availability;
  if (req.body.mobile !== undefined) updateData.mobile = req.body.mobile;

  const updatedUser = await User.findByIdAndUpdate(
    reqUser.id,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser },
  });
});

export const addCertification = catchAsync(async (req: Request, res: Response) => {
  const reqUser = (req as any).user;
  const { name, authority, validUntil } = req.body;
  let fileUrl = req.body.fileUrl; // This will be the base64 of the image/pdf

  if (fileUrl && fileUrl.startsWith('data:')) {
    try {
      const uploadRes = await cloudinary.uploader.upload(fileUrl, {
        folder: 'sportsbuzz/certifications',
        resource_type: 'auto'
      });
      fileUrl = uploadRes.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
    }
  }

  const newCertification = {
    name,
    authority,
    validUntil: validUntil ? new Date(validUntil) : undefined,
    licenseId: fileUrl, // using licenseId to store the url for simplicity if not adding another field
    status: 'Pending'
  };

  const updatedUser = await User.findByIdAndUpdate(
    reqUser.id,
    { $push: { certifications: newCertification } },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

export const updatePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const reqUser = (req as any).user;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new AppError('Please provide current and new password', 400));
  }

  const user = await User.findById(reqUser.id).select('+password');
  if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError('Incorrect current password', 401));
  }

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully'
  });
});
