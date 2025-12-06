// SDK de Mercado Pago
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { createPreferenceService, getPaymentDataService } from '../services/payment-service';
import { createOrder, updateOrderStatus } from '../services/order-service';

export const createPreference = async (req: any, res: any) => {
    try {
        const { cartItems, storedUser, checkoutData } = req.body; // Asume que envías userId desde el front o lo sacas del token

        // 1. Crear la orden completa (Header + Lines) en la DB
        // Pasamos un userId hardcodeado (1) si no viene en el body, ajusta según tu auth
        const orderId = await createOrder(cartItems, storedUser?.idUser || 1, checkoutData || {});

        // 2. Crea la preferencia pasando el ID de la orden real como referencia externa
        const result = await createPreferenceService(cartItems, orderId);

        res.status(200).json(result);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Execution on payment preference creation failed. Please contact the administrator.'
        });
    }
}

export const receiveWebhook = async (req: any, res: any) => {
    /*
    try {
        const payment = req.query;
        console.log(payment);

        if (payment.type === 'payment') {
            const data = await getPaymentDataService(payment['data.id']);
            console.log(data);

            // Verificamos que venga la referencia externa (nuestro ID de orden)
            if (data.external_reference) {
                // Actualizamos estado y stock (si corresponde) en una sola operación atómica
                await updateOrderStatus(data.external_reference, data.status);
                
                if (data.status === 'approved') {
                    console.log(`Orden ${data.external_reference} procesada y stock actualizado.`);
                }
            }
        }

        res.sendStatus(204);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
        */
}