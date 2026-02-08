import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Entity } from '../entities/Entity';
import { EntityType } from '../types';
import { AppError } from '../middlewares/errorHandler';

const entityRepository = () => AppDataSource.getRepository(Entity);

export const providerController = {
  getAll: async (_req: Request, res: Response): Promise<void> => {
    const providers = await entityRepository().find({
      where: { type: EntityType.PROVIDER },
      order: { name: 'ASC' },
    });

    res.json(
      providers.map((provider) => ({
        id: provider.id,
        name: provider.name,
        type: provider.type,
        balance: Number(provider.balance),
        active: provider.active,
      }))
    );
  },

  getActive: async (_req: Request, res: Response): Promise<void> => {
    const providers = await entityRepository().find({
      where: { type: EntityType.PROVIDER, active: true },
      order: { name: 'ASC' },
    });

    res.json(
      providers.map((provider) => ({
        id: provider.id,
        name: provider.name,
        type: provider.type,
        balance: Number(provider.balance),
        active: provider.active,
      }))
    );
  },

  create: async (req: Request, res: Response): Promise<void> => {
    const { name } = req.body;

    if (!name) {
      throw new AppError('Name is required', 400);
    }

    const provider = entityRepository().create({
      name,
      type: EntityType.PROVIDER,
      balance: 0,
    });

    await entityRepository().save(provider);

    res.status(201).json({
      id: provider.id,
      name: provider.name,
      type: provider.type,
      balance: Number(provider.balance),
      active: provider.active,
    });
  },

  deactivate: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const provider = await entityRepository().findOne({
      where: { id, type: EntityType.PROVIDER },
    });

    if (!provider) {
      throw new AppError('Provider not found', 404);
    }

    provider.active = false;
    await entityRepository().save(provider);

    res.status(200).json({
      id: provider.id,
      name: provider.name,
      type: provider.type,
      balance: Number(provider.balance),
      active: provider.active,
    });
  },
};
