import express, { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate-fields';
import { requireAuth } from '../middlewares/validate-jwt';
import { createCheckoutSession } from '../controllers/payment-controller';
//import { stripeWebhookHandler } from '../services/stripe-processor';


const router = Router();


/**
 * @route   POST /api/payment/create-checkout-session
 * @desc    Create a checkout session with Stripe
 * @access  Private (Requires a valid JWT)
 */

router.post(
    "/create-checkout-session",
    [
        requireAuth,
    
        check('items', 'El carrito no puede estar vacío').isArray({ min: 1 }),
        //check('items.*.id', 'Cada item debe tener un ID válido').isString().notEmpty(),
        //check('items.*.quantity', 'Cada item debe tener una cantidad mayor a 0').isInt({ min: 1 }),

        //check('orderDetails', 'Los detalles de la orden son requeridos').isObject(),
        //check('orderDetails.customer_name', 'El nombre del cliente es requerido').notEmpty(),
        //check('orderDetails.customer_email', 'El email del cliente debe ser válido').isEmail(),

        
        validateFields
    ],
    createCheckoutSession
);


/**
 * @route   POST /api/payment/webhook
 * @desc    Recibe eventos y notificaciones de Stripe
 * @access  Public
 */

/*router.post(
    "/webhook",

    express.raw({ type: 'application/json' }),

    stripeWebhookHandler
);*/



export default router;