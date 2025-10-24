import { Router } from 'express';
import { createStatus, updateStatus } from '../controllers/status-controller';
import { allowAdminOrReceptionist } from '../middlewares/validate-jwt';
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
    // The API expects a canonical `description` field (ready|confirmed|withdrawn|cancelled)
    check('description', 'Description is required').notEmpty(),
    validateFields,
  ],
  updateStatus
);

export default router;