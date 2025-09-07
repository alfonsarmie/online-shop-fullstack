import React from 'react';
import { useCart } from '../components/CartContext';
import { useNavigate } from 'react-router-dom';
import '../styles/payment.css';
import mpLogo from '../assets/img/mercado-pago-logo.png';
import { CartItem } from '../types/cart';

const Payment = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  // Calculate total amount
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePaymentSuccess = () => {
    // Logic when payment is successful
    clearCart();
    navigate('/payment-success'); // Create this route/page
  };

  return (
    <div className="payment-container">
    
      <div className='form-left'>

        <div className="payment-summary">
        <h2>Resumen de tu compra</h2>

        <div className="order-items">

          {/* Map through cart items */}
          {cartItems.map((item: CartItem) => (
            <div key={`${item.id}-${item.size}`} className="order-item">
              <img src={item.img} alt={item.name} />
              <div>
                <h4>{item.name}</h4>
                {item.size && <p>Talle: {item.size}</p>}
                <p>${item.price.toLocaleString('es-AR')} x {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="order-total">
          <h3>Total: ${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</h3>
        </div>
        </div>
      </div>

      <div className="payment-methods">
        <h2>Métodos de pago</h2>
        
        <div className="payment-option">
          <input type="radio" id="mercado-pago" name="payment" defaultChecked />
          <label htmlFor="mercado-pago">
            <img src={mpLogo} alt="Mercado Pago" />
            <span>Mercado Pago</span>
          </label>
        </div>

        <button 
          className="pay-button"
          onClick={handlePaymentSuccess}
        >
          CONFIRMAR Y PAGAR
        </button>
      </div>
    </div>
  );
};

export default Payment;