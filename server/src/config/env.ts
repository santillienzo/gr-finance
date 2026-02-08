import { config } from 'dotenv';

config();

export const env = {
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'default_secret_change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
};
