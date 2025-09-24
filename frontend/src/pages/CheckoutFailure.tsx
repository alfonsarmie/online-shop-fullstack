import { Link } from 'react-router-dom';
import { useCheckoutQuery } from '../utils/useCheckoutQuery';

export default function CheckoutFailure() {
  const info = useCheckoutQuery();

  return (
    <section className="checkout-result">
      <h1>El pago no pudo completarse</h1>
      <p>Tu transaccion fue rechazada o cancelada.</p>
      {info.status && (
        <p><strong>Estado reportado:</strong> {info.status}</p>
      )}
      {info.external_reference && (
        <p><strong>Referencia:</strong> {info.external_reference}</p>
      )}
      {/* Offer a quick route back to the payment step for retries */}
      <p>Podes volver a intentarlo o elegir otro metodo de pago.</p>
      <Link to="/payment" className="btn btn-primary">Intentar nuevamente</Link>
    </section>
  );
}