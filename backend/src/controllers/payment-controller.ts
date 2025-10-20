// Create a checkout session with Stripe
import Stripe from 'stripe';
import { Request, Response } from 'express';
import { Op } from 'sequelize';


import Product from '../models/product-model';
import Price from '../models/price-model';
import { buildIdempotencyKey } from '../helpers/idempotency-helper';


const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const createCheckoutSession = async (req: Request, res: Response) => {


    const { items, orderDetails, userId} = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ msg: 'El carrito está vacío' });
    }
    if (!orderDetails || typeof orderDetails !== 'object') {
        return res.status(400).json({ msg: 'Faltan los datos de la orden (orderDetails)' });
    }
    if (!orderDetails.customer_email) {
        return res.status(400).json({ msg: 'Falta el email del cliente (orderDetails.customer_email)' });
    }

    try {

        console.log('📥 Items recibidos del frontend:', JSON.stringify(items, null, 2));

        // Fetch product details from the database
        // Accept both shapes from frontend: { id, quantity } or { idProduct, quantity }
        const ids = items.map((it: { id?: string | number; idProduct?: string | number }) => {
            
            const id = Number((it as any).id ?? (it as any).idProduct);
            
            if (!Number.isFinite(id)) {
                throw new Error('Formato de item inválido: cada item debe incluir id o idProduct numérico');
            
            }
            
            return id;
        });
        
        const products = await Product.findAll({
            where: { idProduct: { [Op.in]: ids } },
            attributes: ['idProduct', 'name'],
        });



        const priceMap = new Map<number, number>(); //Key-Value structure
        for (const id of ids) {
            
            const latestPrice = await Price.findOne({
                where: { idProduct: id },
                order: [['updateDate', 'DESC']],
                attributes: ['idProduct', 'value'],
            });
            
            if (!latestPrice) {
                
                throw new Error(`No hay precio vigente para el producto ${id}`);
            }
            priceMap.set(id, latestPrice.value);
        
        }


        const currency = (req.body.currency || 'usd').toLowerCase();

        const line_items = items.map((item: { id?: string | number; idProduct?: string | number; idSize?: string | number; quantity: number }) => {
            
            const id = Number((item as any).id ?? (item as any).idProduct);
            const idSize = (item as any).idSize !== undefined ? Number((item as any).idSize) : undefined;
            const product = products.find((p) => p.idProduct === id);
            const value = priceMap.get(id);
            
            if (!Number.isFinite(value)) {
                throw new Error(`No se pudo determinar el precio para el producto ${id}`);
            }

            // Strip expect the amount in the smallest currency unit (cents for ARS/USD)
            const unit_amount = Math.round((value as number) * 100);

            return {
                quantity: item.quantity,
                price_data: {
                currency,
                product_data: {
                    name: product?.name ?? `Producto ${id}`,
                    metadata: {
                        idProduct: String(id),
                        ...(Number.isFinite(idSize as number) ? { idSize: String(idSize) } : {}),
                    },
                },
                unit_amount,
                },
            };
        });


        // Normalize items for idempotency key (deterministic)
        const normalizedForKey = items.map((it: { id?: string | number; idProduct?: string | number; quantity: number }) => ({
            id: Number((it as any).id ?? (it as any).idProduct),
            quantity: Number(it.quantity),
        }));

        const idempotencyKey =
            req.body.idempotencyKey 
            ?? buildIdempotencyKey(userId ?? 'anon', normalizedForKey, 'checkout');


        //Create the checkout session
        const session = await stripeClient.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_BASE_URL}/cart`,
            metadata: {
                userId: userId?.toString() || 'guest',
                orderDetails: JSON.stringify(orderDetails),
            },
            customer_email: orderDetails.customer_email,
        
        
            }, 
            //{ idempotencyKey }
        );



        return res.status(200).json({ url : session.url });
    
    }catch (error) {
        console.error('Error creating checkout session:', error);
        return res.status(500).json({ msg: 'Internal server error' });
    }

}