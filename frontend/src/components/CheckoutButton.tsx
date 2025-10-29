import axios from 'axios';
import { useState, useMemo } from 'react';
import type { CartItem } from '../types/cart';
import type { User } from '../types/user';

interface CheckoutButtonProps {
  cartItems: CartItem[];
  orderId: string;
  email?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  user?: User | null;
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

interface OrderDraftItemPayload {
  idProduct: number;
  quantity: number;
  size?: string;
  unitPrice: number;
  name: string;
}

interface OrderDraftPayload {
  idUser: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  items: OrderDraftItemPayload[];
}

function normaliseApiUrl(rawUrl: string | undefined): string | null {
  if (!rawUrl) return null;
  return rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
}

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

function parseProductId(rawId: string | undefined, index: number): number {
  const parsed = Number(rawId);
  if (!parsed || Number.isNaN(parsed)) {
    throw new Error(`Producto inválido en el carrito (posición ${index + 1}).`);
  }
  return parsed;
}

function mapOrderDraftItems(cartItems: CartItem[]): OrderDraftItemPayload[] {
  return cartItems.map((item, index) => ({
    idProduct: parseProductId(item.id, index),
    quantity: item.quantity,
    size: item.size,
    unitPrice: Number(item.price),
    name: item.name,
  }));
}

function buildOrderDraft(
  cartItems: CartItem[],
  user: User | null | undefined,
  email?: string,
): OrderDraftPayload {
  if (!user?.idUser) {
    throw new Error('Debes iniciar sesión para completar la compra.');
  }

  const effectiveEmail = email ?? user.email;
  if (!effectiveEmail) {
    throw new Error('No encontramos un correo para asociar al pedido.');
  }

  const displayName = `${user.name ?? ''} ${user.surname ?? ''}`.trim() || user.name || 'Cliente ecommerce';

  return {
    idUser: user.idUser,
    customer_name: displayName,
    customer_email: effectiveEmail,
    customer_phone: user.phone,
    items: mapOrderDraftItems(cartItems),
  };
}

export default function CheckoutButton({
  cartItems,
  orderId,
  email,
  disabled,
  className,
  label,
  user,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const apiBaseUrl = useMemo(() => normaliseApiUrl(import.meta.env.VITE_API_URL), []);
  const effectiveEmail = email ?? user?.email ?? undefined;

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

    let orderPayload: OrderDraftPayload;
    try {
      orderPayload = buildOrderDraft(cartItems, user, effectiveEmail);
    } catch (error) {
      console.error('No se pudo preparar el pedido', error);
      const message = error instanceof Error ? error.message : 'No se pudo preparar el pedido';
      alert(message);
      return;
    }

    try {
      setLoading(true);
      const preferenceItems = mapCartItems(cartItems);
      const payerData = effectiveEmail
        ? {
            email: effectiveEmail,
            name: user?.name,
            surname: user?.surname,
          }
        : undefined;

      const { data } = await axios.post<{
        init_point?: string;
        sandbox_init_point?: string;
        orderId?: number | null;
      }>(`${apiBaseUrl}/api/payments/create-preference`, {
        items: preferenceItems,
        orderId,
        payer: payerData,
        orderPayload,
      });

      const redirectUrl = data.init_point ?? data.sandbox_init_point;
      if (!redirectUrl) {
        throw new Error('El backend no devolvio una URL de pago valida.');
      }

      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Mercado Pago checkout error', error);
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message ?? error.message ?? 'No se pudo crear la preferencia de pago'
        : error instanceof Error
          ? error.message
          : 'Hubo un problema iniciando el pago';
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
