import { Request, Response } from 'express';
import Status from '../models/status-model';
import Order from '../models/order-model';

export const createStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { idOrder } = req.params;
    const { description } = req.body;

    const allowedDescriptions = ['ready', 'confirmed', 'withdrawn', 'cancelled'];

    if (!allowedDescriptions.includes(description)) {
      return res.status(400).json({
        message: "Invalid status description. It must be 'ready', 'confirmed', 'withdrawn', or 'cancelled'.",
      });
    }

    const statusDate = new Date();

    await Status.create({ idOrder: parseInt(idOrder), statusDate, description });

    return res.status(200).json({ message: 'Status created successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating status.', error });
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
