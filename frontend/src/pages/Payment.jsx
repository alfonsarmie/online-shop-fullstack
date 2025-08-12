import React from 'react';
import { useCart } from '../components/CartContext';
import { useNavigate } from 'react-router-dom';
import '../styles/payment.css'; // Crearemos este archivo después
import mpLogo from '../assets/img/mercado-pago-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faMoneyBillTransfer } from '@fortawesome/free-solid-svg-icons';   

const Payment = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  // Calcula el total
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePaymentSuccess = () => {
    // Lógica cuando el pago es exitoso
    clearCart();
    navigate('/payment-success'); // Puedes crear esta página después
  };

  return (
    <div className="payment-container">
      <div className="payment-summary">
        <h2>Resumen de tu compra</h2>
        <div className="order-items">
          {cartItems.map((item) => (
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

      <div className="payment-methods">
        <h2>Métodos de pago</h2>
        
        <div className="payment-option">
          <input type="radio" id="mercado-pago" name="payment" defaultChecked />
          <label htmlFor="mercado-pago">
            <img src={mpLogo} alt="Mercado Pago" />
            <span>Mercado Pago</span>
          </label>
        </div>

        <div className="payment-option">
          <input type="radio" id="credit-card" name="payment" />
          <label htmlFor="credit-card">
            <FontAwesomeIcon icon={faCreditCard} className='payment-icon'/>
            <span>Tarjeta de crédito</span>
          </label>
        </div>

        <div className="payment-option">
          <input type="radio" id="bank-transfer" name="payment" />
          <label htmlFor="bank-transfer">
            <FontAwesomeIcon icon={faMoneyBillTransfer} className='payment-icon'/>
            <span>Transferencia bancaria</span>
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