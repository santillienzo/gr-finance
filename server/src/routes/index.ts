import { Router } from 'express';
import authRoutes from './authRoutes';
import boxRoutes from './boxRoutes';
import clientRoutes from './clientRoutes';
import providerRoutes from './providerRoutes';
import transactionRoutes from './transactionRoutes';
import settingsRoutes from './settingsRoutes';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use('/auth', authRoutes);

router.use('/boxes', authMiddleware, boxRoutes);
router.use('/clients', authMiddleware, clientRoutes);
router.use('/providers', authMiddleware, providerRoutes);
router.use('/transactions', authMiddleware, transactionRoutes);
router.use('/', authMiddleware, settingsRoutes);

export default router;
