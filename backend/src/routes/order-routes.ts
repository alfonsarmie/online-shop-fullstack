import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate-fields';
import { allowAdminOrReceptionist, validateJWT } from '../middlewares/validate-jwt';
import { createOrderFromSession, getUserOrders, getOrders, getMonthlyWorth, getSportsStats, getStatusStats } from '../controllers/order-controller';

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
router.get(
    '/',
    // optional query params: page, limit
    (req, res, next) => next(),
    // controller will handle params
    // function imported from controller
    // getOrders will be exported from controller
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    getOrders
);

/**
 * @route GET /api/orders
 * @desc Obtiene el total facturado mensual
 * @access Private/Admin
 */

router.get(
    '/worth',
    [validateJWT],
    getMonthlyWorth
);

/**
 * @route GET /api/orders
 * @desc Obtiene los pedidos por deporte de los ultimos 3 meses
 * @access Private/Admin
 */

router.get(
    '/sports',
    [validateJWT],
    getSportsStats
)

/**
 * @route GET /api/orders
 * @desc Obtiene los pedidos por estado del ultimo mes
 * @access Private/Admin
 */

router.get(
    '/status',
    [validateJWT],
    getStatusStats
)

export default router;
