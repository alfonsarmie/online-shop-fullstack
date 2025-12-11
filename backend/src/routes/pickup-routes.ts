import { Router } from 'express';
import { check } from 'express-validator';
import { validatePickupCode } from '../controllers/pickup-controller';
import { allowAdminOrReceptionist } from '../middlewares/validate-jwt';
import { validateFields } from '../middlewares/validate-fields';

const router = Router();

router.post(
  '/validate',
  [allowAdminOrReceptionist, check('code', 'Pickup code is required').notEmpty(), validateFields],
  validatePickupCode
);

export default router;
