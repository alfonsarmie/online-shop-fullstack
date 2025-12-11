import { Transaction } from 'sequelize';
import { db } from '../db/connection';
import Order from '../models/order-model';
import OrderLine from '../models/order-line-model';
import Product from '../models/product-model';
import Size from '../models/size-model';
import Status from '../models/status-model';
import PaymentMethod from '../models/payment-method-model';
import User from '../models/user-model';
import Image from '../models/image-model';

export const validatePickupAndMarkAsDelivered = async (pickupCode: string) => {
  return db.transaction(async (t: Transaction) => {
    const order = await Order.findOne({
      where: { pickup_code: pickupCode },
      include: [
        {
          model: OrderLine,
          as: 'orderLines',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['idProduct', 'name'],
              include: [{ model: Image, as: 'images', attributes: ['url'] }],
            },
            { model: Size, as: 'size', attributes: ['idSize', 'sizeDesc'] },
          ],
        },
        {
          model: Status,
          as: 'statusHistory',
          separate: true,
          order: [['statusDate', 'DESC']],
          limit: 1,
        },
        { model: PaymentMethod, as: 'paymentMethod', attributes: ['name'] },
        { model: User, as: 'user', attributes: ['idUser', 'name', 'email'] },
      ],
      transaction: t,
      lock: Transaction.LOCK.UPDATE,
    });

    if (!order) {
      throw { status: 404, message: 'QR no valido: no encontramos ningun pedido con este codigo.' };
    }

    const latestStatus = (order as any).statusHistory?.[0];
    const currentStatus =
      typeof latestStatus?.description === 'string'
        ? latestStatus.description.toLowerCase().replace(/[-\s]+/g, '_')
        : '';

    if (order.pickup_used || order.PickupDate) {
      throw { status: 409, message: 'Este QR ya fue utilizado: el pedido figura como entregado.' };
    }

    if (currentStatus && currentStatus !== 'ready') {
      throw {
        status: 400,
        message: `El pedido todavia no esta listo para retirar (estado actual: ${currentStatus}).`,
      };
    }

    order.PickupDate = new Date();
    order.pickup_used = true as any;
    await order.save({ transaction: t });
    await Status.create(
      { idOrder: order.idOrder, statusDate: new Date(), description: 'withdrawn' },
      { transaction: t }
    );

    const refreshed = await Order.findByPk(order.idOrder, {
      include: [
        {
          model: OrderLine,
          as: 'orderLines',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['idProduct', 'name'],
              include: [{ model: Image, as: 'images', attributes: ['url'] }],
            },
            { model: Size, as: 'size', attributes: ['idSize', 'sizeDesc'] },
          ],
        },
        {
          model: Status,
          as: 'statusHistory',
          separate: true,
          order: [['statusDate', 'DESC']],
        },
        { model: PaymentMethod, as: 'paymentMethod', attributes: ['name'] },
        { model: User, as: 'user', attributes: ['idUser', 'name', 'email'] },
      ],
      transaction: t,
    });

    if (!refreshed) {
      throw { status: 500, message: 'No se pudo confirmar el retiro.' };
    }

    return refreshed;
  });
};
