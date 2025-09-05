export interface CartItem {
  id: string; // Cambiado a string para consistencia
  name: string;
  price: number;
  quantity: number;
  size?: string;
  img: string;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productName: string, productSize?: string) => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  cartCount: number;
}