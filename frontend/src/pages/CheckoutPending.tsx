import { Link } from 'react-router-dom';
import { useCheckoutQuery } from '../utils/useCheckoutQuery';

export default function CheckoutPending() {
  const info = useCheckoutQuery();

  return (
    <section className="checkout-result">
      <h1>Pago en revision</h1>
      <p>Estamos procesando tu pago. Te avisaremos cuando se acredite.</p>
      {info.external_reference && (
        <p><strong>Referencia:</strong> {info.external_reference}</p>
      )}
      {/* Encourage the shopper to keep browsing while MP finalises the payment */}
      <p>Podes seguir navegando por la tienda y revisar el estado mas tarde.</p>
      <Link to="/my-orders" className="btn btn-secondary">Ver mis ordenes</Link>
    </section>
  );
}