import { useEffect, useMemo, useRef, useState } from 'react';
import { useCart } from '../components/CartContext';
import { useCheckoutQuery } from '../utils/useCheckoutQuery';
import '../styles/checkout-status.css';
import { useSearchParams } from 'react-router-dom';
import { orderService, mapOrderToFrontend } from '../services/orderService';
import { FrontendOrder } from '../types/order';

export default function CheckoutSuccess() {
  const info = useCheckoutQuery();
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const { clearCart } = useCart();
  const cartClearedRef = useRef(false);
  const [order, setOrder] = useState<FrontendOrder | null>(null);

  useEffect(() => {
    if (info.status === 'approved' && !cartClearedRef.current) {
      clearCart();
      cartClearedRef.current = true;
    }
  }, [info.status, clearCart]);

  useEffect(() => {
    const fetchOrder = async () => {
      const savedUser = localStorage.getItem("user");
      if (!savedUser) return;
      
      try {
        const user = JSON.parse(savedUser);
        const targetId = info.external_reference ?? sessionId ?? info.payment_id ?? info.collection_id;
        
        if (!targetId) return;

        const backendOrders = await orderService.getUserOrders(user.idUser);
        const foundOrder = backendOrders.find(o => String(o.idOrder) === String(targetId));
        
        if (foundOrder) {
          setOrder(mapOrderToFrontend(foundOrder));
        }
      } catch (err) {
        console.error("Error fetching order details", err);
      }
    };
    
    fetchOrder();
  }, [info.external_reference, sessionId, info.payment_id, info.collection_id]);

  const displayOrderNumber = useMemo(() => {
    if (order) return order.orderNumber;

    const rawId = info.external_reference ?? sessionId ?? info.payment_id ?? info.collection_id ?? '';
    
    if (!rawId) return '';

    // Intentar formatear como ORD-XXXX si es un número
    const num = parseInt(rawId, 10);
    if (!isNaN(num)) {
      return `ORD-${String(num).padStart(4, '0')}`;
    }
    
    return rawId;
  }, [order, info.external_reference, sessionId, info.payment_id, info.collection_id]);

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
          Estamos preparando tu pedido.
        </p>

        {displayOrderNumber && (
          <div className="ticket-order">
            <span className="ticket-order-label">Numero de orden</span>
            <span className="ticket-order-value">#{displayOrderNumber}</span>
          </div>
        )}

        <div className="ticket-perforation" aria-hidden="true" />

        <div className="ticket-bottom">
          <p className="ticket-note">
            Te avisaremos cuando tu pedido esté listo para retirar.
          </p>
        </div>
      </div>
    </section>
    </div>
  );
}
