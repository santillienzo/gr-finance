import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { env } from '../config/env';
import { AppError } from '../middlewares/errorHandler';

const userRepository = () => AppDataSource.getRepository(User);

export const authController = {
  login: async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new AppError('Username and password are required', 400);
    }

    const user = await userRepository().findOne({ where: { username } });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      env.jwtSecret,
      { expiresIn: (process.env.JWT_EXPIRES_IN || '24h') as `${number}h` }
    );

    res.json({
      token,
      user: {
        username: user.username,
        name: user.name,
      },
    });
  },
};
