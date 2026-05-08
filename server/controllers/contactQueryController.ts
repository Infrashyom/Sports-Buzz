import { Request, Response } from 'express';
import { ContactQuery } from '../models/ContactQuery';
import { catchAsync } from '../utils/catchAsync';

const MOCK_QUERIES = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    message: 'I would like to register my school for the upcoming basketball tournament.',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 86400000 * 2)
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    message: 'How can I become a referee for Sports Buzz?',
    status: 'RESOLVED',
    createdAt: new Date(Date.now() - 86400000 * 5)
  }
];

export const createQuery = catchAsync(async (req: Request, res: Response) => {
  const newQuery = await ContactQuery.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      query: newQuery,
    },
  });
});

import mongoose from 'mongoose';

export const getAllQueries = catchAsync(async (req: Request, res: Response) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(200).json({
      status: 'success',
      results: 0,
      data: { queries: [] } // Frontend will use MOCK_QUERIES
    });
  }

  let queries = await ContactQuery.find().sort({ createdAt: -1 });
  
  if (queries.length === 0) {
    await ContactQuery.insertMany(MOCK_QUERIES);
    queries = await ContactQuery.find().sort({ createdAt: -1 });
  }

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
