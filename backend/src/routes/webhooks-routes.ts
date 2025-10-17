import express, { Router } from 'express';
import { stripeWebhookHandler } from '../services/stripe-processor';

const router = Router();

/**
 * @route   POST /api/webhooks/stripe
 * @desc    Stripe webhook handler
 * @access  Public
 */
router.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhookHandler);

export default router;
