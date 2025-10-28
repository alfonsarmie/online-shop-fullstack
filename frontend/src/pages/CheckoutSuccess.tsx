import { useEffect, useMemo, useState, useRef } from 'react';
import { useCart } from '../components/CartContext';
import { useCheckoutQuery } from '../utils/useCheckoutQuery';
import '../styles/checkout-status.css';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ErrorMessage from '../components/ErrorMessage';

export default function CheckoutSuccess() {
  const info = useCheckoutQuery();
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const { clearCart } = useCart();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const orderCreatedRef = useRef(false); // Para evitar duplicados
  const [expectedPickupDate, setExpectedPickupDate] = useState<string | null>(null);

  const getFormattedPickupDate = (rawDate: string | undefined | null) => {
    if (!rawDate) return null;
    const parsed = new Date(rawDate);
    if (Number.isNaN(parsed.getTime())) return rawDate;
    return parsed.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  useEffect(() => {
    const createOrder = async () => {
      if (!sessionId) {
        console.warn('No session_id found in URL');
        return;
      }

      if (orderCreatedRef.current || isCreatingOrder) {
        return;
      }

      orderCreatedRef.current = true;
      setIsCreatingOrder(true);
      setError(null);

      try {
        const response = await api.post('/orders/create-from-session', {
          session_id: sessionId,
        });
        
        setOrderNumber(String(response.data.order?.idOrder || ''));
        setExpectedPickupDate(getFormattedPickupDate(response.data.order?.expectedPickupDate));
        clearCart(); // Limpiar carrito solo después de crear la orden
        
      } catch (err: any) {
        console.error('Error creando orden:', err);
        
        if (err.response?.data?.msg?.includes('ya fue creada')) {
          const fallbackOrder = err.response?.data?.order;
          setOrderNumber(String(fallbackOrder?.idOrder || sessionId));
          setExpectedPickupDate(getFormattedPickupDate(fallbackOrder?.expectedPickupDate));
          clearCart();
        } else {
          setError(err.response?.data?.msg || 'Error al procesar la orden');
        }
      } finally {
        setIsCreatingOrder(false);
      }
    };

    createOrder();
  }, [sessionId]); 

  const displayOrderNumber = useMemo(() => {
    return (
      orderNumber ??
      info.external_reference ??
      sessionId ??
      info.payment_id ??
      info.collection_id ??
      ''
    );
  }, [orderNumber, sessionId, info.collection_id, info.external_reference, info.payment_id]);

  return (
    <div className="page-with-nav-spacing">
      <section className="checkout-status-page is-success">
      <div className="checkout-ticket">
        <div className="ticket-status">
          <span className="ticket-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M9.00065 16.2 4.80065 12 3.40065 13.4 9.00065 19 21.0006 7 19.6006 5.6 9.00065 16.2Z" />
            </svg>
          </span>
          <span className="ticket-status-text">Pago aprobado</span>
        </div>

        <h1 className="ticket-title">Gracias por tu compra</h1>
        <p className="ticket-subtitle">
          {isCreatingOrder ? 'Procesando tu orden...' : 'Estamos preparando tu pedido.'}
        </p>

        {error && (
          <ErrorMessage message={error} />
        )}

        {displayOrderNumber && !isCreatingOrder && (
          <div className="ticket-order">
            <span className="ticket-order-label">Numero de orden</span>
            <span className="ticket-order-value">#{displayOrderNumber}</span>
          </div>
        )}

        <div className="ticket-perforation" aria-hidden="true" />

        <div className="ticket-bottom">
          <p className="ticket-note">
            {isCreatingOrder
              ? 'Espera un momento mientras confirmamos tu orden...'
              : expectedPickupDate
                ? `Te esperamos a partir del ${expectedPickupDate} para retirar tu pedido.`
                : 'Te avisaremos cuando este listo para retirar.'}
          </p>
        </div>
      </div>
    </section>
    </div>
  );
}
