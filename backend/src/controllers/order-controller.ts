import Stripe from 'stripe';
import { Request, Response } from 'express';
import { Transaction } from 'sequelize';
import { db } from '../db/connection';
import Order from '../models/order-model';
import OrderLine from '../models/order-line-model';
import Product from '../models/product-model';
import Size from '../models/size-model';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * @desc    Verifica el pago en Stripe y crea la orden si fue exitoso
 * @route   POST /api/orders/create-from-session
 * @access  Public (cualquiera con session_id puede llamarlo)
 */
export const createOrderFromSession = async (req: Request, res: Response) => {
    const { session_id } = req.body;

    if (!session_id) {
        return res.status(400).json({ msg: 'session_id es requerido' });
    }

    try {
        console.log(`🔍 Verificando sesión de Stripe: ${session_id}`);

        // 1. Obtener la sesión de Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);

        console.log(`✅ Sesión recuperada: ${session.id}, status: ${session.payment_status}`);

        // 2. Verificar que el pago fue exitoso
        if (session.payment_status !== 'paid') {
            return res.status(400).json({ 
                msg: 'El pago no ha sido completado',
                payment_status: session.payment_status 
            });
        }

        // 3. Verificar si ya existe una orden para esta sesión
        // Usar el nombre del atributo del modelo, Sequelize lo mapeará a 'externalReference' en la DB
        const existingOrder = await Order.findOne({
            where: { external_reference: session.id }
        });

        if (existingOrder) {
            console.log(`ℹ️ La orden ya existe: #${existingOrder.idOrder}`);
            return res.status(200).json({ 
                msg: 'La orden ya fue creada previamente',
                order: existingOrder 
            });
        }

        // 4. Obtener los items de la sesión
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
            expand: ['data.price.product'],
            limit: 100,
        });

        console.log(`📦 Items en la sesión: ${lineItems.data.length}`);

        // 5. Parsear orderDetails del metadata
        const raw = session.metadata?.orderDetails;
        let orderDetailsParsed: any = {};
        if (raw) {
            try {
                orderDetailsParsed = JSON.parse(raw);
            } catch (e) {
                console.warn('orderDetails no es JSON válido:', e);
            }
        }

        // 6. Extraer información
        const customerName = session.customer_details?.name || orderDetailsParsed?.customer_name || 'N/A';
        const customerEmail = session.customer_details?.email || orderDetailsParsed?.customer_email || 'no-reply@example.com';
        const customerPhone = session.customer_details?.phone || orderDetailsParsed?.phone || undefined;
        const customerNotes = orderDetailsParsed?.notes || undefined;
        
        // El campo sports en DB es JSON, necesita un objeto válido o null
        let sports: any = null;
        if (orderDetailsParsed?.deporte) {
            const deporteValue = orderDetailsParsed.deporte;
            if (typeof deporteValue === 'string') {
                // Convertir string a objeto JSON válido
                sports = { deporte: deporteValue };
            } else if (typeof deporteValue === 'object') {
                sports = deporteValue;
            }
        }
        
        const paymentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;

        // Map Stripe statuses to our internal provider status (statusMp)
        const mapStripeToStatusMp = (sess: any) => {
            // Stripe checkout.session.payment_status can be: 'paid', 'unpaid', 'no_payment_required'
            if (sess.payment_status === 'paid') return 'approved';
            if (sess.payment_status === 'unpaid') return 'pending';
            if (sess.payment_status === 'no_payment_required') return 'pending';

            // If a PaymentIntent object is available, use its status for finer granularity
            const pi = typeof sess.payment_intent === 'object' ? sess.payment_intent : undefined;
            const piStatus = pi?.status;
            if (piStatus === 'succeeded') return 'approved';
            if (piStatus === 'processing') return 'in_process';
            if (piStatus === 'requires_payment_method' || piStatus === 'requires_action' || piStatus === 'requires_confirmation') return 'pending';
            if (piStatus === 'canceled' || piStatus === 'failed') return 'cancelled';

            // Default fallback
            return 'pending';
        };

        const detectedStatusMp = mapStripeToStatusMp(session as any);

        // 7. Calcular total y parsear items
        let totalCents = 0;
        const parsedItems: Array<{ idProduct: number; idSize?: number; quantity: number; subtotalCents: number }> = [];

        for (const li of lineItems.data) {
            const qty = li.quantity ?? 1;
            const price = li.price!;
            const unitAmount = price.unit_amount ?? 0;
            const productObj = price.product as Stripe.Product;
            const idProductMeta = productObj?.metadata?.idProduct;
            const idSizeMeta = productObj?.metadata?.idSize;

            console.log(`📦 Line Item:`, {
                productName: productObj?.name,
                idProduct: idProductMeta,
                idSize: idSizeMeta,
                quantity: qty,
                metadata: productObj?.metadata
            });

            if (!idProductMeta) {
                throw new Error('Line item missing product metadata (idProduct)');
            }

            const subtotalCents = unitAmount * qty;
            totalCents += subtotalCents;

            parsedItems.push({
                idProduct: Number(idProductMeta),
                idSize: idSizeMeta ? Number(idSizeMeta) : undefined,
                quantity: qty,
                subtotalCents,
            });
        }

        // 8. Parsear expectedPickupDate
        let expectedPickupDate: Date | undefined = undefined;
        if (orderDetailsParsed.expected_pickup_date) {
            const dateParts = orderDetailsParsed.expected_pickup_date.split('-');
            if (dateParts.length === 3) {
                const [dd, mm, yyyy] = dateParts;
                expectedPickupDate = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
            }
        }

        // 9. Crear la orden en una transacción
        let createdOrder: Order;

        await db.transaction(async (t: Transaction) => {
            const currency = (session.currency || 'usd').toUpperCase();

            // Crear la orden
            createdOrder = await Order.create({
                orderDate: new Date(),
                expectedPickupDate: expectedPickupDate,
                idUser: Number(session.metadata?.userId || 0),
                idPaymentMethod: 1, // 1 = Stripe
                external_reference: session.id,
                payment_id: paymentId ?? undefined,
                total_amount: Number((totalCents / 100).toFixed(2)),
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: customerPhone,
                customer_notes: customerNotes,
                currencyId: currency,
                sports: sports,
                statusMp: detectedStatusMp, // Mapeado desde Stripe (p. ej. 'approved' si payment_status === 'paid')
            }, { transaction: t });

            console.log(`✅ Orden #${createdOrder.idOrder} creada`);

            // Crear las líneas de orden y descontar stock
            for (const item of parsedItems) {
                const product = await Product.findByPk(item.idProduct, {
                    transaction: t,
                    lock: t.LOCK.UPDATE,
                });

                if (!product) {
                    throw new Error(`No existe el producto ${item.idProduct}`);
                }

                if (product.stock < item.quantity) {
                    console.warn(`⚠️ Stock insuficiente para producto ${product.idProduct}`);
                }

                // Descontar stock
                product.stock = Math.max(0, product.stock - item.quantity);
                await product.save({ transaction: t });

                // Crear línea de orden
                await OrderLine.create({
                    idOrder: createdOrder.idOrder,
                    idProduct: item.idProduct,
                    idSize: item.idSize ?? 7, // Si no hay talla, usar 7 (Único)
                    quantity: item.quantity,
                    subtotal: Number((item.subtotalCents / 100).toFixed(2)),
                }, { transaction: t });

                console.log(`📦 Stock actualizado para producto ${product.idProduct}: ${product.stock}`);
            }
        });

        console.log(`🎉 Orden #${createdOrder!.idOrder} creada exitosamente`);

        return res.status(201).json({
            msg: 'Orden creada exitosamente',
            order: createdOrder!,
        });

    } catch (error: any) {
        console.error('❌ Error creating order from session:', error);
        return res.status(500).json({
            msg: 'Error al crear la orden',
            error: error.message,
        });
    }
};

/**
 * @desc    Obtiene todas las órdenes de un usuario
 * @route   GET /api/orders/user/:userId
 * @access  Private (el usuario debe estar autenticado)
 */
export const getUserOrders = async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ msg: 'userId es requerido' });
    }

    try {
        const orders = await Order.findAll({
            where: { idUser: Number(userId) },
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
            ],
            order: [['orderDate', 'DESC']], // Más recientes primero
        });

        // Mapear las órdenes al formato que espera el frontend
        const mappedOrders = orders.map((order) => {
            const plainOrder = order.toJSON() as any;
            
            // Mapear orderLines para incluir el nombre del talle
            if (plainOrder.orderLines) {
                plainOrder.orderLines = plainOrder.orderLines.map((line: any) => ({
                    ...line,
                    size: line.size?.sizeDesc || null,
                    product_name: line.product?.name || null,
                    product_image: (line.product?.images && line.product.images.length > 0) ? line.product.images[0].url : null,
                }));
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
            ],
            order: [['orderDate', 'DESC']],
            limit,
            offset,
        });

        const mappedOrders = rows.map((order) => {
            const plainOrder = (order as any).toJSON();
            if (plainOrder.orderLines) {
                plainOrder.orderLines = plainOrder.orderLines.map((line: any) => ({
                    ...line,
                    size: line.size?.sizeDesc || null,
                    product_name: line.product?.name || null,
                    product_image: (line.product?.images && line.product.images.length > 0) ? line.product.images[0].url : null,
                }));
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

export const updateOrderStatusMp = async (req: Request, res: Response) => {
    try {
        const { idOrder } = req.params;
        const { status } = req.body; //allowed values: 'a retirar' or 'retirado'

        if (!idOrder || !status) {
            return res.status(400).json({
                msg: "Faltan parámetros requeridos (idOrder, status)",
            });
        }

        if (status !== "a retirar" && status !== "retirado") {
            return res.status(400).json({
                msg: "Status inválido, debe ser 'a retirar' o 'retirado'",
            });
        }

        const order = await Order.findByPk(idOrder);

        if (!order) {
            return res.status(404).json({
                msg: "Orden no encontrada",
            });
        }

        order.statusMp = status;
        await order.save();

        return res.status(200).json({
            msg: "StatusMp actualizado correctamente",
            order,
        });
    } catch (error: any) {
        console.error('❌ Error actualizando statusMp:', error);
        return res.status(500).json({
            msg: "Error actualizando statusMp",
            error: error.message,
        });
    }
};
