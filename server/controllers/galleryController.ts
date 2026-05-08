import { Request, Response, NextFunction } from 'express';
import { Gallery } from '../models/Gallery';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/errorHandler';
import cloudinary from '../utils/cloudinary';

import mongoose from 'mongoose';

export const getAllGalleryItems = catchAsync(async (req: Request, res: Response) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(200).json({
      status: 'success',
      results: 0,
      data: { items: [] }
    });
  }

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
  const { title, description } = req.body;
  let { imageUrl } = req.body;

  if (imageUrl && imageUrl.startsWith('data:image')) {
    try {
      const uploadRes = await cloudinary.uploader.upload(imageUrl, {
        folder: 'sportsbuzz/gallery',
      });
      imageUrl = uploadRes.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      // Fallback to base64 if Cloudinary is not configured
    }
  }

  const newItem = await Gallery.create({ title, imageUrl, description });

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
