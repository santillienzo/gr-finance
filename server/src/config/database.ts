import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../entities/User';
import { Box } from '../entities/Box';
import { Entity } from '../entities/Entity';
import { Transaction } from '../entities/Transaction';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: String(process.env.DB_HOST || 'localhost'),
  port: parseInt(process.env.DB_PORT || '5432'),
  username: String(process.env.DB_USERNAME || 'postgres'),
  password: String(process.env.DB_PASSWORD || ''),
  database: String(process.env.DB_NAME || 'gr_financial'),
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Box, Entity, Transaction],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});
