export interface CartItem {
  idProduct: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  sizeId?: number; 
  img: string;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: CartItem) => void;
  decreaseQuantity: (productName: string, productSize?: string) => void; 
  removeFromCart: (productName: string, productSize?: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  cartCount: number;
}