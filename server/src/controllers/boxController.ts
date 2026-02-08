import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Box } from '../entities/Box';

const boxRepository = () => AppDataSource.getRepository(Box);

export const boxController = {
  getAll: async (_req: Request, res: Response): Promise<void> => {
    const boxes = await boxRepository().find({
      order: { name: 'ASC' },
    });

    res.json(
      boxes.map((box) => ({
        id: box.id,
        name: box.name,
        type: box.type,
        balance: Number(box.balance),
      }))
    );
  },
};
