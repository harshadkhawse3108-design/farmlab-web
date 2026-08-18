// Market Price Service
import { MarketPrice, IMarketPrice } from '../models';

export class MarketPriceService {
  
  async getAll(): Promise<any[]> {
    return MarketPrice.find().sort({ commodity: 1 }).lean();
  }

  async create(data: Partial<IMarketPrice>): Promise<IMarketPrice> {
    const price = new MarketPrice(data);
    return price.save();
  }

  async updatePrice(id: string, newPrice: number): Promise<any | null> {
    const current = await MarketPrice.findById(id);
    if (!current) return null;
    
    const change = newPrice - current.price;
    return MarketPrice.findByIdAndUpdate(id, { 
      price: newPrice, 
      change 
    }, { new: true }).lean();
  }

  async delete(id: string): Promise<boolean> {
    const result = await MarketPrice.findByIdAndDelete(id);
    return !!result;
  }
}

export const marketPriceService = new MarketPriceService();
