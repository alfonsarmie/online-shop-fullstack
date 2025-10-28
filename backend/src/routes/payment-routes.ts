import express, { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate-fields';
import { requireAuth } from '../middlewares/validate-jwt';
import { createCheckoutSession } from '../controllers/payment-controller';



const router = Router();




router.post(
    "/create-checkout-session",
    [
        requireAuth,
    
        check('items', 'El carrito no puede estar vacío').isArray({ min: 1 }),
        
        
        validateFields
    ],
    createCheckoutSession
);





export default router;