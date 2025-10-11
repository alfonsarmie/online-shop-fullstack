import { useNavigate } from 'react-router-dom';
import '../styles/cart.css';
import { useCart } from './CartContext'; // custom hook to use cart context
import { CartItem } from '../types/cart'; // Import CartItem type
import { useState } from 'react';
import LoginRequiredModal from './LoginRequiredModal';

function Cart() {

  // Destructure cart context values
  const { 
    isCartOpen, 
    closeCart, 
    cartItems, 
    removeFromCart 
  } = useCart();

  // Calculate subtotal and total
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal; // Add tax or shipping if needed

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
      // Close the cart panel before showing modal so it doesn't cover it
      closeCart();
      setShowLoginModal(true);
      return;
    }
    closeCart();
    navigate('/checkout');
  };

  return (
    <>
    {/* Overlay to close cart when clicking outside */}
      <div className={`cart-overlay ${isCartOpen ? 'active' : ''}`} onClick={closeCart}></div>

      {/* Cart panel */}
      <div className={`cart ${isCartOpen ? 'open' : ''}`}> {/* Add 'open' class if cart is open */} 
        <div className="cart-header">
          <h2 className='cart-title'>Tu carrito | <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span> Artículos</h2>
          <button onClick={closeCart}>✖</button>
        </div>
        
        <div className="cart-items">
          {/* if cart is empty, show message, else show items */}
          {cartItems.length === 0 ? (
            <p>Tu carrito está vacío</p>
          ) : (
            cartItems.map((item: CartItem) => (
              <div key={`${item.name}-${item.size}`} className="cart-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={item.img} alt={item.name} width="60" style={{ borderRadius: '8px' }} />
                  <div>
                    <h3 style={{ margin: 0 }}>{item.name}</h3>
                    <p style={{ margin: '5px 0' }}>${item.price} ARS × {item.quantity}</p>
                    {item.size && <p style={{ margin: 0 }}>Talle: {item.size}</p>}
                  </div>
                </div>

                {/* Remove item button */}
                <button 
                  onClick={() => removeFromCart(item.name, item.size)} 
                  className='remove-btn-cart'>                
                  ✖
                </button>
              </div>
            ))
          )}
        </div>

        {/* Shows cart totals */}
        <div className="cart-footer">
          <div className="cart-footer-item">
            <p>Subtotal: $<span>{subtotal}</span></p>
          </div>
          <div className="cart-footer-item">
            <p>Total: $<span>{total}</span></p>
          </div>

          {/* Checkout button, only if there are items in the cart */}
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
