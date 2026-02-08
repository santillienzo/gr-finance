import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Entity } from '../entities/Entity';
import { EntityType } from '../types';
import { AppError } from '../middlewares/errorHandler';

const entityRepository = () => AppDataSource.getRepository(Entity);

export const clientController = {
  getAll: async (_req: Request, res: Response): Promise<void> => {
    const clients = await entityRepository().find({
      where: { type: EntityType.CLIENT },
      order: { name: 'ASC' },
    });

    res.json(
      clients.map((client) => ({
        id: client.id,
        name: client.name,
        type: client.type,
        balance: Number(client.balance),
        active: client.active,
      }))
    );
  },

  getActive: async (_req: Request, res: Response): Promise<void> => {
    const clients = await entityRepository().find({
      where: { type: EntityType.CLIENT, active: true },
      order: { name: 'ASC' },
    });

    res.json(
      clients.map((client) => ({
        id: client.id,
        name: client.name,
        type: client.type,
        balance: Number(client.balance),
        active: client.active,
      }))
    );
  },

  create: async (req: Request, res: Response): Promise<void> => {
    const { name } = req.body;

    if (!name) {
      throw new AppError('Name is required', 400);
    }

    const client = entityRepository().create({
      name,
      type: EntityType.CLIENT,
      balance: 0,
    });

    await entityRepository().save(client);

    res.status(201).json({
      id: client.id,
      name: client.name,
      type: client.type,
      balance: Number(client.balance),
      active: client.active,
    });
  },

  deactivate: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const client = await entityRepository().findOne({
      where: { id, type: EntityType.CLIENT },
    });

    if (!client) {
      throw new AppError('Client not found', 404);
    }

    client.active = false;
    await entityRepository().save(client);

    res.status(200).json({
      id: client.id,
      name: client.name,
      type: client.type,
      balance: Number(client.balance),
      active: client.active,
    });
  },
};
