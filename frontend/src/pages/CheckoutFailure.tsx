import { useEffect, useMemo, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCheckoutQuery } from '../utils/useCheckoutQuery';
import api from '../services/api';
import '../styles/checkout-status.css';

export default function CheckoutFailure() {
  const info = useCheckoutQuery();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!info.external_reference || fetchedRef.current) return;

      fetchedRef.current = true;

      try {
        const response = await api.post('/orders/create-from-session', {
          session_id: info.external_reference,
        });
        
        setOrderNumber(String(response.data.order?.idOrder || ''));
        
      } catch (err: any) {
        console.error('Error fetching order:', err);
        
        if (err.response?.data?.msg?.includes('ya fue creada')) {
          const fallbackOrder = err.response?.data?.order;
          setOrderNumber(String(fallbackOrder?.idOrder || ''));
        }
      }
    };

    fetchOrder();
  }, [info.external_reference]);

  const displayOrderNumber = useMemo(() => {
    const val = orderNumber ?? info.external_reference ?? info.payment_id ?? info.collection_id ?? '';
    
    // Si tenemos un número de orden (ya sea del fetch o porque val es numérico y corto), lo formateamos
    if (orderNumber || (val && !isNaN(Number(val)) && val.length < 10)) {
        return `ORD-${val.toString().padStart(4, '0')}`;
    }
    return val;
  }, [orderNumber, info.collection_id, info.external_reference, info.payment_id]);

  return (
    <div className="page-with-nav-spacing">
      <section className="checkout-status-page is-failure">
      <div className="checkout-ticket">
        <div className="ticket-status">
          <span className="ticket-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8Zm2.59-12L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41Z" />
            </svg>
          </span>
          <span className="ticket-status-text">Pago rechazado</span>
        </div>

        <h1 className="ticket-title">No pudimos completar el pago</h1>
        <p className="ticket-subtitle">Revisemos los datos y probemos nuevamente.</p>

        {displayOrderNumber && (
          <div className="ticket-order">
            <span className="ticket-order-label">Numero de orden</span>
            <span className="ticket-order-value">{displayOrderNumber}</span>
          </div>
        )}

        <div className="ticket-perforation" aria-hidden="true" />

        <div className="ticket-bottom">
          <p className="ticket-note">El emisor rechazo la transaccion o no se pudo procesar.</p>
          <p className="ticket-secondary">Verifica la informacion de tu tarjeta o elige otro metodo de pago.</p>
          <div className="ticket-actions">
            <Link to="/payment" className="ticket-button">Intentar nuevamente</Link>
            <Link to="/cart" className="ticket-button secondary">Revisar mi carrito</Link>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
