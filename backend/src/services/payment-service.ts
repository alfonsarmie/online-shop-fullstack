import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '' });

export const createPreferenceService = async (items: any[], externalReference: string) => {
    const preference = new Preference(client);

    const result = await preference.create({
        body: {
            items: items,
            external_reference: externalReference, 
            back_urls: {
                // Estas deben apuntar a tu FRONTEND (React/Vite)
                success: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/success`,
                failure: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/failure`,
                pending: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/pending`
            },
            auto_return: "approved",
            // Esta debe apuntar a tu BACKEND. 
            // IMPORTANTE: En desarrollo usa la URL de Ngrok, no localhost.
            notification_url: `${process.env.BACKEND_URL}/api/payments/webhook` 
        }
    });

    return {
        id: result.id,
        init_point: result.init_point
    };
};

export const getPaymentDataService = async (id: string) => {
    const payment = new Payment(client);
    return await payment.get({ id });
};
