import { Request, Response } from 'express';
import Order from '../models/order-model';
import { validatePickupAndMarkAsDelivered } from '../services/pickup-service';

const normalizeCode = (code: any) => {
  if (code == null) return '';
  return String(code).trim();
};

export const validatePickupCode = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const pickupCode = normalizeCode((req.body as any)?.code);
  if (!pickupCode) {
    return res.status(400).json({ message: 'El codigo de retiro es obligatorio.' });
  }

  try {
    const updatedOrder = await validatePickupAndMarkAsDelivered(pickupCode);
    const plain = (updatedOrder as Order).get({ plain: true }) as any;

    return res.status(200).json({
      message: 'Pedido validado y marcado como entregado.',
      order: plain,
    });
  } catch (err: any) {
    console.error('validatePickupCode error:', err);
    if (err?.status) {
      return res.status(err.status).json({ message: err.message || 'Error al validar el codigo de retiro.' });
    }
    return res.status(500).json({ message: 'Error al validar el codigo de retiro.' });
  }
};
