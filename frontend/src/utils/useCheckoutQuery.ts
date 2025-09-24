import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface CheckoutQueryParams {
  collection_id: string | null;
  collection_status: string | null;
  payment_id: string | null;
  status: string | null;
  external_reference: string | null;
  merchant_order_id: string | null;
  preference_id: string | null;
}

// Lightweight helper that exposes the Mercado Pago redirect parameters as a typed object
export function useCheckoutQuery(): CheckoutQueryParams {
  const [params] = useSearchParams();

  return useMemo(() => ({
    collection_id: params.get('collection_id'),
    collection_status: params.get('collection_status'),
    payment_id: params.get('payment_id'),
    status: params.get('status'),
    external_reference: params.get('external_reference'),
    merchant_order_id: params.get('merchant_order_id'),
    preference_id: params.get('preference_id'),
  }), [params]);
}