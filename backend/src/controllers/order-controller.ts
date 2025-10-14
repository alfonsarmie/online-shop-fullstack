import { Request, Response } from 'express';
import Order from '../models/order-model';
import OrderLine from '../models/order-line-model';
import Status from '../models/status-model';
import Product from '../models/product-model';
import Price from '../models/price-model';
import User from '../models/user-model';
import PaymentMethod from '../models/payment-method-model';
import { Sequelize, Op } from 'sequelize';

// MercadoPago status enum for better type safety
export enum MercadoPagoStatus {
  PENDING = 'pending',
  APPROVED = 'approved', 
  IN_PROCESS = 'in_process',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  CHARGED_BACK = 'charged_back'
}

/**
 * Create a new order with transaction safety
 */
export const createOrder = async (req: Request, res: Response) => {
  const transaction = await Order.sequelize!.transaction();
  
  try {
    const {
      idUser,
      idPaymentMethod,
      customer_name,
      customer_email,
      customer_phone,
      customer_notes,
      sports,
      items, // Cart items array
      external_reference,
      currencyId = 'ARS'
    } = req.body;

    // Validate required fields
    if (!idUser || !idPaymentMethod || !customer_name || !customer_email) {
      await transaction.rollback();
      return res.status(400).json({ 
        error: 'Missing required fields: idUser, idPaymentMethod, customer_name, and customer_email are required' 
      });
    }

    // Validate cart items
    if (!items || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ 
        error: 'Cart cannot be empty' 
      });
    }

    // Verify user exists
    const user = await User.findByPk(idUser, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify payment method exists
    const paymentMethod = await PaymentMethod.findByPk(idPaymentMethod, { transaction });
    if (!paymentMethod) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Payment method not found' });
    }

    // Calculate total and validate current prices
    let total_amount = 0;
    const orderLinesData = [];

    for (const item of items) {
      // Verify product exists and has stock
      const product = await Product.findByPk(item.idProduct, { transaction });
      if (!product) {
        await transaction.rollback();
        return res.status(404).json({ 
          error: `Product not found: ${item.idProduct}` 
        });
      }

      // Check stock availability
      if (product.stock < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({ 
          error: `Insufficient stock for: ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
        });
      }

      // Get current product price
      const currentPrice = await Price.findOne({
        where: { idProduct: item.idProduct },
        order: [['updateDate', 'DESC']],
        transaction
      });

      if (!currentPrice) {
        await transaction.rollback();
        return res.status(400).json({ 
          error: `No price found for product: ${product.name}` 
        });
      }

      const unit_price = Number(currentPrice.value);
      const subtotal = unit_price * item.quantity;
      total_amount += subtotal;

      orderLinesData.push({
        idProduct: item.idProduct,
        product_name: item.name || product.name,
        quantity: item.quantity,
        subtotal,
        size: item.size
      });
    }

    // Create the order
    const order = await Order.create({
      idUser,
      idPaymentMethod,
      customer_name,
      customer_email,
      customer_phone,
      customer_notes,
      sports,
      external_reference,
      currencyId,
      total_amount,
      orderDate: new Date(),
      statusMp: MercadoPagoStatus.PENDING // Use enum for consistency
    }, { transaction });

    // Create order lines
    const orderLines = await OrderLine.bulkCreate(
      orderLinesData.map(line => ({
        idOrder: order.idOrder,
        ...line
      })),
      { transaction }
    );

    // Update product stock for each item
    for (const item of items) {
      await Product.decrement('stock', {
        by: item.quantity,
        where: { idProduct: item.idProduct },
        transaction
      });
    }

    // Create initial status
    await Status.create({
      idOrder: order.idOrder,
      statusDate: new Date(),
      description: 'Order created - Pending payment'
    }, { transaction });

    // Commit transaction
    await transaction.commit();

    // Get complete order with relations
    const completeOrder = await Order.findByPk(order.idOrder, {
      include: [
        { 
          model: OrderLine, 
          as: 'orderLines',
          include: [
            { 
              model: Product, 
              as: 'product',
              attributes: ['idProduct', 'name', 'description']
            }
          ]
        },
        { 
          model: Status, 
          as: 'statusHistory',
          order: [['statusDate', 'DESC']]
        }
      ]
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: completeOrder
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({ 
      error: 'Internal server error while creating order',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get orders with pagination and filtering
 */
export const getOrders = async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 10, userId } = req.query;
    
    const whereClause: any = {};
    
    // Filter by user if specified
    if (userId) {
      whereClause.idUser = userId;
    }

    // Filter by Mercado Pago status if specified
    if (status) {
      whereClause.statusMp = status;
    }

    const orders = await Order.findAll({
      where: whereClause,
      include: [
        { 
          model: User, 
          as: 'user', 
          attributes: ['idUser', 'name', 'email'] 
        },
        { 
          model: PaymentMethod, 
          as: 'paymentMethod', 
          attributes: ['name'] 
        },
        { 
          model: OrderLine, 
          as: 'orderLines',
          include: [
            { 
              model: Product, 
              as: 'product',
              attributes: ['idProduct', 'name', 'description']
            }
          ]
        },
        { 
          model: Status, 
          as: 'statusHistory',
          order: [['statusDate', 'DESC']],
          limit: 1
        }
      ],
      order: [['orderDate', 'DESC']],
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit)
    });

    const total = await Order.count({ where: whereClause });

    res.json({
      orders,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error while fetching orders' });
  }
};

/**
 * Get specific order by ID
 */
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [
        { 
          model: User, 
          as: 'user', 
          attributes: ['idUser', 'name', 'email', 'phone'] 
        },
        { 
          model: PaymentMethod, 
          as: 'paymentMethod' 
        },
        { 
          model: OrderLine, 
          as: 'orderLines',
          include: [
            { 
              model: Product, 
              as: 'product',
              attributes: ['idProduct', 'name', 'description'],
              include: [
                {
                  model: Price,
                  as: 'prices',
                  order: [['updateDate', 'DESC']],
                  limit: 1
                }
              ]
            }
          ]
        },
        { 
          model: Status, 
          as: 'statusHistory',
          order: [['statusDate', 'DESC']]
        }
      ]
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error while fetching order' });
  }
};

/**
 * Update order status and create status history entry
 */
export const updateOrderStatus = async (req: Request, res: Response) => {
  const transaction = await Order.sequelize!.transaction();
  
  try {
    const { id } = req.params;
    const { status, description, payment_id, statusMp } = req.body;

    const order = await Order.findByPk(id, { transaction });
    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update Mercado Pago fields if provided
    const updateData: any = {};
    if (payment_id) updateData.payment_id = payment_id;
    if (statusMp) {
      // Validate statusMp against our enum
      if (!Object.values(MercadoPagoStatus).includes(statusMp)) {
        await transaction.rollback();
        return res.status(400).json({ 
          error: `Invalid statusMp value. Must be one of: ${Object.values(MercadoPagoStatus).join(', ')}` 
        });
      }
      updateData.statusMp = statusMp;
    }

    await order.update(updateData, { transaction });

    // Create new status history entry if provided
    if (status && description) {
      await Status.create({
        idOrder: order.idOrder,
        statusDate: new Date(),
        description: description
      }, { transaction });
    }

    await transaction.commit();

    // Return updated order with status history
    const updatedOrder = await Order.findByPk(id, {
      include: [
        { model: Status, as: 'statusHistory', order: [['statusDate', 'DESC']] }
      ]
    });

    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Internal server error while updating order status' });
  }
};

/**
 * Handle Mercado Pago status updates via webhook or API
 */
export const updateOrderMpStatus = async (req: Request, res: Response) => {
  const transaction = await Order.sequelize!.transaction();
  
  try {
    const { id } = req.params;
    const { payment_id, statusMp, external_reference } = req.body;

    // Validate statusMp
    if (statusMp && !Object.values(MercadoPagoStatus).includes(statusMp)) {
      await transaction.rollback();
      return res.status(400).json({ 
        error: `Invalid statusMp value. Must be one of: ${Object.values(MercadoPagoStatus).join(', ')}` 
      });
    }

    // Find order by multiple identifiers for flexibility
    const order = await Order.findOne({
      where: {
        [Op.or]: [
          { idOrder: id },
          { external_reference: external_reference },
          { payment_id: payment_id }
        ]
      },
      transaction
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Order not found' });
    }

    const updateData: any = {};
    if (payment_id) updateData.payment_id = payment_id;
    if (statusMp) updateData.statusMp = statusMp;

    await order.update(updateData, { transaction });

    // Create appropriate status history based on Mercado Pago status
    let statusDescription = '';
    switch (statusMp) {
      case MercadoPagoStatus.APPROVED:
        statusDescription = 'Payment approved - Order confirmed';
        break;
      case MercadoPagoStatus.PENDING:
        statusDescription = 'Payment pending - Awaiting confirmation';
        break;
      case MercadoPagoStatus.IN_PROCESS:
        statusDescription = 'Payment under review - Processing';
        break;
      case MercadoPagoStatus.REJECTED:
        statusDescription = 'Payment rejected - Please try again';
        break;
      case MercadoPagoStatus.CANCELLED:
        statusDescription = 'Payment cancelled by user';
        break;
      case MercadoPagoStatus.REFUNDED:
        statusDescription = 'Payment refunded to customer';
        // Restore stock when payment is refunded
        await restoreOrderStock(order.idOrder, transaction);
        break;
      case MercadoPagoStatus.CHARGED_BACK:
        statusDescription = 'Chargeback initiated on payment card';
        // Restore stock when chargeback occurs
        await restoreOrderStock(order.idOrder, transaction);
        break;
      default:
        statusDescription = `Payment status: ${statusMp}`;
    }

    await Status.create({
      idOrder: order.idOrder,
      statusDate: new Date(),
      description: statusDescription
    }, { transaction });

    await transaction.commit();

    res.json({
      message: 'Mercado Pago status updated successfully',
      order
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating Mercado Pago status:', error);
    res.status(500).json({ error: 'Internal server error while updating Mercado Pago status' });
  }
};

/**
 * Helper function to restore stock when order is refunded or charged back
 */
const restoreOrderStock = async (orderId: number, transaction: any) => {
  const orderLines = await OrderLine.findAll({
    where: { idOrder: orderId },
    transaction
  });

  for (const line of orderLines) {
    await Product.increment('stock', {
      by: line.quantity,
      where: { idProduct: line.idProduct },
      transaction
    });
  }
};

/**
 * Get all orders for a specific user
 */
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const orders = await Order.findAll({
      where: { idUser: userId },
      include: [
        { 
          model: OrderLine, 
          as: 'orderLines',
          include: [
            { 
              model: Product, 
              as: 'product',
              attributes: ['idProduct', 'name', 'description']
            }
          ]
        },
        { 
          model: Status, 
          as: 'statusHistory',
          order: [['statusDate', 'DESC']],
          limit: 1
        }
      ],
      order: [['orderDate', 'DESC']]
    });

    res.json({
      message: 'User orders retrieved successfully',
      orders
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Internal server error while fetching user orders' });
  }
};

/**
 * Delete order and associated records
 */
export const deleteOrder = async (req: Request, res: Response) => {
  const transaction = await Order.sequelize!.transaction();
  
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, { transaction });
    
    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Order not found' });
    }

    // Restore product stock before deleting order lines
    await restoreOrderStock(parseInt(id), transaction);

    // Delete order lines and status history
    await OrderLine.destroy({ where: { idOrder: id }, transaction });
    await Status.destroy({ where: { idOrder: id }, transaction });
    await order.destroy({ transaction });

    await transaction.commit();

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Internal server error while deleting order' });
  }
};

/**
 * Get order statistics for admin dashboard
 */
export const getOrderStatistics = async (req: Request, res: Response) => {
  try {
    const totalOrders = await Order.count();
    const pendingOrders = await Order.count({ where: { statusMp: MercadoPagoStatus.PENDING } });
    const completedOrders = await Order.count({ where: { statusMp: MercadoPagoStatus.APPROVED } });
    const refundedOrders = await Order.count({ where: { statusMp: MercadoPagoStatus.REFUNDED } });
    
    const totalRevenue = await Order.sum('total_amount', {
      where: { statusMp: MercadoPagoStatus.APPROVED }
    });

    // Get monthly statistics
    const monthlyStats = await Order.findAll({
      attributes: [
        [Sequelize.fn('YEAR', Sequelize.col('orderDate')), 'year'],
        [Sequelize.fn('MONTH', Sequelize.col('orderDate')), 'month'],
        [Sequelize.fn('COUNT', Sequelize.col('idOrder')), 'orderCount'],
        [Sequelize.fn('SUM', Sequelize.col('total_amount')), 'totalRevenue']
      ],
      where: { statusMp: MercadoPagoStatus.APPROVED },
      group: ['year', 'month'],
      order: [['year', 'DESC'], ['month', 'DESC']],
      limit: 6
    });

    res.json({
      totalOrders,
      pendingOrders,
      completedOrders,
      refundedOrders,
      totalRevenue: totalRevenue || 0,
      monthlyStats
    });
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    res.status(500).json({ error: 'Internal server error while fetching statistics' });
  }
};