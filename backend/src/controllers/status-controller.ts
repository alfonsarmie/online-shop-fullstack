import { Request, Response } from 'express';
import Status from '../models/status-model';
import Order from '../models/order-model';

export const createStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { idOrder, statusDate, description } = req.body;
    const status = await Status.create({ idOrder, statusDate, description });
    return res.status(200).json({ message: 'Status creado correctamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear el status', error });
  }
};