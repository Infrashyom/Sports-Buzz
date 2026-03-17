import { Request, Response } from 'express';
import { ContactQuery } from '../models/ContactQuery';
import { catchAsync } from '../utils/catchAsync';

export const createQuery = catchAsync(async (req: Request, res: Response) => {
  const newQuery = await ContactQuery.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      query: newQuery,
    },
  });
});

export const getAllQueries = catchAsync(async (req: Request, res: Response) => {
  const queries = await ContactQuery.find().sort({ createdAt: -1 });
  res.status(200).json({
    status: 'success',
    results: queries.length,
    data: {
      queries,
    },
  });
});

export const updateQueryStatus = catchAsync(async (req: Request, res: Response) => {
  const query = await ContactQuery.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );

  if (!query) {
    res.status(404).json({ status: 'fail', message: 'No query found with that ID' });
    return;
  }

  res.status(200).json({
    status: 'success',
    data: {
      query,
    },
  });
});
