// Public Routes
import { Router } from 'express';
import { postController, marketPriceController, advertisementController } from '../controllers';
import { postService, marketPriceService, advertisementService } from '../services';

const router = Router();

// Combined init API - all data in one call
router.get('/init', async (req, res) => {
  try {
    const [daily, posts, trending, marketPrices, ads, statsData] = await Promise.all([
      postService.getDaily(),
      postService.getAll(),
      postService.getTrending(5),
      marketPriceService.getAll(),
      advertisementService.getActive(),
      postService.getStats()
    ]);
    
    res.json({
      daily,
      posts,
      trending,
      marketPrices,
      ads,
      stats: { ...statsData, currentViewers: 0 }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load data' });
  }
});

// Posts
router.get('/posts', (req, res) => postController.getAll(req, res));
router.get('/posts/daily', (req, res) => postController.getDaily(req, res));
router.get('/posts/trending', (req, res) => postController.getTrending(req, res));
router.get('/posts/:id', (req, res) => postController.getById(req, res));

// Market Prices
router.get('/market-prices', (req, res) => marketPriceController.getAll(req, res));

// Ads
router.get('/ads', (req, res) => advertisementController.getActive(req, res));

// Stats
router.get('/stats', (req, res) => postController.getStats(req, res));

export { router as publicRoutes };
