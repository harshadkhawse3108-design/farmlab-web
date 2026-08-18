// Admin Controller
import { Request, Response } from 'express';
import { adminService, postService } from '../services';

// Category definitions for frontend
const categories = [
  { name: 'daily-tip', label: 'डेली टिप', icon: '💡' },
  { name: 'market-price', label: 'मंडी भाव', icon: '📊' },
  { name: 'weather-alert', label: 'मौसम चेतावनी', icon: '🌤️' },
  { name: 'government-scheme', label: 'सरकारी योजना', icon: '🏛️' },
  { name: 'crop-advice', label: 'फसल सलाह', icon: '🌾' },
  { name: 'pest-control', label: 'कीट नियंत्रण', icon: '🐛' },
  { name: 'fertilizer', label: 'खाद', icon: '🧪' },
  { name: 'irrigation', label: 'सिंचाई', icon: '💧' },
  { name: 'equipment', label: 'उपकरण', icon: '🚜' },
  { name: 'success-story', label: 'सफलता की कहानी', icon: '🏆' },
  { name: 'organic-farming', label: 'जैविक खेती', icon: '🌿' },
  { name: 'animal-husbandry', label: 'पशुपालन', icon: '🐄' },
  { name: 'general', label: 'सामान्य', icon: '📝' }
];

export class AdminController {
  
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        res.status(400).json({ error: 'Username and password required' });
        return;
      }
      
      const result = await adminService.login(username, password);
      
      if (!result) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  }

  async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const stats = await postService.getStats();
      const recentPosts = await postService.getAll(undefined, 5);
      
      res.json({ 
        stats, 
        recentPosts,
        categories
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to load dashboard' });
    }
  }
}

export const adminController = new AdminController();
