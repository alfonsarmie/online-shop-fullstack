// Interface for product objects
export interface Product {
  id: number;
  name: string;
  price: number;
  img: string;
  img2: string;
  img3?: string;
  description: string;
  sizes: string[];
  stock: number;
  category?: string;
}

// Interface for product with size (for cart)
export interface ProductWithSize {
  id: string;
  name: string;
  price: number;
  img: string;
  size: string;
  quantity: number;
  img2?: string; // ← Hacer opcional
  description?: string; // ← Hacer opcional  
  sizes?: string[]; // ← Hacer opcional
  stock?: number; // ← Hacer opcional
  category?: string; // ← Hacer opcional
}