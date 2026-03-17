import mongoose, { Document, Schema } from 'mongoose';

export interface IContactQuery extends Document {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  status: 'PENDING' | 'RESOLVED';
  createdAt: Date;
}

const contactQuerySchema = new Schema<IContactQuery>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['PENDING', 'RESOLVED'], default: 'PENDING' },
  },
  { timestamps: true }
);

export const ContactQuery = mongoose.model<IContactQuery>('ContactQuery', contactQuerySchema);
