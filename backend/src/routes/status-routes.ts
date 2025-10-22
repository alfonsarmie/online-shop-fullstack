import { Router } from 'express';
import { createStatus, updateStatus } from '../controllers/status-controller';
import { validateJWT, allowAdminOrReceptionist } from '../middlewares/validate-jwt';
import { validateFields } from '../middlewares/validate-fields';
import { check } from 'express-validator';

const router = Router();

router.post(
  "/:idOrder/create",
  [
    allowAdminOrReceptionist,
    check('description', 'Description is required').notEmpty(),
    validateFields
  ],
  createStatus
);

// Update order status (admin or receptionist) - moved here from order-routes
router.put(
  '/:idOrder',
  [
    allowAdminOrReceptionist,
    check('status', 'Status is required').notEmpty(),
    validateFields,
  ],
  updateStatus
);

export default router;