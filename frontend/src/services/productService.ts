import api from "./api";
import { Product, FrontendProduct } from "../types/product";

export const productService = {
  // Obtener todos los productos
  // productService.ts - Solución definitiva
  getAllProducts: async (): Promise<FrontendProduct[]> => {
    try {
      const response = await api.get<{ products: Product[] }>("/products");
      return response.data.products.map((product) => ({
        id: product.idProduct.toString(),
        name: product.name,
        price: product.prices[0]?.value || 0,
        // 🔧 SOLUCIÓN: Construir URL completa con el host del backend
        img:
          product.images && product.images.length > 0
            ? `http://localhost:3000${product.images[0].url}` // ← URL completa
            : "/placeholder-image.jpg",
        img2:
          product.images && product.images.length > 1
            ? `http://localhost:3000${product.images[1].url}` // ← URL completa
            : "/placeholder-image.jpg",
        description: product.description,
        sizes: product.sizes?.map(
          (size) => size.sizeDesc || size.name || ""
        ) || ["S", "M", "L", "XL"],
        stock: product.stock,
        category: product.category?.name || "",
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
  getProductById: async (id: string): Promise<any> => {
    try {
      const response = await api.get(`/products/${id}`);
      const productData = response.data.product || response.data;

      // Procesar las imágenes para construir URLs completas
      if (productData.images && Array.isArray(productData.images)) {
        productData.images = productData.images.map((image: any) => ({
          ...image,
          url: `http://localhost:3000${image.url}`,
        }));
      }

      return productData;
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
  updateProduct: async (id: string, productData: any): Promise<Product> => {
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
