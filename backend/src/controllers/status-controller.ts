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
    const allowedDescriptions = ['ready', 'confirmed', 'withdrawn', 'cancelled', 'pending_payment'];
    const normalize = (s: any) => (s == null ? '' : String(s).trim().toLowerCase());
    const normalizedDesc = normalize(description);
    if (!allowedDescriptions.includes(normalizedDesc)) {
      console.error('createStatus: description not allowed:', normalizedDesc, 'original:', description);
      return res.status(400).json({
        message: "Invalid status description. It must be 'ready', 'confirmed', 'withdrawn', 'pending_payment' or 'cancelled'.",
      });
    }

    
    await db.transaction(async (t: Transaction) => {
      const order = await Order.findByPk(parseInt(idOrder), { transaction: t });
      if (!order) throw new Error('Order not found');

      
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

export const updateStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { idOrder } = req.params;
    const { description } = req.body;
    await db.transaction(async (t: Transaction) => {
      const order = await Order.findByPk(parseInt(idOrder), { transaction: t });
      if (!order) 
        return res.status(404).json({ message: 'Order not found' });      
    });

    const latestStatus = await Status.findOne({
    where: { idOrder: Number(idOrder) },
    order: [['statusDate', 'DESC']],
    });
    if (!latestStatus) {
      return res.status(404).json({ message: 'No status history found for this order.' });
    }
    
    if (latestStatus.description !== 'ready' && latestStatus.description !== 'confirmed') {
      return res.status(400).json({ message: "Recetionist can only update status from 'confirmed' or 'ready'." });
    }
    if (latestStatus.description === description) {
      return res.status(400).json({ message: "Order is already in '${description}' status." });
    }
    if (description !== 'ready' && description !== 'confirmed') {
      return res.status(400).json({ message: "Invalid status update. Can only update to 'ready' or 'confirmed'." });
    }
    
    if (latestStatus.description === 'confirmed' && description === 'ready') {
      await Status.create({ idOrder: parseInt(idOrder), statusDate: new Date(), description: 'ready' });
    }

    if (latestStatus.description === 'ready' && description === 'confirmed') {
      await Status.create({ idOrder: parseInt(idOrder), statusDate: new Date(), description: 'confirmed' });
    }
    return res.status(200).json({ message: 'Status updated successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating status to ready.', error });
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
