import api from "./api";
import { Product, FrontendProduct, CriticalProductInfo } from "../types/product";


const BASE_URL = (import.meta as any).env.VITE_API_URL || "http://localhost:3000";

export const productService = {

  getAllProducts: async (search?: string): Promise<FrontendProduct[]> => {
    try {
      const trimmedSearch =
        typeof search === "string" ? search.trim() : undefined;
      const params =
        trimmedSearch && trimmedSearch.length > 0
          ? { search: trimmedSearch }
          : undefined;

      const response = await api.get<{ products: Product[] }>("/products", {
        params,
      });
      return response.data.products.map((product) => {
        const sizes = (product.sizes || []).map((size: any) => ({
          idSize: size.idSize,
          name: size.name || size.sizeDesc || '',
          sizeDesc: size.sizeDesc || size.name || '',
          stock: size.ProductSize?.stock ?? 0,
        }));
        const totalStock = sizes.reduce((acc: number, s: any) => acc + (s.stock ?? 0), 0);
        return {
          id: product.idProduct.toString(),
          name: product.name,
          price: product.prices[0]?.value || 0,
          img:
            product.images && product.images.length > 0
              ? `${BASE_URL}${product.images[0].url}` 
              : "/placeholder-image.jpg",
          img2:
            product.images && product.images.length > 1
              ? `${BASE_URL}${product.images[1].url}` 
              : "/placeholder-image.jpg",
          description: product.description,
          sizes,
          stock: totalStock,
          category: product.category?.name || "",
        } as FrontendProduct;
      });
    } catch (error: any) {
      console.error(
        "Error fetching products:",
        error.response?.data || error.message
      );
      throw error;
    }
  },


  getProductById: async (id: string): Promise<any> => {
    try {
      const response = await api.get(`/products/${id}`);
      const productData = response.data.product || response.data;

      // Process images to have full URLs
      if (productData.images && Array.isArray(productData.images)) {
        productData.images = productData.images.map((image: any) => ({
          ...image,
          url: `${BASE_URL}${image.url}`,
        }));
      }

      // normalize sizes to include stock from through table if present
      if (Array.isArray(productData.sizes)) {
        productData.sizes = productData.sizes.map((size: any) => ({
          ...size,
          stock: size.stock ?? size.ProductSize?.stock ?? 0,
        }));
      }
      return productData;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },


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


  updateProduct: async (id: string, productData: any): Promise<Product> => {
    try {
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

  getCriticalStockProducts: async (criticalParam: number = 10): Promise<CriticalProductInfo[]> => {
      try {
        const response = await api.get<{ products: CriticalProductInfo[] }>('/products/critical', {
          params: { criticalParam } 
        });
        return response.data.products || [];
      } catch (error: any) {
        console.error(
          "Error fetching critical stock products:",
          error.response?.data || error.message
        );
        throw error;
      }
    },

  getTopFiveProducts: async (): Promise<{ name: string; orderCount: number }[]> => {
    try {
      const response = await api.get<{ topProducts: { name: string; orderCount: number }[] }>("/products/topfive");
      return response.data.topProducts || [];
    } catch (error: any) {
      console.error("Error fetching top five products:", error.response?.data || error.message);
      throw error;
    }
  },

  updateProductSizeStock: async (productId: string, sizeId: number, stock: number): Promise<void> => {
    try {
      await api.put(`/products/update/${productId}/sizes/${sizeId}/stock`, { stock });
    } catch (error: any) {
      console.error(
        `Error updating stock for product ${productId} size ${sizeId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};
