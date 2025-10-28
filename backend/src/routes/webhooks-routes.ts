import express, { Router } from 'express';
import { stripeWebhookHandler } from '../services/stripe-processor';

const router = Router();

router.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhookHandler);

export default router;
