import api from "./api";
import { Product, FrontendProduct } from "../types/product";

export const productService = {
  // Obtener todos los productos
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
        sizes: product.sizes?.map((size) => size.name) || ["S", "M", "L", "XL"],
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
  createProduct: async (productData: any): Promise<Product> => {
    try {
      let response;

      if (productData instanceof FormData) {
        response = await api.post("/products", productData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await api.post("/products/create", productData);
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "Error creating product:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Actualizar un producto (para admin)
  updateProduct: async (
    id: string,
    productData: FormData
  ): Promise<Product> => {
    try {
      const response = await api.put(`/products/${id}`, productData, {
        headers: {
          "Content-Type": "multipart/form-data",
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
