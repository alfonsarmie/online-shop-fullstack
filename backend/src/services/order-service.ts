import Order from '../models/order-model'; 
import OrderLine from '../models/order-line-model';
import Product from '../models/product-model'; // Asegúrate de tener este modelo
import db from '../db/connection';
import { v4 as uuidv4 } from 'uuid';

// Agregamos checkoutData como tercer argumento
export const createOrder = async (items: any[], userId: number, checkoutData: any) => {
    const t = await db.transaction();

    try {
        
        const external_reference = uuidv4();

        // 1. Calcular el total
        const total = items.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0);

        // 2. Crear la Orden (Cabecera)
        const newOrder = await Order.create({
            idUser: userId,
            orderDate: new Date(),
            total_amount: total, 
            statusMp: 'pending', 
            external_reference: external_reference,
            customer_name: checkoutData.name, 
            customer_email: checkoutData.email,
            customer_phone: checkoutData.phone,
            customer_notes: checkoutData.notes,
            idPaymentMethod: 1 
        }, { transaction: t });

        
        // 3. Preparar y Crear las OrderLines (Detalle)
        // Descomenta esto cuando tengas listos los datos de items    
        const lines = items.map(item => ({
            idOrder: newOrder.getDataValue('idOrder'),
            idProduct: item.id,
            idSize: item.sizeId || 1,
            quantity: item.quantity,
            subtotal: item.unit_price * item.quantity
        }));

        await OrderLine.bulkCreate(lines, { transaction: t });


        // Confirmar transacción
        await t.commit();

        // Retornamos la external_reference para enviarla a Mercado Pago
        return external_reference;

    } catch (error) {
        await t.rollback();
        throw error;
    }
};

export const updateOrderStatus = async (externalReference: string, status: string) => {
    const t = await db.transaction();
    /*
    try {
        // 1. Actualizamos el estado de la orden
        await Order.update({ statusMp: status }, {
            where: { external_reference: externalReference },
            transaction: t
        });

        // 2. Si el pago fue APROBADO, descontamos el stock
        if (status === 'approved') {
            const order = await Order.findOne({ 
                where: { external_reference: externalReference },
                transaction: t 
            });

            if (order) {
                const lines = await OrderLine.findAll({ 
                    where: { idOrder: order.idOrder },
                    transaction: t
                });

                for (const line of lines) {
                    // Decrementamos el stock del producto según la cantidad comprada
                    await Product.decrement('stock', { 
                        by: line.quantity,
                        where: { idProduct: line.idProduct },
                        transaction: t
                    });
                }
            }
        }
            

        await t.commit();
    } catch (error) {
        await t.rollback();
        console.error("Error actualizando orden y stock:", error);
        throw error;
    }
        */
};