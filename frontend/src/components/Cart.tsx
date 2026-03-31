import { useNavigate } from 'react-router-dom';
import '../styles/cart.css';
import { useCart } from './CartContext'; 
import { CartItem } from '../types/cart'; 
import { useState } from 'react';
import LoginRequiredModal from './LoginRequiredModal';
import formatCurrency from '../utils/formatCurrency';

function Cart() {

  const { 
    isCartOpen, 
    closeCart, 
    cartItems, 
    removeFromCart,
    addToCart,        // <--- Traemos esto
    decreaseQuantity  // <--- Y esto
  } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal; 

  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleCheckout = () => {
    let loggedIn = false;
    try {
      loggedIn = !!localStorage.getItem('user');
    } catch {
      loggedIn = false;
    }
    if (!loggedIn) {
      closeCart();
      setShowLoginModal(true);
      return;
    }
    closeCart();
    navigate('/checkout');
  };

  return (
    <>
      <div className={`cart-overlay ${isCartOpen ? 'active' : ''}`} onClick={closeCart}></div>

      <div className={`cart ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2 className='cart-title'>Tu carrito | <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span> Artículos</h2>
          <button onClick={closeCart}>✖</button>
        </div>
        
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p>Tu carrito está vacío</p>
          ) : (
            cartItems.map((item: CartItem) => (
              <div key={`${item.name}-${item.size}`} className="cart-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={item.img} alt={item.name} width="60" style={{ borderRadius: '8px' }} />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px' }}>{item.name}</h3>
                    {item.size && (
                      <p style={{ 
                        margin: '5px 0', 
                        fontSize: '14px', 
                        fontWeight: 'bold',
                        color: '#4CAF50' 
                      }}>
                        Talle: {item.size}
                      </p>
                    )}
                    
                    {/* Controles de cantidad */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0' }}>
                      <button 
                        onClick={() => decreaseQuantity(item.name, item.size)}
                        className="cart-quantity-btn"
                      >
                        -
                      </button>
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.quantity}</span>
                      <button 
                        onClick={() => addToCart(item)}
                        className="cart-quantity-btn"
                      >
                        +
                      </button>
                    </div>

                    <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                      ${formatCurrency(item.price * item.quantity)} ARS
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => removeFromCart(item.name, item.size)} 
                  className='remove-btn-cart'>                
                  ✖
                </button>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-footer-item">
            <p>Subtotal: $<span>{formatCurrency(subtotal)}</span></p>
          </div>
          <div className="cart-footer-item">
            <p>Total: $<span>{formatCurrency(total)}</span></p>
          </div>

          {cartItems.length > 0 && (
            <div className="btnCompletarPedido">
              <button onClick={handleCheckout}>COMPLETAR PEDIDO</button>
            </div>
          )}
        </div>
      </div>
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginClick={() => {
          setShowLoginModal(false);
          closeCart();
          navigate('/login');
        }}
      />
    </>
  );
}

export default Cart;