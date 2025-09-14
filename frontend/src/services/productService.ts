import api from "./api";
import { Product, FrontendProduct } from "../types/product";

export const productService = {
  // Obtener todos los productos
  // productService.ts - Corregir el mapeo
  getAllProducts: async (): Promise<FrontendProduct[]> => {
    try {
      const response = await api.get<{ products: Product[] }>("/products");
      return response.data.products.map((product) => ({
        id: product.idProduct.toString(),
        name: product.name,
        price: product.prices[0]?.value || 0,
        img: product.images[0]?.url || "",
        img2: product.images[1]?.url || "",
        description: product.description,
        // 🔧 FIX: Manejar diferentes estructuras de talles
        sizes: product.sizes?.map(
          (size) => size.sizeDesc || size.name || ""
        ) || ["S", "M", "L", "XL"],
        stock: product.stock,
        // 🔧 FIX: Manejar diferentes estructuras de categoría
        category:
          product.category?.name ||
          (product.idCategory === 1
            ? "Hombre"
            : product.idCategory === 2
              ? "Mujer"
              : ""),
      }));
    } catch (error: any) {
      console.error(
        "Error fetching products:",
        error.response?.data || error.message
      );
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

  // Crear un nuevo producto
  createProduct: async (productData: any): Promise<Product> => {
    try {
      const response = await api.post("/products/create", productData);
      return response.data.product;
    } catch (error: any) {
      console.error(
        "Error creating product:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Actualizar un producto
  updateProduct: async (
    id: string,
    productData: any 
  ): Promise<Product> => {
    try {
      // 🔧 Ahora envía JSON normal
      const response = await api.put(`/products/update/${id}`, productData);
      return response.data.product || response.data;
    } catch (error: any) {
      console.error(
        `Error updating product ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Eliminar un producto
  deleteProduct: async (id: string): Promise<void> => {
    try {
      await api.delete(`/products/delete/${id}`);
    } catch (error: any) {
      console.error(
        `Error deleting product ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};
