import { useState, useMemo } from 'react';
import type { CartItem } from '../types/cart';

interface CheckoutButtonProps {
  cartItems: CartItem[];
  orderId: string;
  email?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
}

type PreferenceItemPayload = {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  currency_id: string;
  description?: string;
  picture_url?: string;
};

// Normalize trailing slash so we do not produce URLs like ...//api
function normaliseApiUrl(rawUrl: string | undefined): string | null {
  if (!rawUrl) return null;
  return rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
}

// Convert the cart data into the structure Mercado Pago expects
function mapCartItems(cartItems: CartItem[]): PreferenceItemPayload[] {
  return cartItems.map((item, index) => ({
    id: item.id ?? `item-${index + 1}`,
    title: item.name,
    quantity: item.quantity,
    unit_price: Number(item.price),
    currency_id: 'ARS',
    description: item.size ? `${item.name} - Talle ${item.size}` : item.name,
    picture_url: item.img,
  }));
}

// Button that requests a Checkout Pro preference and redirects the shopper
export default function CheckoutButton({ cartItems, orderId, email, disabled, className, label }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const apiBaseUrl = useMemo(() => normaliseApiUrl(import.meta.env.VITE_API_URL), []);

  const handleCheckout = async () => {
    if (!apiBaseUrl) {
      console.error('VITE_API_URL is not configured.');
      alert('No se pudo iniciar el pago: falta configuracion del backend.');
      return;
    }

    if (!cartItems.length) {
      alert('Tu carrito esta vacio.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/api/payments/create-preference`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: mapCartItems(cartItems),
          orderId,
          payer: email ? { email } : undefined,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message = (errorBody as { message?: string }).message ?? 'No se pudo crear la preferencia de pago';
        throw new Error(message);
      }

      const data = await response.json() as {
        init_point?: string;
        sandbox_init_point?: string;
      };

      // Prefer production URL but fallback to sandbox for test accounts
      const redirectUrl = data.init_point ?? data.sandbox_init_point;
      if (!redirectUrl) {
        throw new Error('El backend no devolvio una URL de pago valida.');
      }

      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Mercado Pago checkout error', error);
      const message = error instanceof Error ? error.message : 'Hubo un problema iniciando el pago';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={loading || disabled || !cartItems.length}
      className={className ?? 'btn btn-primary'}
    >
      {loading ? 'Redirigiendo...' : (label ?? 'Pagar con Mercado Pago')}
    </button>
  );
}