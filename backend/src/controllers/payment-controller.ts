// Controller for creating Mercado Pago payment preferences
import type { Request, Response } from 'express';
import type { PreferenceCreateData } from 'mercadopago/dist/clients/preference/create/types';
import type { BackUrls } from 'mercadopago/dist/clients/preference/commonTypes';
import type { Items } from 'mercadopago/dist/clients/commonTypes';
import { getPreferenceClient } from '../services/mercadopago';
import { v4 as uuidv4 } from 'uuid';
import Order from '../models/order-model';
import OrderLine from '../models/order-line-model';
import Status from '../models/status-model';
import PaymentMethod from '../models/payment-method-model';
import type { Transaction } from 'sequelize';
import { MercadoPagoStatus } from './order-controller';

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
  orderPayload?: OrderDraftPayload;
}

interface OrderDraftPayload {
  idUser?: number;
  idPaymentMethod?: number;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_notes?: string;
  sports?: unknown;
  items?: OrderDraftItem[];
}

interface OrderDraftItem {
  idProduct?: number | string;
  quantity: number;
  size?: string;
  unitPrice?: number;
  name?: string;
}

// Helper to keep URLs compatible with Mercado Pago validation
function ensureTrailingSlashRemoved(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

function generateExternalReference(): string {
  const uuidPart = uuidv4().replace(/-/g, '').slice(0, 16);

  return `ORD-${uuidPart}`;
}

function sanitizeBackUrls(urls?: BackUrls): BackUrls | undefined {
  if (!urls || !urls.success) {
    return undefined;
  }

  return {
    success: ensureTrailingSlashRemoved(urls.success),
    failure: urls.failure
      ? ensureTrailingSlashRemoved(urls.failure)
      : undefined,
    pending: urls.pending
      ? ensureTrailingSlashRemoved(urls.pending)
      : undefined,
  };
}

async function resolvePaymentMethodId(
  draft: OrderDraftPayload,
  transaction: Transaction,
): Promise<number> {
  if (draft.idPaymentMethod) {
    const method = await PaymentMethod.findByPk(draft.idPaymentMethod, { transaction });
    if (!method) {
      throw new Error(`Payment method not found: ${draft.idPaymentMethod}`);
    }
    return method.idPaymentMethod;
  }

  const mercadoPago = await PaymentMethod.findOne({
    where: { name: 'Mercado Pago' },
    transaction,
  });
  if (mercadoPago) {
    return mercadoPago.idPaymentMethod;
  }

  const fallback = await PaymentMethod.findOne({ transaction });
  if (fallback) {
    return fallback.idPaymentMethod;
  }

  const created = await PaymentMethod.create({
    name: 'Mercado Pago',
    fees: 0,
  }, { transaction });

  return created.idPaymentMethod;
}

async function createPendingOrderDraft(
  draft: OrderDraftPayload,
  preferenceItems: Items[],
): Promise<Order> {
  if (!draft.idUser) {
    throw new Error('orderPayload.idUser is required to create the order');
  }
  if (!draft.customer_email) {
    throw new Error('orderPayload.customer_email is required to create the order');
  }
  if (!draft.items || draft.items.length === 0) {
    throw new Error('orderPayload.items must be a non-empty array');
  }
  if (draft.items.length !== preferenceItems.length) {
    throw new Error('orderPayload.items length must match preference items length');
  }

  const transaction = await Order.sequelize!.transaction();
  try {
    const paymentMethodId = await resolvePaymentMethodId(draft, transaction);
    const currencyId = preferenceItems[0]?.currency_id ?? 'ARS';

    const totalAmount = preferenceItems.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.unit_price) || 0;
      return sum + quantity * price;
    }, 0);

    const order = await Order.create({
      idUser: draft.idUser,
      idPaymentMethod: paymentMethodId,
      customer_name: draft.customer_name || 'Cliente ecommerce',
      customer_email: draft.customer_email,
      customer_phone: draft.customer_phone,
      customer_notes: draft.customer_notes,
      sports: draft.sports,
      total_amount: totalAmount,
      statusMp: MercadoPagoStatus.PENDING,
      orderDate: new Date(),
      currencyId,
    }, { transaction });

    const lines = draft.items.map((item, index) => {
      const mpItem = preferenceItems[index];
      const quantity = Number(item.quantity ?? mpItem.quantity ?? 0);
      const unitPrice = item.unitPrice ?? Number(mpItem.unit_price ?? 0);
      const idProduct = Number(item.idProduct);

      if (!idProduct || Number.isNaN(idProduct)) {
        throw new Error(`Invalid order item idProduct at position ${index}`);
      }

      return {
        idOrder: order.idOrder,
        idProduct,
        quantity,
        subtotal: unitPrice * quantity,
        size: item.size,
        product_name: item.name ?? mpItem.title ?? `Producto ${index + 1}`,
      };
    });

    await OrderLine.bulkCreate(lines, { transaction });
    await Status.create({
      idOrder: order.idOrder,
      statusDate: new Date(),
      description: 'Order created - Pending payment',
    }, { transaction });

    await transaction.commit();
    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
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
    let frontBaseUrl = process.env.FRONTEND_BASE_URL?.trim();
    if (!frontBaseUrl) {
      frontBaseUrl = 'http://localhost:5173';
    }
    frontBaseUrl = ensureTrailingSlashRemoved(frontBaseUrl);

    const webhookUrl: Nullable<string> = process.env.MERCADOPAGO_WEBHOOK_URL
      ?? (process.env.PUBLIC_BACKEND_URL?.trim()
        ? `${ensureTrailingSlashRemoved(process.env.PUBLIC_BACKEND_URL.trim())}/webhooks/mercadopago`
        : `http://localhost:${process.env.PORT ?? 3000}/webhooks/mercadopago`);

    let createdOrder: Order | null = null;
    if (body.orderPayload) {
      const orderPayload = { ...body.orderPayload };
      if (!orderPayload.customer_email && body.payer?.email) {
        orderPayload.customer_email = body.payer.email;
      }
      if (!orderPayload.customer_name && (body.payer?.name || body.payer?.surname)) {
        orderPayload.customer_name = `${body.payer?.name ?? ''} ${body.payer?.surname ?? ''}`.trim() || undefined;
      }
      createdOrder = await createPendingOrderDraft(orderPayload, sanitizedItems);
    }

    const externalReference = createdOrder
      ? `ORDER-${createdOrder.idOrder}`
      : generateExternalReference();

    const preferencePayload: PreferenceCreateData['body'] = {
      items: sanitizedItems,
      external_reference: externalReference,
      payer: body.payer?.email ? {
        email: body.payer.email,
        name: body.payer?.name,
        surname: body.payer?.surname,
      } : undefined,
      back_urls: undefined,
      notification_url: webhookUrl ?? undefined,
    };
    const computedBackUrls =
      sanitizeBackUrls(body.backUrls) ?? {
        success: `${frontBaseUrl}/checkout/success`,
        failure: `${frontBaseUrl}/checkout/failure`,
        pending: `${frontBaseUrl}/checkout/pending`,
      };

    preferencePayload.back_urls = computedBackUrls;
    if (computedBackUrls.success?.startsWith('https://')) {
      preferencePayload.auto_return = 'approved';
    } else {
      delete preferencePayload.auto_return;
    }

    if (process.env.NODE_ENV !== 'production') {
      console.debug('Mercado Pago preference payload back_urls:', preferencePayload.back_urls);
    }

    // Delegate the REST call to Mercado Pago SDK
    const preference = await getPreferenceClient().create({ body: preferencePayload });

    return res.status(201).json({
      id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
      orderId: createdOrder?.idOrder ?? null,
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
