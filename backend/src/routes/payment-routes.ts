import express, { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate-fields';
import { requireAuth } from '../middlewares/validate-jwt';
import { createPreference, receiveWebhook } from '../controllers/payment-controller';



const router = Router();




router.post(
    "/create-checkout-preference",
    [
        requireAuth,
    
        // Corregido: Debe coincidir con el body del controller (cartItems)
        check('cartItems', 'El carrito no puede estar vacío').isArray({ min: 1 }),
        check('checkoutData.name', 'El nombre del cliente es obligatorio').not().isEmpty(),
        check('checkoutData.email', 'El email del cliente es obligatorio').isEmail(),
        
        validateFields
    ],
    createPreference
);

// Ruta para recibir notificaciones de Mercado Pago (Webhook)
router.post('/webhook', receiveWebhook);

export default router;