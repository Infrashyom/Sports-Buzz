import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { Student } from '../models/Student';
import { School } from '../models/School';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/errorHandler';

export const getAllStudents = catchAsync(async (req: Request, res: Response) => {
  const filter: Record<string, any> = {};
  
  const reqUser = (req as any).user;

  // Protect the query against cross-school snooping
  if (reqUser && reqUser.role === 'SCHOOL') {
    if (reqUser.schoolId) {
      filter.schoolId = reqUser.schoolId;
    } else {
      const school = await School.findOne({ adminUserId: reqUser._id });
      if (school) filter.schoolId = school._id;
    }
  } else if (reqUser && reqUser.role === 'STUDENT') {
    if (reqUser.schoolId) {
      filter.schoolId = reqUser.schoolId;
    } else {
      // Fallback for older users without schoolId properly set
      filter.studentId = reqUser.email;
    }
  } else if (req.params.schoolId) {
    if (!mongoose.Types.ObjectId.isValid(String(req.params.schoolId))) {
      // Try to find if req.params.schoolId is actually adminUserId
      const school = await School.findOne({ adminUserId: req.params.schoolId });
      if (school) filter.schoolId = school._id;
      else return res.status(200).json({ status: 'success', results: 0, data: { students: [] } });
    } else {
      filter.schoolId = req.params.schoolId;
    }
  }

  const students = await Student.find(filter).populate('schoolId');

  res.status(200).json({
    status: 'success',
    results: students.length,
    data: {
      students,
    },
  });
});

export const createStudent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.schoolId) {
    if (mongoose.Types.ObjectId.isValid(String(req.params.schoolId))) {
        req.body.schoolId = req.params.schoolId;
    } else {
        const school = await School.findOne({ adminUserId: req.params.schoolId });
        if (school) req.body.schoolId = school._id;
    }
  }

  const existingStudent = await Student.findOne({ schoolId: req.body.schoolId, studentId: req.body.studentId });
  if (existingStudent) {
    return next(new AppError('Athlete ID already in use for this school', 400));
  }

  const newStudent = await Student.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      student: newStudent,
    },
  });
});

export const updateStudentStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const student = await Student.findByIdAndUpdate(req.params.id, { status: req.body.status }, {
    new: true,
    runValidators: true,
  });

  if (!student) {
    return next(new AppError('No student found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      student,
    },
  });
});

export const updateStudent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!student) {
    return next(new AppError('No student found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      student,
    },
  });
});

export const deleteStudent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const student = await Student.findByIdAndDelete(req.params.id);

  if (!student) {
    return next(new AppError('No student found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
