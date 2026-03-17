import { Request, Response, NextFunction } from 'express';
import { Student } from '../models/Student';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/errorHandler';

export const getAllStudents = catchAsync(async (req: Request, res: Response) => {
  let filter = {};
  if (req.params.schoolId) filter = { schoolId: req.params.schoolId };

  const students = await Student.find(filter);

  res.status(200).json({
    status: 'success',
    results: students.length,
    data: {
      students,
    },
  });
});

export const createStudent = catchAsync(async (req: Request, res: Response) => {
  if (!req.body.schoolId) req.body.schoolId = req.params.schoolId;

  const newStudent = await Student.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      student: newStudent,
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
