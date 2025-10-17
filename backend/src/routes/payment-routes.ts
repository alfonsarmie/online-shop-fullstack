import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate-fields';
import { validateJWT } from '../middlewares/validate-jwt';
import { createCheckoutSession } from '../controllers/payment-controller';


const router = Router();


/**
 * @route   POST /api/payment/create-checkout-session
 * @desc    Create a checkout session with Stripe
 * @access  Private (Requires a valid JWT)
 */

router.post(
    "/create-checkout-session",
    [
        validateJWT,
    
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



export default router;