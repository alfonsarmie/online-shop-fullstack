import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCheckoutQuery } from '../utils/useCheckoutQuery';
import '../styles/checkout-status.css';
import { orderService, mapOrderToFrontend } from '../services/orderService';
import { FrontendOrder } from '../types/order';

export default function CheckoutPending() {
  const info = useCheckoutQuery();
  const [order, setOrder] = useState<FrontendOrder | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const savedUser = localStorage.getItem("user");
      if (!savedUser) return;
      
      try {
        const user = JSON.parse(savedUser);
        const targetId = info.external_reference ?? info.payment_id ?? info.collection_id;
        
        if (!targetId) return;

        const backendOrders = await orderService.getUserOrders(user.idUser);
        const foundOrder = backendOrders.find(o => 
          o.external_reference === targetId || 
          String(o.idOrder) === String(targetId)
        );
        
        if (foundOrder) {
          setOrder(mapOrderToFrontend(foundOrder));
        }
      } catch (err) {
        console.error("Error fetching order details", err);
      }
    };
    
    fetchOrder();
  }, [info.external_reference, info.payment_id, info.collection_id]);

  const displayOrderNumber = useMemo(() => {
    if (order) return order.orderNumber;

    const rawId = info.external_reference ?? info.payment_id ?? info.collection_id ?? '';
    if (!rawId) return '';

    const num = parseInt(rawId, 10);
    if (!isNaN(num)) {
      return `ORD-${String(num).padStart(4, '0')}`;
    }
    return rawId;
  }, [order, info.collection_id, info.external_reference, info.payment_id]);

  return (
    <div className="page-with-nav-spacing">
      <section className="checkout-status-page is-pending">
      <div className="checkout-ticket">
        <div className="ticket-status">
          <span className="ticket-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8Zm.5-13h-1v6l5 3 .5-.87-4.5-2.63Z" />
            </svg>
          </span>
          <span className="ticket-status-text">Pago en revision</span>
        </div>

        <h1 className="ticket-title">Estamos revisando tu pago</h1>
        <p className="ticket-subtitle">Esto puede demorar unos minutos.</p>

        {displayOrderNumber && (
          <div className="ticket-order">
            <span className="ticket-order-label">Numero de orden</span>
            <span className="ticket-order-value">#{displayOrderNumber}</span>
          </div>
        )}

        <div className="ticket-perforation" aria-hidden="true" />

        <div className="ticket-bottom">
          <p className="ticket-note">Te enviaremos una notificacion apenas se acredite.</p>
          <p className="ticket-secondary">Mientras tanto podes revisar tus ordenes o seguir explorando productos.</p>
          <div className="ticket-actions">
            <Link to="/my-orders" className="ticket-button">Ver mis ordenes</Link>
            <Link to="/" className="ticket-button secondary">Seguir comprando</Link>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
