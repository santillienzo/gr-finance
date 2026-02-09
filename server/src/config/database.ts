import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../entities/User';
import { Box } from '../entities/Box';
import { Entity } from '../entities/Entity';
import { Transaction } from '../entities/Transaction';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: process.env.NODE_ENV === 'production'
    ? ['dist/entities/*.js']
    : [User, Box, Entity, Transaction],
  migrations: process.env.NODE_ENV === 'production'
    ? ['dist/migrations/*.js']
    : ['src/migrations/*.ts'],
  subscribers: [],
});