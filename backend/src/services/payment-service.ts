import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

// Configuramos el cliente
const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '' });

// --- BORRAMOS normalizeBaseUrl Y buildUrl COMPLEJAS ---
// Usamos esta función simple solo para pegar la ruta base con el path sin duplicar barras
const buildUrl = (path: string, base: string) => {
    // Quitamos la barra final de la base si la tiene y la inicial del path si la tiene
    const cleanBase = base.replace(/\/+$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
};

export const createPreferenceService = async (items: any[], externalReference: string, frontendBaseUrl?: string) => {
    
    const preference = new Preference(client);

    const mpItems = items.map(item => ({
        id: String(item.id),
        title: item.name || item.title || "Producto",
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price ?? item.price ?? 0),
        currency_id: 'ARS'
    }));

    // --- ACÁ ESTÁ EL CAMBIO CLAVE ---
    // 1. Tomamos las variables DIRECTAS.
    // 2. Si no existen, usamos un default para local, pero confiamos en lo que venga del .env
    const frontendUrl = frontendBaseUrl || process.env.FRONTEND_BASE_URL || 'http://localhost:5173';
    
    // OJO ACÁ: Si estás en PROD, asegurate de que PUBLIC_BACKEND_URL esté cargada en Railway.
    const backendUrl = process.env.PUBLIC_BACKEND_URL || 'http://localhost:3000';

    // Construimos las URLs simples
    const successUrl = buildUrl('/checkout/success', frontendUrl);
    const failureUrl = buildUrl('/checkout/failure', frontendUrl);
    const pendingUrl = buildUrl('/checkout/pending', frontendUrl);
    const webhookUrl = buildUrl('/api/payments/webhook', backendUrl);

    // Logs de seguridad para que veas en la consola de Railway qué URL está usando
    console.log('--- DEBUG PREFERENCE ---');
    console.log('Frontend URL:', frontendUrl);
    console.log('Backend URL (Webhook):', webhookUrl); // <--- Mirá este log en Railway si falla
    console.log('------------------------');

    const shouldAutoReturn = successUrl.startsWith('https://');

    const result = await preference.create({
        body: {
            items: mpItems,
            external_reference: externalReference, 
            back_urls: {
                success: successUrl,
                failure: failureUrl,
                pending: pendingUrl
            },
            ...(shouldAutoReturn ? { auto_return: 'approved' as const } : {}),
            notification_url: webhookUrl
        }
    });

    console.log('[MercadoPago] init_point generado:', result.init_point);

    return {
        id: result.id,
        init_point: result.init_point
    };
};

export const getPaymentDataService = async (id: string) => {
    const payment = new Payment(client);
    return await payment.get({ id });
};