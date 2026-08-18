// Market Price Model
import mongoose, { Schema, Document } from 'mongoose';

export interface IMarketPrice extends Document {
  commodity: string;
  price: number;
  unit: string;
  market: string;
  change: number;
  updatedAt: Date;
}

const MarketPriceSchema = new Schema<IMarketPrice>({
  commodity: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  unit: { type: String, default: 'क्विंटल' },
  market: { type: String, required: true },
  change: { type: Number, default: 0 }
}, { 
  timestamps: true,
  versionKey: false
});

MarketPriceSchema.index({ commodity: 1 });

export const MarketPrice = mongoose.model<IMarketPrice>('MarketPrice', MarketPriceSchema);
