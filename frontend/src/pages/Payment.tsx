import { useEffect, useMemo } from 'react';
import { useCart } from '../components/CartContext';
import { useNavigate } from 'react-router-dom';
import '../styles/payment.css';
import mpLogo from '../assets/img/mercado-pago-logo.png';
import type { CartItem } from '../types/cart';
import type { User } from '../types/user';
import ProgressBar from '../components/ProgressBar';
import CheckoutButton from '../components/CheckoutButton';

// Restore the logged user so we can prefill the payer email when sending the preference
function getStoredUser(): User | null {
  const saved = localStorage.getItem('user');
  if (!saved) return null;

  try {
    return JSON.parse(saved) as User;
  } catch (error) {
    console.warn('Failed to parse stored user information', error);
    return null;
  }
}

const Payment = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/');
    }
  }, [cartItems, navigate]);

  // Calculate totals only when the cart changes
  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );

  // Construct a lightweight order reference for external_reference
  const orderId = useMemo(
    () => `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    [],
  );

  const storedUser = useMemo(() => getStoredUser(), []);
  // Mercado Pago prefers to receive the payer email when possible
  const payerEmail = storedUser?.email;

  return (
    <>
      <ProgressBar currentStep="Pago" />
      <div className="payment-container page-with-nav-spacing">
        <div className="form-left">
          <div className="payment-summary">
            <h2>Resumen de tu compra</h2>

            <div className="order-items">
              {cartItems.map((item: CartItem) => (
                <div key={`${item.id}-${item.size ?? 'default'}`} className="order-item">
                  <img src={item.img} alt={item.name} />
                  <div>
                    <h4>{item.name}</h4>
                    {item.size && <p>Talle: {item.size}</p>}
                    <p>
                      ${item.price.toLocaleString('es-AR')} x {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <h3>
                Total: $
                {total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </div>
        </div>

        <div className="payment-methods">
          <h2>Metodos de pago</h2>

          <div className="payment-option">
            <input
              type="radio"
              id="mercado-pago"
              name="payment"
              defaultChecked
            />
            <label htmlFor="mercado-pago">
              <img src={mpLogo} alt="Mercado Pago" />
              <span>Mercado Pago</span>
            </label>
          </div>

          {/* Checkout Pro button performs the API call and handles redirect */}
          <CheckoutButton
            cartItems={cartItems}
            orderId={orderId}
            email={payerEmail ?? undefined}
            className="pay-button"
            label="CONFIRMAR Y PAGAR"
            user={storedUser}
          />
        </div>
      </div>
    </>
  );
};

export default Payment;
