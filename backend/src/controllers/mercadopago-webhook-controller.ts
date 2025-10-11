// Controller that handles Mercado Pago webhook callbacks
import type { Request, Response } from 'express';
import { getPaymentClient } from '../services/mercadopago';

type MercadopagoWebhookPayload = {
  id?: string;
  action?: string;
  type?: string;
  data?: {
    id?: string;
  };
  live_mode?: boolean;
};

// Mercado Pago may send the payment id in body.data.id or as a query param
function extractPaymentId(req: Request<MercadopagoWebhookPayload>): string | undefined {
  const bodyId = req.body?.data?.id ?? req.body?.id;
  const queryId = typeof req.query.id === 'string' ? req.query.id : undefined;
  return bodyId ?? queryId;
}

// Handles both POST (webhook) and GET (manual retry) callbacks
export async function handleMercadoPagoWebhook(req: Request, res: Response) {
  const payload = req.body as MercadopagoWebhookPayload;
  const topicFromQuery = typeof req.query.topic === 'string' ? req.query.topic : undefined;
  const paymentId = extractPaymentId(req);

  try {
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      console.warn('Mercado Pago webhook received but MERCADOPAGO_ACCESS_TOKEN is not configured.');
      return res.status(200).json({ received: true, processed: false });
    }

    if ((payload?.type === 'payment' || topicFromQuery === 'payment') && paymentId) {
      try {
        // Fetch the payment details to drive internal order status updates later
        const payment = await getPaymentClient().get({ id: paymentId });

        console.log('Mercado Pago payment notification', {
          id: paymentId,
          status: payment?.status,
          status_detail: payment?.status_detail,
          external_reference: payment?.external_reference,
        });

        // TODO: Update local order/payment status in the database using payment.external_reference
      } catch (err) {
        console.error('Failed to fetch payment details from Mercado Pago', err);
      }
    } else {
      console.log('Mercado Pago webhook received', { payload, query: req.query });
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Mercado Pago webhook processing error', error);
    return res.status(200).json({ received: false });
  }
}