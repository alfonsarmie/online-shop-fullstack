// Interface for product objects
export interface Product {
  id: number; // Mantenemos number aquí para los productos base
  name: string;
  price: number;
  img: string;
  category?: string;
  description?: string;
}

// Interface for product with size (for cart)
export interface ProductWithSize extends Omit<Product, 'id'> {
  id: string; // Sobrescribimos id como string para el carrito
  size: string;
  quantity: number;
}