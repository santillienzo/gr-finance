import { Router } from 'express';
import { boxController } from '../controllers/boxController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(boxController.getAll));

export default router;
