import { useEffect } from 'react';
import { useCart } from '../components/CartContext';
import { useCheckoutQuery } from '../utils/useCheckoutQuery';

export default function CheckoutSuccess() {
  const info = useCheckoutQuery();
  const { clearCart } = useCart();

  useEffect(() => {
    // Once the payment is approved we discard the local cart
    clearCart();
    // Optionally confirm payment status with backend using info.external_reference
  }, [clearCart, info.external_reference]);

  return (
    <section className="checkout-result">
      <h1>Pago aprobado!</h1>
      <p>Gracias por tu compra.</p>
      {info.payment_id && (
        <p><strong>No. de pago:</strong> {info.payment_id}</p>
      )}
      {info.external_reference && (
        <p><strong>Referencia:</strong> {info.external_reference}</p>
      )}
      <p>Te enviaremos un correo con los detalles de tu orden.</p>
    </section>
  );
}