import React, { useState, useEffect } from 'react';
import '../styles/styles.css';
import '../styles/checkout.css';
import { useCart } from '../components/CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/products');
    }
  }, [cartItems, navigate]);

  // Calcula subtotal y total
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal;

  // Estados para el formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos enviados:', formData);
    // Lógica para procesar el pago
  };

  // Función para formatear precios
  const formatPrice = (price) => {
    return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <main>
      <div className="data-container">
        <div className="progress-container">
          <div className="step active">Your details</div>
          <div className="progress-line"></div>
          <div className="step">Payment</div>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <h3>Tus detalles</h3>
            <div className="form__group field">
              <input 
                type="text" 
                className="form__field nameInput" 
                placeholder="Nombre completo" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="name" className="form__label">Nombre completo</label>
            </div>

            <div className="email-phone-container">
              <div className="form__group field">
                <input 
                  type="email" 
                  className="form__field emailInput" 
                  placeholder="Correo electrónico" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="email" className="form__label">Correo electrónico</label>
              </div>
              <div className="form__group field">
                <input 
                  type="text" 
                  className="form__field phoneInput" 
                  placeholder="Teléfono" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="phone" className="form__label">Teléfono</label>
              </div>
            </div>

            <button type="submit">CONTINUAR</button>
          </form>
        </div>
      </div>

      <div className="cart-container">
        <div className="cart-header">
          <h2>Tu carrito | <span id="itemCount">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span> Artículos</h2>
        </div>
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p>No hay artículos en el carrito</p>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.name}-${item.size || ''}`} className="cart-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    width="60" 
                    style={{ borderRadius: '8px' }} 
                  />
                  <div>
                    <h3 style={{ margin: 0 }}>{item.name}</h3>
                    {item.size && <p style={{ margin: '2px 0' }}>Talle: {item.size}</p>}
                    <p style={{ margin: '2px 0' }}>
                      ${item.price.toLocaleString('es-AR')} × {item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <p className="cart-footer-item">Subtotal: $<span id="subtotal">{formatPrice(subtotal)}</span></p>
          <p className="cart-footer-item">Total: $<span id="total">{formatPrice(total)}</span></p>
        </div>
      </div>
    </main>
  );
};

export default Checkout;