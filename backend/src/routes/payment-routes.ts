// Routes for Mercado Pago preference creation
import { Router } from 'express';
import { createPreference } from '../controllers/payment-controller';

const router = Router();

// Creates a new Checkout Pro preference
router.post('/create-preference', createPreference);

export default router;