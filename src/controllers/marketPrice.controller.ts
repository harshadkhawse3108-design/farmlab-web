// Market Price Controller
import { Request, Response } from 'express';
import { marketPriceService } from '../services';

export class MarketPriceController {
  
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const prices = await marketPriceService.getAll();
      res.json(prices);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch market prices' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const price = await marketPriceService.create(req.body);
      res.status(201).json(price);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create market price' });
    }
  }

  async updatePrice(req: Request, res: Response): Promise<void> {
    try {
      const { price } = req.body;
      const result = await marketPriceService.updatePrice(req.params.id, price);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update price' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const success = await marketPriceService.delete(req.params.id);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete price' });
    }
  }
}

export const marketPriceController = new MarketPriceController();
