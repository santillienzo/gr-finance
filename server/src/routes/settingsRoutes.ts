import { Router } from 'express';
import { settingsController } from '../controllers/settingsController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/initial-balance', asyncHandler(settingsController.setInitialBalance));

export default router;
