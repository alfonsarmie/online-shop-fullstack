import { useEffect, useMemo, useState } from 'react';
import { useCart } from '../components/CartContext';
import { useNavigate } from 'react-router-dom';
import '../styles/payment.css';
import mpLogo from '/src/assets/img/mercado-pago-logo.png';
import type { CartItem } from '../types/cart';
import type { User } from '../types/user';
import ProgressBar from '../components/ProgressBar';
import { checkoutService, CheckoutFormData } from '../services/checkoutService';
import ErrorMessage from '../components/ErrorMessage';
import formatCurrency from '../utils/formatCurrency';

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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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
    
    if (!checkoutData) {
      navigate('/checkout');
      return;
    }
  }, [cartItems, checkoutData, navigate]);

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );

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
      const preference = await checkoutService.createPaymentPreference(
        checkoutData, // datos del usuario (nombre, mail, deportes, etc)
        cartItems, // items del carrito
        storedUser // datos del usuario logueado (idUser, email, name)
      );

      console.log('✅ [PAYMENT] Preference created:', preference);

      const redirectUrl = preference.init_point || preference.sandbox_init_point;
      if (redirectUrl) {
        console.log('🔗 [PAYMENT] Redirecting to:', redirectUrl);
        clearCart();
        localStorage.removeItem('checkoutData');
        window.location.href = redirectUrl;
      } else {
        throw new Error("No se pudo obtener la URL de pago");
      }
    } catch (error) {
      console.error("❌ [PAYMENT] Error creating payment preference:", error);
      
      let errorMessage = "Error al procesar el pago. Inténtalo nuevamente.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error("❌ [PAYMENT] Error message:", error.message);
      }
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error("❌ [PAYMENT] Status:", axiosError.response?.status);
        console.error("❌ [PAYMENT] Response data:", axiosError.response?.data);
        
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
          if (errorMessage === "Token expired") {
            errorMessage = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login?expired=true';
            return;
          }
        } else if (axiosError.response?.status) {
          errorMessage = `Error del servidor (${axiosError.response.status}). Revisa los logs del backend.`;
        }
      }
      
      setErrorMessage(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const openConfirmModal = () => {
    if (!isProcessing) {
      setIsConfirmOpen(true);
    }
  };

  const closeConfirmModal = () => {
    if (!isProcessing) {
      setIsConfirmOpen(false);
    }
  };

  const confirmPayment = () => {
    if (isProcessing) return;
    setIsConfirmOpen(false);
    void handlePayment();
  };

  if (!checkoutData) {
    return null; 
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
                <div key={`${item.idProduct}-${item.size ?? 'default'}`} className="order-item">
                  <img src={item.img} alt={item.name} />
                  <div>
                    <h4>{item.name}</h4>
                    {item.size && <p>Talle: {item.size}</p>}
                    <p>
                      ${formatCurrency(item.price)} x {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <h3>
                Total: ${formatCurrency(total, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
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
              <img src={mpLogo} alt="Mercado Pago" />
              <span>
                <strong>Mercado Pago </strong>
              </span>
            </label>
          </div>

          {errorMessage && (
            <ErrorMessage message={errorMessage} />
          )}

          <button
            onClick={openConfirmModal}
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

      {isConfirmOpen && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="payment-confirm-title"
          onClick={closeConfirmModal}
        >
          <div
            className="modal-content confirm-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="confirm-header">
              <h2 id="payment-confirm-title">Confirmación de compra</h2>
            </div>
            <div className="modal-body">
              <p className="confirm-message">Estas seguro de realizar la compra?</p>
            </div>
            <div className="confirm-actions">
              <button
                type="button"
                className="neutral-button"
                onClick={closeConfirmModal}
                disabled={isProcessing}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="confirm-button confirm-button-payment"
                onClick={confirmPayment}
                disabled={isProcessing}
              >
                Ir a Mercado Pago
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Payment;
