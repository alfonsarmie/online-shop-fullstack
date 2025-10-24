import { Request, Response } from 'express';
import Status from '../models/status-model';
import Order from '../models/order-model';
import { Transaction } from 'sequelize';
import { db } from '../db/connection';

export const createStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { idOrder } = req.params;
    const { description } = req.body;

    // Require the client to send the canonical description value.
    const allowedDescriptions = ['ready', 'confirmed', 'withdrawn', 'cancelled'];
    const normalize = (s: any) => (s == null ? '' : String(s).trim().toLowerCase());
    const normalizedDesc = normalize(description);
    if (!allowedDescriptions.includes(normalizedDesc)) {
      console.error('createStatus: description not allowed:', normalizedDesc, 'original:', description);
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
 * Update order status endpoint.
 * Accepts body: { description: 'ready'|'confirmed'|'withdrawn'|'cancelled', statusMp?: string }
 */
// NOTE: updateStatus removed — use `createStatus` (POST) to add a new status entry.
// The createStatus handler already performs the same work (update Order + create Status row)
// and will be used for all status changes.

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
