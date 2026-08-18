// Advertisement Service
import { Advertisement, IAdvertisement } from '../models';

export class AdvertisementService {
  
  async getAll(): Promise<any[]> {
    return Advertisement.find().sort({ position: 1, createdAt: -1 }).lean();
  }

  async getActive(position?: string): Promise<any[]> {
    const query: any = { isActive: true };
    if (position) query.position = position;
    return Advertisement.find(query).lean();
  }

  async create(data: Partial<IAdvertisement>): Promise<IAdvertisement> {
    const ad = new Advertisement(data);
    return ad.save();
  }

  async update(id: string, data: Partial<IAdvertisement>): Promise<any | null> {
    return Advertisement.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id: string): Promise<boolean> {
    const result = await Advertisement.findByIdAndDelete(id);
    return !!result;
  }

  async incrementClicks(id: string): Promise<void> {
    await Advertisement.findByIdAndUpdate(id, { $inc: { clicks: 1 } });
  }
}

export const advertisementService = new AdvertisementService();
