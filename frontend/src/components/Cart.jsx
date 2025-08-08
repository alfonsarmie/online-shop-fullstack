import { Link } from 'react-router-dom';
import '../styles/cart.css';
import { useCart } from './CartContext';

function Cart() {
  // Obtenemos todo del contexto, no necesitamos props
  const { 
    isCartOpen, 
    closeCart, 
    cartItems, 
    removeFromCart 
  } = useCart();

  // Calculamos los totales
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal;

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
            cartItems.map((item) => (
              <div key={item.name} className="cart-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={item.img} alt={item.name} width="60" style={{ borderRadius: '8px' }} />
                  <div>
                    <h3 style={{ margin: 0 }}>{item.name}</h3>
                    <p style={{ margin: '5px 0' }}>${item.price} ARS × {item.quantity}</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item.name)} 
                className='remove-btn'>
                  ✖
                </button>
              </div>
            ))
          )}
        </div>
        
        <div className="cart-footer">
          <div className="cart-footer-item">
            <p>Subtotal: $<span>{subtotal}</span></p>
          </div>
          <div className="cart-footer-item">
            <p>Total: $<span>{total}</span></p>
          </div>
          {cartItems.length > 0 && (
            <div className="btnCompletarPedido">
              <Link to="/pay"><button>COMPLETAR PEDIDO</button></Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Cart;