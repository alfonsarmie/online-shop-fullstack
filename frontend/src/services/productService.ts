import api from './api';
import { Product } from '../types/product';

export const productService = {
  // Obtener todos los productos
  getAllProducts: async (): Promise<Product[]> => {
    try {
      console.log('Fetching products from:', '/products');
      const response = await api.get('/products');
      console.log('Products response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching products:', error.response?.data || error.message);
      console.error('Error details:', error.response?.status, error.response?.statusText);
      throw error;
    }
  },

  // Obtener un producto por ID
  getProductById: async (id: string): Promise<Product> => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo producto (para admin)
  createProduct: async (productData: FormData): Promise<Product> => {
    try {
      const response = await api.post('/products', productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Actualizar un producto (para admin)
  updateProduct: async (id: string, productData: FormData): Promise<Product> => {
    try {
      const response = await api.put(`/products/${id}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un producto (para admin)
  deleteProduct: async (id: string): Promise<void> => {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  }
};