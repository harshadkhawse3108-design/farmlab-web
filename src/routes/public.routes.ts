// Public Routes
import { Router } from 'express';
import { postController, marketPriceController, advertisementController } from '../controllers';
import { postService, marketPriceService, advertisementService } from '../services';

const router = Router();

// Combined init API - all data in one call
router.get('/init', async (req, res) => {
  try {
    console.log('Init API called');
    
    const posts = await postService.getAll();
    console.log('Posts fetched:', posts.length);
    
    const daily = await postService.getDaily();
    console.log('Daily fetched');
    
    const trending = await postService.getTrending(5);
    console.log('Trending fetched');
    
    const marketPrices = await marketPriceService.getAll();
    console.log('Market prices fetched:', marketPrices.length);
    
    const ads = await advertisementService.getActive();
    console.log('Ads fetched:', ads.length);
    
    const statsData = await postService.getStats();
    console.log('Stats fetched');
    
    // Transform _id to id for frontend compatibility
    const transformId = (doc: any) => doc ? { ...doc, id: doc._id?.toString() || doc.id } : null;
    const transformArray = (arr: any[]) => arr.map(transformId);
    
    res.json({
      daily: transformId(daily),
      posts: transformArray(posts),
      trending: transformArray(trending),
      marketPrices: transformArray(marketPrices),
      ads: transformArray(ads),
      stats: { ...statsData, currentViewers: 0 }
    });
  } catch (error: any) {
    console.error('Init API Error:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to load data', message: error.message });
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
