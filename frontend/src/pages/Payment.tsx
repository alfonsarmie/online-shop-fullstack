import { useEffect, useMemo, useState } from 'react';
import { useCart } from '../components/CartContext';
import { useNavigate } from 'react-router-dom';
import '../styles/payment.css';
import stripeLogo from '../assets/img/stripe-logo.png';
import type { CartItem } from '../types/cart';
import type { User } from '../types/user';
import ProgressBar from '../components/ProgressBar';
import { checkoutService, CheckoutFormData } from '../services/checkoutService';
import ErrorMessage from '../components/ErrorMessage';

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
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Get checkout data and user info
  const checkoutData = useMemo(() => {
    const saved = localStorage.getItem('checkoutData');
    if (!saved) return null;
    try {
      return JSON.parse(saved) as CheckoutFormData;
    } catch (error) {
      console.warn('Failed to parse checkout data', error);
      return null;
    }
  }, []);

  const storedUser = useMemo(() => getStoredUser(), []);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/');
      return;
    }
    
    // If no checkout data, redirect back to checkout
    if (!checkoutData) {
      navigate('/checkout');
      return;
    }
  }, [cartItems, checkoutData, navigate]);

  // Calculate totals only when the cart changes
  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );

  // Handle payment processing
  const handlePayment = async () => {
    if (!checkoutData || !storedUser) {
      setErrorMessage("Datos de checkout no encontrados");
      navigate('/checkout');
      return;
    }

    console.log('🎯 [PAYMENT] Iniciando proceso de pago...');
    console.log('📝 [PAYMENT] Checkout data:', checkoutData);
    console.log('👤 [PAYMENT] User data:', storedUser);
    console.log('🛒 [PAYMENT] Cart items:', cartItems);

    setIsProcessing(true);
    setErrorMessage("");

    try {
      // Create payment preference
      const preference = await checkoutService.createPaymentPreference(
        checkoutData,
        cartItems,
        storedUser
      );

      console.log('✅ [PAYMENT] Preference created:', preference);

      // Redirect to Mercado Pago
      const redirectUrl = preference.init_point || preference.sandbox_init_point;
      if (redirectUrl) {
        console.log('🔗 [PAYMENT] Redirecting to:', redirectUrl);
        // Clear cart and checkout data since we're proceeding to payment
        clearCart();
        localStorage.removeItem('checkoutData');
        window.location.href = redirectUrl;
      } else {
        throw new Error("No se pudo obtener la URL de pago");
      }
    } catch (error) {
      console.error("❌ [PAYMENT] Error creating payment preference:", error);
      
      // Obtener más detalles del error
      let errorMessage = "Error al procesar el pago. Inténtalo nuevamente.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error("❌ [PAYMENT] Error message:", error.message);
      }
      
      // Si es un error de axios, obtener más detalles
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error("❌ [PAYMENT] Status:", axiosError.response?.status);
        console.error("❌ [PAYMENT] Response data:", axiosError.response?.data);
        
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.response?.status) {
          errorMessage = `Error del servidor (${axiosError.response.status}). Revisa los logs del backend.`;
        }
      }
      
      setErrorMessage(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!checkoutData) {
    return null; // Will redirect in useEffect
  }

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
          <h2>Métodos de pago</h2>

          <div className="payment-option">
            <input
              type="radio"
              id="stripe"
              name="payment"
              defaultChecked
            />
            <label htmlFor="stripe">
              <img src={stripeLogo} alt="Stripe" />
              <span>
                <strong>Stripe</strong>
              </span>
            </label>
          </div>

          {errorMessage && (
            <ErrorMessage message={errorMessage} />
          )}

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`pay-button ${isProcessing ? 'disabled' : ''}`}
          >
            {isProcessing ? (
              <span>Procesando...</span>
            ) : (
              "CONFIRMAR Y PAGAR"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Payment;
