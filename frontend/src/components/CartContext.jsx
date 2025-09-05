import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(); // Create context

function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]); // State to hold cart items
  const [isCartOpen, setIsCartOpen] = useState(false); // State to manage cart visibility

  // Add item to cart or increase quantity if it already exists
  const addToCart = useCallback((product) => {

    // Check if product with same name and size exists
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => 
        item.name === product.name && item.size === product.size
      );
      
      // If exists, increase quantity, else add new item with quantity 1
      if (existingItem) {
        return prevItems.map(item =>
          item.name === product.name && item.size === product.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });

    // Open cart when item is added
    setIsCartOpen(true);
  }, []);

  // Remove item from cart based on name and size
  const removeFromCart = useCallback((productName, productSize) => {
    setCartItems(prevItems => 
      prevItems.filter(item => 
        !(item.name === productName && item.size === productSize)
      )
    );
  }, []);

  return (
    // Provide cart context values and functions to children components
    <CartContext.Provider value={{
      cartItems, // current items in cart
      addToCart, // function to add items
      removeFromCart, // function to remove items
      isCartOpen, // cart visibility state
      openCart: () => setIsCartOpen(true), // function to open cart
      closeCart: () => setIsCartOpen(false), // function to close cart
      cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0) // total item count
    }}>
      {children} {/* Render child components */}
    </CartContext.Provider>
  );
}

// Custom hook to use cart context
// MOVER A OTRO ARCHIVO PARA QUE NO SALGA EL ERROR
export function useCart() {
  const context = useContext(CartContext);

  // Ensure hook is used within CartProvider
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
}

export default CartProvider;