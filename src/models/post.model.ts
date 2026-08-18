// Post Model
import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  author: string;
  category: string;
  likes: number;
  likedBy: string[];
  views: number;
  imageUrl?: string;
  isDaily: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  author: { type: String, default: 'FarmLab Admin' },
  category: { 
    type: String, 
    enum: ['daily-tip', 'market-price', 'weather-alert', 'government-scheme', 
           'crop-advice', 'pest-control', 'fertilizer', 'irrigation', 
           'equipment', 'success-story', 'organic-farming', 'animal-husbandry', 'general'],
    default: 'general'
  },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }],
  views: { type: Number, default: 0 },
  imageUrl: { type: String },
  isDaily: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { 
  timestamps: true,
  versionKey: false
});

// Indexes for faster queries
PostSchema.index({ category: 1, createdAt: -1 });
PostSchema.index({ isDaily: 1 });
PostSchema.index({ views: -1 });

export const Post = mongoose.model<IPost>('Post', PostSchema);
