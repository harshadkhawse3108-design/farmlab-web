// Post Service
import { Post, IPost } from '../models';

export class PostService {
  
  async getAll(category?: string, limit = 50): Promise<any[]> {
    const query: any = { isActive: true };
    if (category && category !== 'all') {
      query.category = category;
    }
    return Post.find(query).sort({ createdAt: -1 }).limit(limit).lean();
  }

  async getById(id: string): Promise<any | null> {
    return Post.findById(id).lean();
  }

  async getDaily(): Promise<any | null> {
    return Post.findOne({ isDaily: true, isActive: true }).sort({ createdAt: -1 }).lean();
  }

  async getTrending(limit = 10): Promise<any[]> {
    return Post.find({ isActive: true }).sort({ views: -1, likes: -1 }).limit(limit).lean();
  }

  async create(data: Partial<IPost>): Promise<IPost> {
    const post = new Post(data);
    return post.save();
  }

  async update(id: string, data: Partial<IPost>): Promise<any | null> {
    return Post.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id: string): Promise<boolean> {
    const result = await Post.findByIdAndUpdate(id, { isActive: false });
    return !!result;
  }

  async incrementViews(id: string): Promise<void> {
    await Post.findByIdAndUpdate(id, { $inc: { views: 1 } });
  }

  async likePost(postId: string, sessionId: string): Promise<number> {
    const post = await Post.findById(postId);
    if (!post) return 0;
    
    if (!post.likedBy.includes(sessionId)) {
      post.likedBy.push(sessionId);
      post.likes += 1;
      await post.save();
    }
    return post.likes;
  }

  async getStats(): Promise<{ totalPosts: number; totalLikes: number; totalViews: number }> {
    const stats = await Post.aggregate([
      { $match: { isActive: true } },
      { $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          totalLikes: { $sum: '$likes' },
          totalViews: { $sum: '$views' }
        }
      }
    ]);
    return stats[0] || { totalPosts: 0, totalLikes: 0, totalViews: 0 };
  }
}

export const postService = new PostService();
