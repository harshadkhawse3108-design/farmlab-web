// Admin Service
import jwt from 'jsonwebtoken';
import { Admin, IAdmin } from '../models';
import { config } from '../config';

export class AdminService {
  
  async login(username: string, password: string): Promise<{ token: string; admin: any } | null> {
    const admin = await Admin.findOne({ username: username.toLowerCase(), isActive: true });
    if (!admin) return null;
    
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return null;
    
    admin.lastLogin = new Date();
    await admin.save();
    
    const token = jwt.sign(
      { id: admin._id.toString(), username: admin.username, role: admin.role },
      config.jwtSecret,
      { expiresIn: '24h' }
    );
    
    return {
      token,
      admin: { 
        id: admin._id.toString(), 
        username: admin.username, 
        name: admin.name, 
        role: admin.role 
      }
    };
  }

  async create(data: { username: string; password: string; name: string; role: string }): Promise<IAdmin> {
    const admin = new Admin(data);
    return admin.save();
  }

  async getAll(): Promise<any[]> {
    return Admin.find().select('-password').lean();
  }
}

export const adminService = new AdminService();
