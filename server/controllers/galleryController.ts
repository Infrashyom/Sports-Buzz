import { Request, Response, NextFunction } from 'express';
import { Gallery } from '../models/Gallery';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/errorHandler';

export const getAllGalleryItems = catchAsync(async (req: Request, res: Response) => {
  const items = await Gallery.find().sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: items.length,
    data: {
      items,
    },
  });
});

export const createGalleryItem = catchAsync(async (req: Request, res: Response) => {
  const newItem = await Gallery.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      item: newItem,
    },
  });
});

export const deleteGalleryItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const item = await Gallery.findByIdAndDelete(req.params.id);

  if (!item) {
    return next(new AppError('No gallery item found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
