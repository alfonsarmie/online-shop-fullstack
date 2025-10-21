import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate-fields';
import { createOrderFromSession, getUserOrders } from '../controllers/order-controller';

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

/**
 * @route   GET /api/orders/user/:userId
 * @desc    Obtiene todas las órdenes de un usuario
 * @access  Public (idealmente debería ser Private con JWT)
 */
router.get(
    '/user/:userId',
    getUserOrders
);

/**
 * @route   GET /api/orders
 * @desc    Obtiene órdenes paginadas (admin)
 * @access  Private/Admin (no auth enforced here — add middleware if required)
 */
router.get('/',
    // optional query params: page, limit
    (req, res, next) => next(),
    // controller will handle params
    // function imported from controller
    // getOrders will be exported from controller
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    require('../controllers/order-controller').getOrders
);

export default router;
