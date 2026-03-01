import { Router } from 'express';
import { transactionController } from '../controllers/transactionController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(transactionController.find));
router.post('/', asyncHandler(transactionController.create));
router.patch('/:id', asyncHandler(transactionController.update));
router.delete('/:id', asyncHandler(transactionController.delete));

export default router;
