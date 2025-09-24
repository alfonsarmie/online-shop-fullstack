// Shared Mercado Pago client factory to avoid reconnecting on every request
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

let cachedConfig: MercadoPagoConfig | null = null;
let cachedPreference: Preference | null = null;
let cachedPayment: Payment | null = null;

// Lazily build the Mercado Pago SDK config using the access token stored in env vars
function getConfig(): MercadoPagoConfig {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('MERCADOPAGO_ACCESS_TOKEN is not configured');
  }

  if (!cachedConfig) {
    cachedConfig = new MercadoPagoConfig({ accessToken });
  }

  return cachedConfig;
}

// Reuse a single Preference client instance to reduce object creation
export function getPreferenceClient(): Preference {
  if (!cachedPreference) {
    cachedPreference = new Preference(getConfig());
  }

  return cachedPreference;
}

// Reuse a Payment client to query notifications efficiently
export function getPaymentClient(): Payment {
  if (!cachedPayment) {
    cachedPayment = new Payment(getConfig());
  }

  return cachedPayment;
}