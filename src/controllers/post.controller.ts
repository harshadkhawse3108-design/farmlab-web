// Post Controller
import { Request, Response } from 'express';
import { postService } from '../services';

export class PostController {
  
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const category = req.query.category as string;
      const posts = await postService.getAll(category);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const post = await postService.getById(req.params.id);
      if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }
      await postService.incrementViews(req.params.id);
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch post' });
    }
  }

  async getDaily(req: Request, res: Response): Promise<void> {
    try {
      const post = await postService.getDaily();
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch daily post' });
    }
  }

  async getTrending(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const posts = await postService.getTrending(limit);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch trending posts' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const post = await postService.create(req.body);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create post' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const post = await postService.update(req.params.id, req.body);
      if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update post' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const success = await postService.delete(req.params.id);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete post' });
    }
  }

  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await postService.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  }
}

export const postController = new PostController();
