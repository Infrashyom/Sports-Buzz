import mongoose, { Document, Schema } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  imageUrl: string;
  description?: string;
  createdAt: Date;
}

const gallerySchema = new Schema<IGallery>({
  title: {
    type: String,
    required: [true, 'A gallery item must have a title'],
    trim: true,
  },
  imageUrl: {
    type: String,
    required: [true, 'A gallery item must have an image URL'],
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Gallery = mongoose.model<IGallery>('Gallery', gallerySchema);
