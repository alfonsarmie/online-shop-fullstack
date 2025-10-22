import { Router } from 'express';
import { createStatus } from '../controllers/status-controller';
import { validateJWT, allowAdminOrReceptionist } from '../middlewares/validate-jwt';
import { validateFields } from '@/middlewares/validate-fields';
import { check } from 'express-validator';

const router = Router();

router.post(
  "/create",
  [
    validateJWT,
    allowAdminOrReceptionist,
    check('idOrder', 'Order ID is required').isInt({ min: 1 }),
    check('description', 'Description is required').notEmpty(),
    validateFields
  ],
  createStatus
);

export default router;