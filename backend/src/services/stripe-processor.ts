import Stripe from 'stripe';
import { Request, Response } from 'express';
import { Op, Transaction } from 'sequelize';
import Product from '../models/product-model';
import { db } from '../db/connection';
import Order from '../models/order-model';
import OrderLine from '../models/order-line-model';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


export const stripeWebhookHandler = async (req: Request, res: Response) => {

    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event;
    
    if (!sig) {
        return res.status(400).send('Missing Stripe signature');
    }

    
    try {
        event = Stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    
    } catch (err: any) {
        console.error('Error verifying Stripe webhook signature:', err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }



    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;
            
            const raw = session.metadata?.orderDetails;
            let orderDetailsParsed: any | undefined = undefined;

            if (raw) {
                try {
                    orderDetailsParsed = JSON.parse(raw);
                } catch (e) {
                    console.warn('orderDetails no es JSON válido:', e);
                }
            }

            const customerName = session.customer_details?.name || orderDetailsParsed?.customer_name || 'N/A';
            const customerEmail = session.customer_details?.email || orderDetailsParsed?.customer_email || 'no-reply@example.com';
            const customerPhone = session.customer_details?.phone || orderDetailsParsed?.customer_phone || undefined;
            const customerNotes = orderDetailsParsed?.customer_notes || undefined;
            const sports = session.metadata?.deporte || orderDetailsParsed?.deporte || '';

    
            const externalRef = session.id; 
            const paymentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;

            const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
                expand: ['data.price.product'],
                limit: 100,
            });
            

        
            let totalCents = 0;
            const parsedItems: Array<{ idProduct: number; idSize?: number; quantity: number; subtotalCents: number }> = [];

            for (const li of lineItems.data) {
                const qty = li.quantity ?? 1;
                const price = li.price!;
                const unitAmount = price.unit_amount ?? 0;
                const productObj = price.product as Stripe.Product; // gracias al expand
                const idProductMeta = productObj?.metadata?.idProduct;
                const idSizeMeta = productObj?.metadata?.idSize;

                if (!idProductMeta) {
                throw new Error('Line item missing product metadata (idProduct). Asegúrate de setear product_data.metadata al crear la sesión.');
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


            await db.transaction(async (t: Transaction) => {

                const currency = (session.currency || 'ars').toUpperCase();

                const order = await Order.create({
                    orderDate: new Date(),
                    idUser: Number((session.metadata?.userId ?? 0) || 0), 
                    idPaymentMethod: 1,                                    
                    external_reference: externalRef,
                    payment_id: paymentId ?? undefined,
                    total_amount: Number((totalCents / 100).toFixed(2)),
                    customer_name: customerName,
                    customer_email: customerEmail,
                    customer_phone: customerPhone,
                    customer_notes: customerNotes,
                    currencyId: currency,
                    sports: sports,
                    statusMp: 'approved',
                }, { transaction: t });


                for (const item of parsedItems) {
                    // Bloquear fila del producto para evitar carreras
                    const product = await Product.findByPk(item.idProduct, {
                        transaction: t,
                        lock: t.LOCK.UPDATE, // row-level lock
                    });
                    if (!product) throw new Error(`No existe el producto ${item.idProduct}`);

                    if (product.stock < item.quantity) {
                        throw new Error(`Stock insuficiente para producto ${product.idProduct}`);
                    }

                    product.stock = product.stock - item.quantity;
                    await product.save({ transaction: t });

                    // OJO: tu OrderLine requiere idSize NOT NULL; asegúrate de tener idSize
                    // Si tu checkout no maneja talles, cambia tu esquema o envía idSize desde el frontend
                    await OrderLine.create({
                        idOrder: order.idOrder,
                        idProduct: item.idProduct,
                        idSize: item.idSize ?? 0, // evitaría error si la columna acepta NULL; en tu modelo no acepta null
                        quantity: item.quantity,
                        subtotal: Number((item.subtotalCents / 100).toFixed(2)),
                    }, { transaction: t });
                    
                
                }


                return res.status(200).json({ order });
            })
            
        // Handle other event types as needed
        default:
            console.log(`Unhandled event type ${event.type}`);
    }


}
