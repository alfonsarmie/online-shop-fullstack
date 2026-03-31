import { Request, Response } from 'express';
import { Transaction, Op, Sequelize } from 'sequelize';
import { db } from '../db/connection';
import Order from '../models/order-model';
import OrderLine from '../models/order-line-model';
import Product from '../models/product-model';
import ProductSize from '../models/size-product-model';
import Size from '../models/size-model';
import Status from '../models/status-model';

// Stripe integration removed from project — stripe client intentionally not initialized.

// Plain order shape used when serializing Sequelize instances for responses
type PlainOrder = {
    idOrder: number;
    orderDate: string | Date;
    PickupDate?: string | Date | null;
    idUser?: string;
    idPaymentMethod?: number;
    external_reference?: string;
    payment_id?: string;
    total_amount?: number | string;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    customer_notes?: string;
    sport?: string;
    statusMp?: string;
    currencyId?: string;
    orderLines?: any[];
    statusHistory?: any[];
    latestStatus?: {
        statusDate: string | Date;
        description: string;
    } | null;
    [key: string]: any;
};


export const createOrderFromSession = async (_req: Request, res: Response) => {
    return res.status(501).json({ msg: 'Stripe integration removed — createOrderFromSession is not available.' });
};


export const getUserOrders = async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ msg: 'userId es requerido' });
    }

    try {
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
                            attributes: ['idProduct', 'name'],
                            include: [
                                {
                                    model: (await import('../models/image-model')).default,
                                    as: 'images',
                                    attributes: ['url'],
                                },
                            ],
                        },
                        {
                            model: Size,
                            as: 'size',
                            attributes: ['idSize', 'sizeDesc'],
                        },
                    ],
                },
                {
                    model: Status,
                    as: 'statusHistory',
                    attributes: ['statusDate', 'description'],
                    order: [['statusDate', 'DESC']],
                    separate: true
                },
            ],
            order: [['orderDate', 'DESC']], // Más recientes primero
        });

        // Mapear las órdenes al formato que espera el frontend
        const mappedOrders = orders.map((order) => {
            const plainOrder = order.get({ plain: true }) as PlainOrder;
            
            // Mapear orderLines para incluir el nombre del talle
            if (plainOrder.orderLines) {
                plainOrder.orderLines = plainOrder.orderLines.map((line: any) => ({
                    ...line,
                    size: line.size?.sizeDesc || null,
                    product_name: line.product?.name || null,
                    product_image: (line.product?.images && line.product.images.length > 0) ? line.product.images[0].url : null,
                }));
            }

            // Agregar el último status de la orden
            if (plainOrder.statusHistory && plainOrder.statusHistory.length > 0) {
                plainOrder.latestStatus = plainOrder.statusHistory[0]; // El primero es el más reciente
            } else {
                plainOrder.latestStatus = null;
            }

            return plainOrder;
        });

        return res.status(200).json({ orders: mappedOrders });

    } catch (error: any) {
        console.error('❌ Error fetching user orders:', error);
        return res.status(500).json({
            msg: 'Error al obtener las órdenes',
            error: error.message,
        });
    }
};

/**
 * @desc    Obtiene órdenes paginadas (para admin)
 * @route   GET /api/orders
 */
export const getOrders = async (req: Request, res: Response) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const offset = (page - 1) * limit;

    try {
        const { count, rows } = await Order.findAndCountAll({
            include: [
                {
                    model: OrderLine,
                    as: 'orderLines',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['idProduct', 'name'],
                            include: [
                                {
                                    model: (await import('../models/image-model')).default,
                                    as: 'images',
                                    attributes: ['url'],
                                },
                            ],
                        },
                        {
                            model: Size,
                            as: 'size',
                            attributes: ['idSize', 'sizeDesc'],
                        },
                    ],
                },
                {
                    model: Status,
                    as: 'statusHistory',
                    attributes: ['statusDate', 'description'],
                    order: [['statusDate', 'DESC']],
                    limit: 1, // Solo el más reciente
                },
            ],
            order: [['orderDate', 'DESC']],
            limit,
            offset,
        });

        const mappedOrders = rows.map((order) => {
            const plainOrder = order.get({ plain: true }) as PlainOrder;
            if (plainOrder.orderLines) {
                plainOrder.orderLines = plainOrder.orderLines.map((line: any) => ({
                    ...line,
                    size: line.size?.sizeDesc || null,
                    product_name: line.product?.name || null,
                    product_image: (line.product?.images && line.product.images.length > 0) ? line.product.images[0].url : null,
                }));
            }

            // Agregar el último status de la orden
            if (plainOrder.statusHistory && plainOrder.statusHistory.length > 0) {
                plainOrder.latestStatus = plainOrder.statusHistory[0]; // El primero es el más reciente
            } else {
                plainOrder.latestStatus = null;
            }

            return plainOrder;
        });

        const totalPages = Math.max(1, Math.ceil(count / limit));

        return res.status(200).json({
            orders: mappedOrders,
            total: count,
            page,
            totalPages,
        });
    } catch (error: any) {
        console.error('❌ Error fetching orders (admin):', error);
        return res.status(500).json({
            msg: 'Error al obtener las órdenes',
            error: error.message,
        });
    }
};

export const getMonthlyWorth = async (req: Request, res: Response) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1);

        const total = await Order.sum('total_amount', {
            where: {
                orderDate: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }
        });

        const monthlyWorth = Number(total || 0);

        return res.status(200).json({
            total_monthly_worth: monthlyWorth,
            month: now.getMonth() + 1, // Mes actual (1-12)
        });

    } catch (error: any) {
        return res.status(500).json({
            msg: 'Error fetching monthly worth',
            error: error.message,
        });
    }
};

export const getSportsStats = async (req: Request, res: Response) => {
    try {
        const now = new Date();

        const startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);

        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const sportsStats = await Order.findAll({
            attributes: [
                'sport',
                [Order.sequelize!.fn('COUNT', Order.sequelize!.col('idOrder')), 'ordersCount']
            ],
            where: {
                orderDate: {
                    [Op.between]: [startDate, endDate]
                }
            },
            group: ['sport'],
            raw: true,
        });
        
        const filteredSportsStats = sportsStats.filter(stat => stat.sport !== null);
        
        return res.status(200).json({
            stats: filteredSportsStats
        });
    } catch (error: any) {
        return res.status(500).json({
            msg: 'Error fetching Orders by Sports',
            error: error.message,
        });
    }
};

export const getStatusStats = async (req: Request, res: Response) => {
    try {
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

       
        const orders = await Order.findAll({
            where: {
                orderDate: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: [
                {
                    model: Status,
                    as: 'statusHistory',
                    attributes: ['statusDate', 'description'],
                    order: [['statusDate', 'DESC']],
                    limit: 1 
                }
            ]
        });

        
        const statusCounts: { [key: string]: number } = {};
        
        orders.forEach(order => {
            const orderWithStatus = order as PlainOrder;
            const currentStatus = orderWithStatus.statusHistory && orderWithStatus.statusHistory.length > 0 
                ? orderWithStatus.statusHistory[0].description 
                : 'Sin estado';
            
            statusCounts[currentStatus] = (statusCounts[currentStatus] || 0) + 1;
        });

        
        const result = Object.entries(statusCounts).map(([status, count]) => ({
            status,
            count
        }));

        return res.status(200).json({ stats: result });
    } catch (error: any) {
        return res.status(500).json({
            msg: 'Error fetching Orders by Status',
            error: error.message,
        });
    }
}

export const buttonOfRegret = async (req: Request, res: Response) => {
    try {
        const { idOrder } = req.params;
        if (!idOrder) {
            return res.status(400).json({ msg: 'idOrder es requerido' });
        }

        const order = await Order.findByPk(Number(idOrder));

        if (!order) {
            return res.status(404).json({ msg: 'Orden no encontrada' });
        }

        const orderDate = order.orderDate ? new Date(order.orderDate as any) : null;
        if (!orderDate) {
            return res.status(400).json({ msg: 'OrderDate inválida' });
        }

        const now = new Date();
        const msSinceOrder = now.getTime() - orderDate.getTime();
        const hoursSinceOrder = msSinceOrder / (1000 * 60 * 60);

        if (hoursSinceOrder > 24) {
            return res.status(400).json({ msg: 'No se puede cancelar: pasaron más de 24 horas desde la orden' });
        }

        // Obtener último status de la orden
        const latestStatus = await Status.findOne({
            where: { idOrder: Number(idOrder) },
            order: [['statusDate', 'DESC']],
        });

        if (!latestStatus) {
            return res.status(400).json({ msg: 'No se encontró estado para la orden' });
        }

        const desc = (latestStatus.description || '');
        if (desc !== 'ready' && desc !== 'confirmed') {
            return res.status(400).json({ msg: "Sólo se pueden cancelar órdenes con estado 'ready' o 'confirmed'" });
        }

        // Obtener las líneas de la orden
        const orderLines = await OrderLine.findAll({ where: { idOrder: Number(idOrder) } });

        if (!orderLines || orderLines.length === 0) {
            return res.status(400).json({ msg: 'La orden no tiene líneas' });
        }

        let createdStatus: any = null;

        await db.transaction(async (t: Transaction) => {
            // Crear status 'cancelled' vinculado a la orden
            createdStatus = await Status.create({
                idOrder: Number(idOrder),
                statusDate: new Date(),
                description: 'cancelled',
            }, { transaction: t });

            // Para cada order line, sumar la cantidad al stock correspondiente
            for (const line of orderLines) {
                const idSize = line.idSize ?? 7; 

                const ps = await ProductSize.findOne({
                    where: { idProduct: line.idProduct, idSize },
                    transaction: t,
                    lock: t.LOCK.UPDATE,
                });

                if (!ps) {
                    throw new Error(`No existe product_size para product=${line.idProduct} size=${idSize}`);
                }

                ps.stock = (ps.stock || 0) + (line.quantity || 0);
                await ps.save({ transaction: t });
            }
        });

        return res.status(201).json({ msg: 'Orden cancelada correctamente', status: createdStatus });
    } catch (error) {
        console.error('Error en ButtonOfRegret:', error);
        return res.status(500).json({ msg: 'Error al procesar cancelación', error: (error as any).message || error });
    }
}