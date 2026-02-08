import { Router } from 'express';
import { providerController } from '../controllers/providerController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(providerController.getAll));
router.get('/active', asyncHandler(providerController.getActive));
router.post('/', asyncHandler(providerController.create));
router.patch('/:id/deactivate', asyncHandler(providerController.deactivate));

export default router;
