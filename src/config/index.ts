// App Configuration
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/farmlab',
  jwtSecret: process.env.JWT_SECRET || 'farmlab_secret_key_2024',
  jwtExpiry: process.env.JWT_EXPIRY || '24h',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
};
