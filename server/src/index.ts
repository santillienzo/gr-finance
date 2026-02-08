import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { AppDataSource } from './config/database';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { seedDatabase } from './utils/seedData';

config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

AppDataSource.initialize()
  .then(async () => {
    console.log('Database connected successfully');
    
    await seedDatabase();
    
    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
      console.log(`API available at http://localhost:${env.port}/api`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
    process.exit(1);
  });

export default app;
