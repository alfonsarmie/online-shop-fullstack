import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate-fields';
import { createOrderFromSession } from '../controllers/order-controller';

const router = Router();

/**
 * @route   POST /api/orders/create-from-session
 * @desc    Verifica el pago en Stripe y crea la orden
 * @access  Public
 */
router.post(
    '/create-from-session',
    [
        check('session_id', 'session_id es requerido').notEmpty(),
        validateFields
    ],
    createOrderFromSession
);

export default router;
