// Advertisement Controller
import { Request, Response } from 'express';
import { advertisementService } from '../services';

export class AdvertisementController {
  
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const ads = await advertisementService.getAll();
      res.json(ads);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch advertisements' });
    }
  }

  async getActive(req: Request, res: Response): Promise<void> {
    try {
      const position = req.query.position as string;
      const ads = await advertisementService.getActive(position);
      res.json(ads);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch advertisements' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const ad = await advertisementService.create(req.body);
      res.status(201).json(ad);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create advertisement' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const ad = await advertisementService.update(req.params.id, req.body);
      res.json(ad);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update advertisement' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const success = await advertisementService.delete(req.params.id);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete advertisement' });
    }
  }
}

export const advertisementController = new AdvertisementController();
