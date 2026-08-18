// Admin Routes
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminController, postController, marketPriceController, advertisementController } from '../controllers';

const router = Router();

// Public - Login
router.post('/login', (req, res) => adminController.login(req, res));

// Protected Routes
router.use(authMiddleware);

// Dashboard
router.get('/dashboard', (req, res) => adminController.getDashboard(req, res));

// Posts CRUD
router.get('/posts', (req, res) => postController.getAll(req, res));
router.post('/posts', (req, res) => postController.create(req, res));
router.put('/posts/:id', (req, res) => postController.update(req, res));
router.delete('/posts/:id', (req, res) => postController.delete(req, res));

// Market Prices CRUD
router.get('/market-prices', (req, res) => marketPriceController.getAll(req, res));
router.post('/market-prices', (req, res) => marketPriceController.create(req, res));
router.put('/market-prices/:id', (req, res) => marketPriceController.updatePrice(req, res));
router.delete('/market-prices/:id', (req, res) => marketPriceController.delete(req, res));

// Ads CRUD
router.get('/ads', (req, res) => advertisementController.getAll(req, res));
router.post('/ads', (req, res) => advertisementController.create(req, res));
router.put('/ads/:id', (req, res) => advertisementController.update(req, res));
router.delete('/ads/:id', (req, res) => advertisementController.delete(req, res));

export { router as adminRoutes };
