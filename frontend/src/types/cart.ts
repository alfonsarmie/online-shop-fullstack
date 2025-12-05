export interface CartItem {
  idProduct: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  sizeId?: number; // ID del talle en la base de datos
  img: string;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productName: string, productSize?: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  cartCount: number;
}