// Controller for creating Mercado Pago payment preferences
import type { Request, Response } from 'express';
import type { PreferenceCreateData } from 'mercadopago/dist/clients/preference/create/types';
import type { BackUrls } from 'mercadopago/dist/clients/preference/commonTypes';
import type { Items } from 'mercadopago/dist/clients/commonTypes';
import { getPreferenceClient } from '../services/mercadopago';
import { v4 as uuidv4 } from 'uuid';

type Nullable<T> = T | null | undefined;

// Payload representation from the frontend cart
interface CheckoutItem {
  id?: string;
  title: string;
  quantity: number;
  unit_price: number;
  currency_id?: string;
  description?: string;
  picture_url?: string;
}

// Accepted shape for the create-preference request body
interface CreatePreferenceBody {
  items: CheckoutItem[];
  orderId?: string;
  payer?: {
    email?: string;
    name?: string;
    surname?: string;
  };
  backUrls?: BackUrls;
}

// Helper to keep URLs compatible with Mercado Pago validation
function ensureTrailingSlashRemoved(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

function generateExternalReference(): string {
  const uuidPart = uuidv4().replace(/-/g, '').slice(0, 16);

  return `ORD-${uuidPart}`;
}

// POST /api/payments/create-preference
export async function createPreference(req: Request, res: Response) {
  try {
    const body = req.body as CreatePreferenceBody;

    if (!body || !Array.isArray(body.items) || body.items.length === 0) {
      return res.status(400).json({ message: 'items must be a non-empty array' });
    }

    // Map the cart payload to the exact fields the SDK expects
    const sanitizedItems: Items[] = body.items.map((item, index) => {
      const quantity = Number(item.quantity);
      const unitPrice = Number(item.unit_price);

      if (!item.title || Number.isNaN(quantity) || Number.isNaN(unitPrice)) {
        throw new Error('Invalid item payload: title, quantity and unit_price are required');
      }

      if (quantity <= 0 || unitPrice < 0) {
        throw new Error('Invalid item payload: quantity must be greater than 0 and unit_price positive');
      }

      return {
        id: item.id ?? `item-${index + 1}`,
        title: item.title,
        quantity,
        unit_price: unitPrice,
        currency_id: item.currency_id ?? 'ARS',
        description: item.description,
        picture_url: item.picture_url,
      };
    });

    // Compute fallback redirect URLs using env config if the frontend omitted them
    let frontBaseUrl = process.env.FRONTEND_BASE_URL ?? 'http://localhost:5173';
    frontBaseUrl = ensureTrailingSlashRemoved(frontBaseUrl);

    const webhookUrl: Nullable<string> = process.env.MERCADOPAGO_WEBHOOK_URL
      ?? (process.env.PUBLIC_BACKEND_URL
        ? `${ensureTrailingSlashRemoved(process.env.PUBLIC_BACKEND_URL)}/webhooks/mercadopago`
        : `http://localhost:${process.env.PORT ?? 3000}/webhooks/mercadopago`);

    const preferencePayload: PreferenceCreateData['body'] = {
      items: sanitizedItems,
      external_reference: generateExternalReference(),
      payer: body.payer?.email ? {
        email: body.payer.email,
        name: body.payer?.name,
        surname: body.payer?.surname,
      } : undefined,
      back_urls: body.backUrls ?? {
        success: `${frontBaseUrl}/checkout/success`,
        failure: `${frontBaseUrl}/checkout/failure`,
        pending: `${frontBaseUrl}/checkout/pending`,
      },
      auto_return: 'approved',
      notification_url: webhookUrl ?? undefined,
    };

    // Delegate the REST call to Mercado Pago SDK
    const preference = await getPreferenceClient().create({ body: preferencePayload });

    return res.status(201).json({
      id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
    });
  } catch (error) {
    console.error('Error creating Mercado Pago preference', error);

    if (error instanceof Error && error.message.includes('MERCADOPAGO_ACCESS_TOKEN')) {
      return res.status(500).json({ message: 'Mercado Pago credentials are not configured on the server' });
    }

    const message = error instanceof Error ? error.message : 'Could not create payment preference';
    const statusCode = message.startsWith('Invalid item payload') ? 400 : 500;
    return res.status(statusCode).json({ message });
  }
}
