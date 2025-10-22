import { Request, Response } from 'express';
import Status from '../models/status-model';
import Order from '../models/order-model';
import { Transaction } from 'sequelize';
import { db } from '../db/connection';

export const createStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { idOrder } = req.params;
    const { description } = req.body;

    // Reuse update logic: accept canonical descriptions and some common synonyms
    const allowedDescriptions = ['ready', 'confirmed', 'withdrawn', 'cancelled'];
    const normalize = (s: any) => (s == null ? '' : String(s).trim().toLowerCase());
    const mapping: Record<string, string> = {
      listo: 'ready',
      listos: 'ready',
      listo_a: 'ready',
      confirmado: 'confirmed',
      confirmada: 'confirmed',
      entregado: 'withdrawn',
      entregada: 'withdrawn',
      retirado: 'withdrawn',
      retirada: 'withdrawn',
      cancelado: 'cancelled',
      cancelled: 'cancelled',
      // Common provider terms
      pending: 'confirmed',
      approved: 'confirmed',
      in_process: 'ready',
      processing: 'ready',
      delivered: 'withdrawn',
    };

    const normalizedDesc = mapping[normalize(description)] ?? normalize(description);
    if (!allowedDescriptions.includes(normalizedDesc)) {
      console.error('createStatus: normalized description not allowed:', normalizedDesc, 'original:', description);
      return res.status(400).json({
        message: "Invalid status description. It must be 'ready', 'confirmed', 'withdrawn', or 'cancelled'.",
      });
    }

    // Wrap in a transaction: update Order and create Status atomically
    await db.transaction(async (t: Transaction) => {
      const order = await Order.findByPk(parseInt(idOrder), { transaction: t });
      if (!order) throw new Error('Order not found');

      // If description indicates withdrawn, set actualPickupDate
      if (normalizedDesc === 'withdrawn') {
        order.actualPickupDate = new Date();
      } else {
        order.actualPickupDate = null as any;
      }

      await order.save({ transaction: t });

      await Status.create({ idOrder: parseInt(idOrder), statusDate: new Date(), description: normalizedDesc }, { transaction: t });
    });

    return res.status(200).json({ message: 'Status created successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating status.', error });
  }
};

/**
 * Update order status endpoint (moved from order-controller).
 * Accepts body: { status: 'ready'|'confirmed'|'withdrawn'|'cancelled', statusMp?: string }
 */
export const updateStatus = async (req: Request, res: Response): Promise<Response> => {
  const { idOrder } = req.params;
  const { status, statusMp } = req.body;

  // Debug logging to help trace 400/validation issues from the frontend
  console.log('updateStatus called:', { idOrder, body: req.body, userId: (req as any).userId });

  if (!idOrder) return res.status(400).json({ msg: 'order id is required' });

  try {
    const allowed = ['ready', 'confirmed', 'withdrawn', 'cancelled'];
    const normalize = (s: any) => (s == null ? '' : String(s).trim().toLowerCase());
    const mapping: Record<string, string> = {
      listo: 'ready',
      listos: 'ready',
      listo_a: 'ready',
      confirmado: 'confirmed',
      confirmada: 'confirmed',
      confirm: 'confirmed',
      entregado: 'withdrawn',
      entregada: 'withdrawn',
      retirado: 'withdrawn',
      retirada: 'withdrawn',
      cancelado: 'cancelled',
      cancelled: 'cancelled',
      // Common provider terms
      pending: 'confirmed',
      approved: 'confirmed',
      in_process: 'ready',
      processing: 'ready',
      delivered: 'withdrawn',
    };

    const normalized = mapping[normalize(status)] ?? normalize(status);
    if (!allowed.includes(normalized)) {
      console.error('updateStatus: normalized status not allowed:', normalized, 'original:', status);
      return res.status(400).json({ msg: `Invalid status. Allowed: ${allowed.join(', ')}` });
    }

    await db.transaction(async (t: Transaction) => {
      const order = await Order.findByPk(Number(idOrder), { transaction: t });
      if (!order) throw { code: 'ORDER_NOT_FOUND' };

      if (typeof statusMp === 'string') {
        order.statusMp = statusMp;
      }

      if (normalized === 'withdrawn') {
        order.actualPickupDate = new Date();
      } else {
        order.actualPickupDate = null as any;
      }

      await order.save({ transaction: t });

      await Status.create({ idOrder: order.idOrder, statusDate: new Date(), description: normalized }, { transaction: t });
    });

    return res.status(200).json({ msg: 'Order status updated' });
  } catch (error: any) {
    console.error('Error updating order status (status-controller):', error);
    if (error && error.code === 'ORDER_NOT_FOUND') {
      return res.status(404).json({ msg: 'Order not found' });
    }
    return res.status(500).json({ msg: 'Error updating order status', error: error.message || error });
  }
};

export const getOrderStatusHistory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { idOrder } = req.params;

    const statusHistory = await Status.findAll({
      where: { idOrder },
      order: [['statusDate', 'DESC']],
    });

    if (statusHistory.length === 0) {
      return res.status(404).json({ message: 'No status history found for this order.' });
    }

    return res.status(200).json(statusHistory);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching order status history.', error });
  }
};
