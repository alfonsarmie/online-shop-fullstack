// Routes that expose the Mercado Pago webhook endpoint
import { Router } from 'express';
import { handleMercadoPagoWebhook } from '../controllers/mercadopago-webhook-controller';

const router = Router();

// Mercado Pago sends POST notifications to this path
router.post('/mercadopago', handleMercadoPagoWebhook);
// GET is useful while testing from the dashboard (Mercado Pago triggers retries via GET)
router.get('/mercadopago', handleMercadoPagoWebhook);

export default router;