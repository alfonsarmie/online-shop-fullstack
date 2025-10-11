import { useEffect, useMemo } from 'react';
import { useCart } from '../components/CartContext';
import { useCheckoutQuery } from '../utils/useCheckoutQuery';
import '../styles/checkout-status.css';

export default function CheckoutSuccess() {
  const info = useCheckoutQuery();
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart, info.external_reference]);

  const displayOrderNumber = useMemo(() => (
    info.external_reference ?? info.payment_id ?? info.collection_id ?? ''
  ), [info.collection_id, info.external_reference, info.payment_id]);

  return (
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
        <p className="ticket-subtitle">Estamos preparando tu pedido.</p>

        {displayOrderNumber && (
          <div className="ticket-order">
            <span className="ticket-order-label">Numero de orden</span>
            <span className="ticket-order-value">{displayOrderNumber}</span>
          </div>
        )}

        <div className="ticket-perforation" aria-hidden="true" />

        <div className="ticket-bottom">
          <p className="ticket-note">Te avisaremos cuando este listo para retirar.</p>
        </div>
      </div>
    </section>
  );
}
