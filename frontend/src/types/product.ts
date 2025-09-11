export interface Product {
  id: string; // Cambiado de number a string
  name: string;
  price: number;
  img: string;
  img2: string;
  img3?: string;
  description: string;
  sizes: string[];
  stock: number;
  category?: string;
  color?: string;
}

export interface ProductWithSize {
  id: string;
  name: string;
  price: number;
  img: string;
  size: string;
  quantity: number;
  img2?: string;
  description?: string;
  sizes?: string[];
  stock?: number;
  category?: string;
}