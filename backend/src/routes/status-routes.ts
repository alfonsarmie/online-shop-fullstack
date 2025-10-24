import { Router } from 'express';
import { createStatus } from '../controllers/status-controller';
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


export default router;