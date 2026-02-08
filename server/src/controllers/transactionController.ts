import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Transaction } from '../entities/Transaction';
import { Box } from '../entities/Box';
import { Entity } from '../entities/Entity';
import { TransactionType, EntityType } from '../types';
import { AppError } from '../middlewares/errorHandler';
import { AuthRequest } from '../middlewares/authMiddleware';

const transactionRepository = () => AppDataSource.getRepository(Transaction);
const boxRepository = () => AppDataSource.getRepository(Box);
const entityRepository = () => AppDataSource.getRepository(Entity);

export const transactionController = {
  getAll: async (_req: Request, res: Response): Promise<void> => {
    const transactions = await transactionRepository().find({
      order: { date: 'DESC' },
    });

    res.json(
      transactions.map((tx) => ({
        id: tx.id,
        date: tx.date.toISOString(),
        type: tx.type,
        amount: Number(tx.amount),
        description: tx.description,
        boxId: tx.boxId || undefined,
        targetBoxId: tx.targetBoxId || undefined,
        entityId: tx.entityId || undefined,
        userId: tx.userId || undefined,
      }))
    );
  },

  create: async (req: AuthRequest, res: Response): Promise<void> => {
    const { type, amount, description, boxId, targetBoxId, entityId } = req.body;

    if (!type || amount === undefined) {
      throw new AppError('Type and amount are required', 400);
    }

    if (!Object.values(TransactionType).includes(type)) {
      throw new AppError('Invalid transaction type', 400);
    }

    const transaction = transactionRepository().create({
      type,
      amount,
      description: description || '',
      boxId: boxId || null,
      targetBoxId: targetBoxId || null,
      entityId: entityId || null,
      userId: req.user?.userId || undefined,
    });

    await AppDataSource.transaction(async (manager) => {
      await manager.save(transaction);

      switch (type as TransactionType) {
        case TransactionType.SALE:
          if (entityId) {
            await manager.increment(Entity, { id: entityId }, 'balance', amount);
          }
          break;

        case TransactionType.COLLECTION:
          if (entityId) {
            await manager.decrement(Entity, { id: entityId }, 'balance', amount);
          }
          if (boxId) {
            await manager.increment(Box, { id: boxId }, 'balance', amount);
          }
          break;

        case TransactionType.PURCHASE:
          if (entityId) {
            await manager.increment(Entity, { id: entityId }, 'balance', amount);
          }
          break;

        case TransactionType.PAYMENT:
          if (entityId) {
            await manager.decrement(Entity, { id: entityId }, 'balance', amount);
          }
          if (boxId) {
            await manager.decrement(Box, { id: boxId }, 'balance', amount);
          }
          break;

        case TransactionType.TRANSFER:
          if (boxId) {
            await manager.decrement(Box, { id: boxId }, 'balance', amount);
          }
          if (targetBoxId) {
            await manager.increment(Box, { id: targetBoxId }, 'balance', amount);
          }
          break;

        case TransactionType.INCOME:
          if (boxId) {
            await manager.increment(Box, { id: boxId }, 'balance', amount);
          }
          break;

        case TransactionType.EXPENSE:
          if (boxId) {
            await manager.decrement(Box, { id: boxId }, 'balance', amount);
          }
          break;
      }
    });

    res.status(201).json({
      id: transaction.id,
      date: transaction.date.toISOString(),
      type: transaction.type,
      amount: Number(transaction.amount),
      description: transaction.description,
      boxId: transaction.boxId || undefined,
      targetBoxId: transaction.targetBoxId || undefined,
      entityId: transaction.entityId || undefined,
      userId: transaction.userId || undefined,
    });
  },
};
