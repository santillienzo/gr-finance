import { Router } from 'express';
import { transactionController } from '../controllers/transactionController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(transactionController.getAll));
router.post('/', asyncHandler(transactionController.create));

export default router;
