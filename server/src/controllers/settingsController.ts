import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Box } from '../entities/Box';
import { Entity } from '../entities/Entity';
import { Transaction } from '../entities/Transaction';
import { TransactionType } from '../types';
import { AppError } from '../middlewares/errorHandler';

const boxRepository = () => AppDataSource.getRepository(Box);
const entityRepository = () => AppDataSource.getRepository(Entity);
const transactionRepository = () => AppDataSource.getRepository(Transaction);

export const settingsController = {
  setInitialBalance: async (req: Request, res: Response): Promise<void> => {
    const { entityId, type, amount } = req.body;

    if (!entityId || !type || amount === undefined) {
      throw new AppError('entityId, type, and amount are required', 400);
    }

    if (!['BOX', 'CLIENT', 'PROVIDER'].includes(type)) {
      throw new AppError('Invalid type. Must be BOX, CLIENT, or PROVIDER', 400);
    }

    await AppDataSource.transaction(async (manager) => {
      if (type === 'BOX') {
        const box = await boxRepository().findOne({ where: { id: entityId } });
        if (!box) {
          throw new AppError('Box not found', 404);
        }
        box.balance = amount;
        await manager.save(box);
      } else {
        const entity = await entityRepository().findOne({ where: { id: entityId } });
        if (!entity) {
          throw new AppError('Entity not found', 404);
        }
        entity.balance = amount;
        await manager.save(entity);
      }

      const transaction = transactionRepository().create({
        type: TransactionType.INITIAL_BALANCE,
        amount,
        description: `Initial balance set for ${type}`,
        boxId: type === 'BOX' ? entityId : null,
        entityId: type !== 'BOX' ? entityId : null,
      });
      await manager.save(transaction);
    });

    res.json({ message: 'Initial balance set successfully' });
  },
};
