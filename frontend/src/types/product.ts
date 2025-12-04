export interface FrontendProduct {
  id: string;
  name: string;
  price: number;
  img: string;
  img2: string;
  description: string;
  sizes: Size[]; // Cada Size puede incluir stock
  stock?: number; // opcional: puede representar stock total agregado
  category?: string;
}

export interface Product {
  idProduct: number;
  name: string;
  description: string;
  idCategory: number;
  prices: Price[];
  images: Image[];
  category?: Category;
  sizes?: Size[];
}

export type FilterType = '' | 'price_asc' | 'price_desc' | 'name_asc';

export interface Category {
  idCategory: number;
  name: string;
  description: string;
}

export interface Size {
  idSize: number;
  name: string;
  sizeDesc: string;
  stock?: number; // stock por talle
}

export interface Price {
  idPrice: number;
  idProduct: number;
  value: number;
  updateDate: Date;
}

export interface Image {
  idImage: number;
  idProduct: number;
  url: string;
  description: string;
}

export interface ProductWithSize {
  id: string;
  name: string;
  price: number;
  img: string;
  size: string; // Nombre del talle para mostrar
  sizeId?: number; // ID del talle para enviar al backend
  quantity: number;
  img2?: string;
  description?: string;
  sizes?: Size[]; // Cambiado de string[] a Size[]
  stock?: number; // stock del talle seleccionado (si se desea)
  category?: string;
}

export interface CriticalProductInfo {
  name: string;
  stock: number;
}