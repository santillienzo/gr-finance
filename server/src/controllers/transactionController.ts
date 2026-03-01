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
  find: async (req: Request, res: Response): Promise<void> => {
    const { entityId } = req.query;

    const whereCondition = entityId ? { entityId: entityId as string } : {};

    const transactions = await transactionRepository().find({
      where: whereCondition,
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

  update: async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { type, amount, description, boxId, targetBoxId, entityId } = req.body;

    if (!type || amount === undefined) {
      throw new AppError('Type and amount are required', 400);
    }

    if (!Object.values(TransactionType).includes(type)) {
      throw new AppError('Invalid transaction type', 400);
    }

    const existingTransaction = await transactionRepository().findOne({ where: { id } });

    if (!existingTransaction) {
      throw new AppError('Transaction not found', 404);
    }

    await AppDataSource.transaction(async (manager) => {
      // Step 1: Reverse the effects of the old transaction
      const oldType = existingTransaction.type as TransactionType;
      const oldAmount = Number(existingTransaction.amount);
      const oldBoxId = existingTransaction.boxId;
      const oldTargetBoxId = existingTransaction.targetBoxId;
      const oldEntityId = existingTransaction.entityId;

      switch (oldType) {
        case TransactionType.SALE:
          if (oldEntityId) {
            await manager.decrement(Entity, { id: oldEntityId }, 'balance', oldAmount);
          }
          break;

        case TransactionType.COLLECTION:
          if (oldEntityId) {
            await manager.increment(Entity, { id: oldEntityId }, 'balance', oldAmount);
          }
          if (oldBoxId) {
            await manager.decrement(Box, { id: oldBoxId }, 'balance', oldAmount);
          }
          break;

        case TransactionType.PURCHASE:
          if (oldEntityId) {
            await manager.decrement(Entity, { id: oldEntityId }, 'balance', oldAmount);
          }
          break;

        case TransactionType.PAYMENT:
          if (oldEntityId) {
            await manager.increment(Entity, { id: oldEntityId }, 'balance', oldAmount);
          }
          if (oldBoxId) {
            await manager.increment(Box, { id: oldBoxId }, 'balance', oldAmount);
          }
          break;

        case TransactionType.TRANSFER:
          if (oldBoxId) {
            await manager.increment(Box, { id: oldBoxId }, 'balance', oldAmount);
          }
          if (oldTargetBoxId) {
            await manager.decrement(Box, { id: oldTargetBoxId }, 'balance', oldAmount);
          }
          break;

        case TransactionType.INCOME:
          if (oldBoxId) {
            await manager.decrement(Box, { id: oldBoxId }, 'balance', oldAmount);
          }
          break;

        case TransactionType.EXPENSE:
          if (oldBoxId) {
            await manager.increment(Box, { id: oldBoxId }, 'balance', oldAmount);
          }
          break;
      }

      // Step 2: Update the transaction record
      existingTransaction.type = type;
      existingTransaction.amount = amount;
      existingTransaction.description = description || '';
      existingTransaction.boxId = boxId || null;
      existingTransaction.targetBoxId = targetBoxId || null;
      existingTransaction.entityId = entityId || null;

      await manager.save(existingTransaction);

      // Step 3: Apply the effects of the new transaction
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

    res.json({
      id: existingTransaction.id,
      date: existingTransaction.date.toISOString(),
      type: existingTransaction.type,
      amount: Number(existingTransaction.amount),
      description: existingTransaction.description,
      boxId: existingTransaction.boxId || undefined,
      targetBoxId: existingTransaction.targetBoxId || undefined,
      entityId: existingTransaction.entityId || undefined,
      userId: existingTransaction.userId || undefined,
    });
  },

  delete: async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    const existingTransaction = await transactionRepository().findOne({ where: { id } });

    if (!existingTransaction) {
      throw new AppError('Transaction not found', 404);
    }

    await AppDataSource.transaction(async (manager) => {
      // Reverse the effects of the transaction before deleting
      const type = existingTransaction.type as TransactionType;
      const amount = Number(existingTransaction.amount);
      const boxId = existingTransaction.boxId;
      const targetBoxId = existingTransaction.targetBoxId;
      const entityId = existingTransaction.entityId;

      switch (type) {
        case TransactionType.SALE:
          if (entityId) {
            await manager.decrement(Entity, { id: entityId }, 'balance', amount);
          }
          break;

        case TransactionType.COLLECTION:
          if (entityId) {
            await manager.increment(Entity, { id: entityId }, 'balance', amount);
          }
          if (boxId) {
            await manager.decrement(Box, { id: boxId }, 'balance', amount);
          }
          break;

        case TransactionType.PURCHASE:
          if (entityId) {
            await manager.decrement(Entity, { id: entityId }, 'balance', amount);
          }
          break;

        case TransactionType.PAYMENT:
          if (entityId) {
            await manager.increment(Entity, { id: entityId }, 'balance', amount);
          }
          if (boxId) {
            await manager.increment(Box, { id: boxId }, 'balance', amount);
          }
          break;

        case TransactionType.TRANSFER:
          if (boxId) {
            await manager.increment(Box, { id: boxId }, 'balance', amount);
          }
          if (targetBoxId) {
            await manager.decrement(Box, { id: targetBoxId }, 'balance', amount);
          }
          break;

        case TransactionType.INCOME:
          if (boxId) {
            await manager.decrement(Box, { id: boxId }, 'balance', amount);
          }
          break;

        case TransactionType.EXPENSE:
          if (boxId) {
            await manager.increment(Box, { id: boxId }, 'balance', amount);
          }
          break;
      }

      // Delete the transaction record
      await manager.remove(existingTransaction);
    });

    res.status(204).send();
  },
};
