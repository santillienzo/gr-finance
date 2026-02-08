import { Router } from 'express';
import { clientController } from '../controllers/clientController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(clientController.getAll));
router.get('/active', asyncHandler(clientController.getActive));
router.post('/', asyncHandler(clientController.create));
router.patch('/:id/deactivate', asyncHandler(clientController.deactivate));

export default router;
