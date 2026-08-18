// Advertisement Model
import mongoose, { Schema, Document } from 'mongoose';

export interface IAdvertisement extends Document {
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  position: 'top' | 'sidebar' | 'bottom';
  advertiser?: string;
  isActive: boolean;
  clicks: number;
  impressions: number;
  startDate?: Date;
  endDate?: Date;
}

const AdvertisementSchema = new Schema<IAdvertisement>({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  linkUrl: { type: String },
  position: { type: String, enum: ['top', 'sidebar', 'bottom'], default: 'sidebar' },
  advertiser: { type: String },
  isActive: { type: Boolean, default: true },
  clicks: { type: Number, default: 0 },
  impressions: { type: Number, default: 0 },
  startDate: { type: Date },
  endDate: { type: Date }
}, { 
  timestamps: true,
  versionKey: false
});

AdvertisementSchema.index({ position: 1, isActive: 1 });

export const Advertisement = mongoose.model<IAdvertisement>('Advertisement', AdvertisementSchema);
