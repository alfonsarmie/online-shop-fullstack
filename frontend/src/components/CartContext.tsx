import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CartItem, CartContextType } from '../types/cart'; 

const CartContext = createContext<CartContextType | undefined>(undefined); 

interface CartProviderProps {
  children: ReactNode;
}

function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]); 
  const [isCartOpen, setIsCartOpen] = useState(false); 

  const addToCart = useCallback((product: CartItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => 
        item.name === product.name && item.size === product.size
      );
      
      if (existingItem) {
        return prevItems.map(item =>
          item.name === product.name && item.size === product.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    // No hace falta forzar setIsCartOpen(true) acá si ya estamos en el carrito, pero no molesta.
    setIsCartOpen(true);
  }, []);

  // Función nueva para restar cantidad
  const decreaseQuantity = useCallback((productName: string, productSize?: string) => {
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.name === productName && item.size === productSize) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      }).filter(item => item.quantity > 0) // Si queda en 0, lo vuela
    );
  }, []);

  const removeFromCart = useCallback((productName: string, productSize?: string) => {
    setCartItems(prevItems => 
      prevItems.filter(item => 
        !(item.name === productName && item.size === productSize)
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  return (
    <CartContext.Provider value={{
      cartItems, 
      addToCart, 
      decreaseQuantity, // <--- No te olvides de exportarla acá
      removeFromCart, 
      clearCart, 
      isCartOpen, 
      openCart: () => setIsCartOpen(true), 
      closeCart: () => setIsCartOpen(false), 
      cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0) 
    }}>
      {children} 
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
}

export default CartProvider;