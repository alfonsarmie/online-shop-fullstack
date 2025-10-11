export interface FrontendProduct {
  id: string;
  name: string;
  price: number;
  img: string;
  img2: string;
  description: string;
  sizes: string[];
  stock: number;
  category?: string;
}

export interface Product {
  idProduct: number;
  name: string;
  description: string;
  stock: number;
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
  size: string;
  quantity: number;
  img2?: string;
  description?: string;
  sizes?: string[];
  stock?: number;
  category?: string;
}