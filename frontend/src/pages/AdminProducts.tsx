import React, { useEffect, useMemo, useState } from "react";
import "../styles/admin-products.css";
import { Product, FrontendProduct } from "../types/product";
import { productService } from "../services/productService";

type Draft = Omit<FrontendProduct, "id"> & {
  color?: string;
  imgFile?: File;
  img2File?: File;
  img3File?: File;
};

// Opciones predefinidas para los selects
const COLOR_OPTIONS = ["Verde", "Negro", "Blanco", "Gris"];
const CATEGORY_OPTIONS = ["Hombre", "Mujer"];
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "Único"];

const emptyDraft: Draft = {
  name: "",
  price: 0,
  description: "",
  sizes: [],
  stock: 0,
  category: "",
  color: "",
  img: "",
  img2: "",
};

// mapProductToFrontend - CON MANEJO DE ERRORES
const mapProductToFrontend = (product: any): FrontendProduct => {
  if (!product) {
    return {
      id: "0",
      name: "Producto no disponible",
      price: 0,
      description: "",
      sizes: [],
      stock: 0,
      category: "",
      img: "",
      img2: "",
    };
  }

  return {
    id: product.idProduct?.toString() || "0",
    name: product.name || "",
    price:
      product.prices?.[0]?.value ||
      product.currentPrice ||
      product.initialPrice ||
      0,
    img: product.images?.[0]?.url || product.img || "",
    img2: product.images?.[1]?.url || product.img2 || "",
    description: product.description || "",
    sizes:
      product.sizes?.map((size: any) => size.name || size.sizeDesc) ||
      product.availableSizes ||
      [],
    stock: product.stock || 0,
    category: product.category?.name || product.categoryName || "",
    color: product.color || "", // Si existe, si no queda vacío
  };
};

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<FrontendProduct[]>([]);
  const [filter, setFilter] = useState("");
  const [creating, setCreating] = useState<Draft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Draft>(emptyDraft);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Cargar productos desde el backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData = await productService.getAllProducts();
        setProducts(productsData);
        setError(null);
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Error al cargar los productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSizeChange = (
    sizes: string[],
    size: string,
    checked: boolean
  ) => {
    if (checked) {
      return [...sizes, size];
    } else {
      return sizes.filter((s) => s !== size);
    }
  };

  const renderSizes = (sizes: string[]) =>
    sizes.length ? sizes.join(", ") : "-";

  // Función para subir una imagen y obtener su URL
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        headers: {
          "x-token": localStorage.getItem("token") || "",
          // NO incluir 'Content-Type' para FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al subir imagen");
      }

      const data = await response.json();
      return data.url; // ← Esto retornará "/uploads/image-1234567890.jpg"
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("No se pudo subir la imagen");
    }
  };

  // Asignar talles al producto usando endpoints del backend
  const assignSizesToProduct = async (
    productId: number,
    sizes: string[]
  ): Promise<void> => {
    try {
      const token = localStorage.getItem("token") || "";
      // Obtener todos los talles para mapear nombre -> idSize
      const listResp = await fetch("http://localhost:3000/api/sizes/all", {
        headers: { "x-token": token },
      });
      const listData: any = await listResp.json();
      const allSizes: any[] = listData?.sizes || [];

      for (const sizeName of sizes) {
        const sizeObj = allSizes.find(
          (s) =>
            (s.sizeDesc || s.name || "").toString().toLowerCase() ===
            sizeName.toLowerCase()
        );
        if (!sizeObj?.idSize) continue;

        await fetch(
          `http://localhost:3000/api/sizes/${productId}/add/${sizeObj.idSize}`,
          {
            method: "POST",
            headers: { "x-token": token },
          }
        ).catch(() => {});
      }
    } catch (err) {
      console.warn("assignSizesToProduct falló (se continúa):", err);
    }
  };

  // Función para crear producto
  // En tu función create - CORREGIR
  const create = async () => {
    if (!creating.name.trim()) return alert("Nombre requerido");
    if (creating.price <= 0) return alert("Precio inválido");

    try {
      setUploading(true);

      // 1. Primero crear el producto básico
      const productData = {
        name: creating.name.trim(),
        description: creating.description.trim(),
        stock: creating.stock,
        idCategory: 1,
        initialPrice: creating.price,
      };

      console.log("Enviando datos del producto:", productData);

      // Crear producto primero
      const response = await productService.createProduct(productData);
      console.log("Respuesta completa del backend:", response);

      // ✅ CORRECCIÓN: Extraer el producto de la respuesta
      if (!response || !response.product) {
        throw new Error(
          "Respuesta inválida del backend: " + JSON.stringify(response)
        );
      }

      const newProduct = response.product;
      const productId = newProduct.idProduct;

      console.log("Producto creado:", newProduct);
      console.log("ID del producto:", productId);

      // ✅ ASIGNAR TALLES después de crear el producto
      if (creating.sizes.length > 0) {
        try {
          await assignSizesToProduct(productId, creating.sizes);
          console.log("Talles asignados exitosamente");
        } catch (error) {
          console.warn("Error asignando talles:", error);
        }
      }

      if (!productId) {
        throw new Error("No se pudo obtener el ID del producto creado");
      }

      // 2. Subir imágenes si hay (solo si el producto se creó exitosamente)
      if (creating.imgFile || creating.img2File || creating.img3File) {
        const imagesToUpload = [
          { file: creating.imgFile, description: "Imagen principal" },
          { file: creating.img2File, description: "Imagen secundaria" },
          { file: creating.img3File, description: "Imagen adicional" },
        ].filter((img) => img.file);

        console.log("Imágenes a subir:", imagesToUpload);

        for (const image of imagesToUpload) {
          if (image.file) {
            try {
              const imgUrl = await uploadImage(image.file);
              console.log("Imagen subida, URL:", imgUrl);

              // Agregar imagen al producto
              console.log("Agregando imagen al producto ID:", productId);

              const addImageResponse = await fetch(
                `http://localhost:3000/api/images/${productId}/add`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "x-token": localStorage.getItem("token") || "",
                  },
                  body: JSON.stringify({
                    url: imgUrl,
                    description: image.description,
                  }),
                }
              );

              if (!addImageResponse.ok) {
                const errorText = await addImageResponse.text();
                console.warn("Error agregando imagen:", errorText);
                // Continuar sin fallar
              } else {
                console.log("Imagen agregada exitosamente");
              }
            } catch (imageError) {
              console.warn("Error procesando imagen (se omite):", imageError);
              // NO lanzar error, continuar con el flujo
            }
          }
        }
      }

      // Actualizar estado local
      setProducts((prev) => [mapProductToFrontend(newProduct), ...prev]);
      setCreating(emptyDraft);
      alert("Producto creado exitosamente!");
    } catch (error: any) {
      console.error("Error creating product:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Error desconocido";
      alert(`Error al crear el producto: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  // Función para eliminar producto
  const del = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;

    try {
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert("Producto eliminado exitosamente!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error al eliminar el producto");
    }
  };

  const startEdit = (p: FrontendProduct) => {
    setEditingId(p.id);
    setEditing({
      name: p.name,
      price: p.price,
      description: p.description,
      sizes: p.sizes,
      stock: p.stock,
      category: p.category || "",
      color: p.color || "",
      img: p.img || "",
      img2: p.img2 || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  // Función para actualizar producto
  const applyEdit = async () => {
    if (editingId === null) return;
    if (!editing.name.trim()) return alert("Nombre requerido");
    if (editing.price <= 0) return alert("Precio inválido");

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("name", editing.name.trim());
      formData.append("description", editing.description.trim());
      formData.append("stock", editing.stock.toString());

      // Manejar nuevas imágenes si se subieron
      const images = [];

      if (editing.imgFile) {
        const imgUrl = await uploadImage(editing.imgFile);
        images.push({ url: imgUrl, description: "Imagen principal" });
      }

      if (editing.img2File) {
        const img2Url = await uploadImage(editing.img2File);
        images.push({ url: img2Url, description: "Imagen secundaria" });
      }

      if (editing.img3File) {
        const img3Url = await uploadImage(editing.img3File);
        images.push({ url: img3Url, description: "Imagen adicional" });
      }

      if (images.length > 0) {
        formData.append("images", JSON.stringify(images));
      }

      const updatedBackendProduct = await productService.updateProduct(
        editingId,
        formData
      );

      const updatedFrontendProduct: FrontendProduct = {
        id: updatedBackendProduct.idProduct.toString(),
        name: updatedBackendProduct.name,
        price: updatedBackendProduct.prices[0]?.value || 0,
        img: updatedBackendProduct.images[0]?.url || "",
        img2: updatedBackendProduct.images[1]?.url || "",
        description: updatedBackendProduct.description,
        sizes: updatedBackendProduct.sizes?.map((size) => size.name) || [
          "S",
          "M",
          "L",
          "XL",
        ],
        stock: updatedBackendProduct.stock,
        category: updatedBackendProduct.category?.name || "",
      };

      setProducts((prev) =>
        prev.map((p) => (p.id === editingId ? updatedFrontendProduct : p))
      );
      setEditingId(null);
      alert("Producto actualizado exitosamente!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error al actualizar el producto");
    } finally {
      setUploading(false);
    }
  };

  const incStock = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p
      )
    );
  };

  const view = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q) ||
        (p.color || "").toLowerCase().includes(q)
    );
  }, [products, filter]);

  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  return (
    <>
      <div className="admin-products">
        <h1>Gestión de productos</h1>
        <p className="subtitle">Crear, editar, eliminar y ajustar stock </p>

        {error && <div className="error-message">{error}</div>}
        {uploading && <div className="loading">Subiendo imágenes...</div>}

        <section className="panel">
          <div className="panel-header">
            <h2>Crear nuevo producto</h2>
          </div>
          <div className="panel-body form-grid">
            <label>
              <span className="span-admin">Nombre</span>
              <input
                className="input-admin"
                value={creating.name}
                onChange={(e) =>
                  setCreating({ ...creating, name: e.target.value })
                }
              />
            </label>
            <label>
              <span className="span-admin">Precio</span>
              <input
                className="input-admin"
                type="number"
                min="0"
                step="0.01"
                value={creating.price}
                onChange={(e) =>
                  setCreating({ ...creating, price: Number(e.target.value) })
                }
              />
            </label>
            <label>
              <span className="span-admin">Color</span>
              <select
                className="input-admin"
                value={creating.color || ""}
                onChange={(e) =>
                  setCreating({ ...creating, color: e.target.value })
                }
              >
                <option value="">Seleccionar color</option>
                {COLOR_OPTIONS.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="span-admin">Categoría</span>
              <select
                className="input-admin"
                value={creating.category}
                onChange={(e) =>
                  setCreating({ ...creating, category: e.target.value })
                }
              >
                <option value="">Seleccionar categoría</option>
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>
            <label className="col-2">
              <span className="span-admin">Descripción</span>
              <textarea
                rows={3}
                value={creating.description}
                onChange={(e) =>
                  setCreating({ ...creating, description: e.target.value })
                }
              />
            </label>
            <label className="col-2">
              <span className="span-admin">Talles</span>
              <div className="sizes-container">
                {SIZE_OPTIONS.map((size) => (
                  <label key={size} className="checkbox">
                    <input
                      type="checkbox"
                      checked={creating.sizes.includes(size)}
                      onChange={(e) =>
                        setCreating({
                          ...creating,
                          sizes: handleSizeChange(
                            creating.sizes,
                            size,
                            e.target.checked
                          ),
                        })
                      }
                    />
                    {size}
                  </label>
                ))}
              </div>
            </label>
            <label>
              <span className="span-admin">Stock</span>
              <input
                className="input-admin"
                type="number"
                min="0"
                value={creating.stock}
                onChange={(e) =>
                  setCreating({ ...creating, stock: Number(e.target.value) })
                }
              />
            </label>
            <label>
              <span className="span-admin">Imagen principal (Archivo)</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setCreating({ ...creating, imgFile: e.target.files?.[0] })
                }
              />
            </label>
            <label>
              <span className="span-admin">Imagen 2 (Archivo)</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setCreating({ ...creating, img2File: e.target.files?.[0] })
                }
              />
            </label>
            <div className="actions col-2">
              <button
                className="btn primary"
                onClick={create}
                disabled={uploading}
              >
                {uploading ? "Creando..." : "Crear producto"}
              </button>
            </div>
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="panel-header">
          <h2>Inventario ({products.length} productos)</h2>
          <div className="tools">
            <input
              className="search"
              placeholder="Buscar por nombre, categoría o color"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>
        <div className="panel-body">
          <table className="data-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Color</th>
                <th>Categoría</th>
                <th>Talles</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {view.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>${p.price} ARS</td>
                  <td>{p.color || "-"}</td>
                  <td>{p.category || "-"}</td>
                  <td>{renderSizes(p.sizes)}</td>
                  <td>
                    <div className="stock-ctrl">
                      <button
                        className="btn"
                        onClick={() => incStock(p.id, -1)}
                      >
                        -
                      </button>
                      <span className="stock">{p.stock}</span>
                      <button className="btn" onClick={() => incStock(p.id, 1)}>
                        +
                      </button>
                    </div>
                  </td>
                  <td>
                    {editingId === p.id ? (
                      <div className="row-actions">
                        <button className="btn primary" onClick={applyEdit}>
                          Guardar
                        </button>
                        <button className="btn" onClick={cancelEdit}>
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="row-actions">
                        <button className="btn" onClick={() => startEdit(p)}>
                          Editar
                        </button>
                        <button
                          className="btn danger"
                          onClick={() => del(p.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {view.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{ textAlign: "center", color: "#bdbdbd" }}
                  >
                    No hay productos para mostrar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {editingId !== null && (
        <section className="panel">
          <div className="panel-header">
            <h2>Editar producto</h2>
          </div>
          <div className="panel-body form-grid">
            <label>
              <span>Nombre</span>
              <input
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
              />
            </label>
            <label>
              <span>Precio</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={editing.price}
                onChange={(e) =>
                  setEditing({ ...editing, price: Number(e.target.value) })
                }
              />
            </label>
            <label>
              <span>Color</span>
              <select
                value={editing.color || ""}
                onChange={(e) =>
                  setEditing({ ...editing, color: e.target.value })
                }
              >
                <option value="">Seleccionar color</option>
                {COLOR_OPTIONS.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Categoría</span>
              <select
                value={editing.category || ""}
                onChange={(e) =>
                  setEditing({ ...editing, category: e.target.value })
                }
              >
                <option value="">Seleccionar categoría</option>
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>
            <label className="col-2">
              <span>Descripción</span>
              <textarea
                rows={3}
                value={editing.description}
                onChange={(e) =>
                  setEditing({ ...editing, description: e.target.value })
                }
              />
            </label>
            <label className="col-2">
              <span>Talles</span>
              <div className="sizes-container">
                {SIZE_OPTIONS.map((size) => (
                  <label key={size} className="checkbox">
                    <input
                      type="checkbox"
                      checked={editing.sizes.includes(size)}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          sizes: handleSizeChange(
                            editing.sizes,
                            size,
                            e.target.checked
                          ),
                        })
                      }
                    />
                    {size}
                  </label>
                ))}
              </div>
            </label>
            <label>
              <span>Stock</span>
              <input
                type="number"
                min="0"
                value={editing.stock}
                onChange={(e) =>
                  setEditing({ ...editing, stock: Number(e.target.value) })
                }
              />
            </label>
            <label>
              <span>Imagen principal (URL)</span>
              <input
                value={editing.img || ""}
                onChange={(e) =>
                  setEditing({ ...editing, img: e.target.value })
                }
              />
            </label>
            <label>
              <span>Imagen 2 (URL)</span>
              <input
                value={editing.img2 || ""}
                onChange={(e) =>
                  setEditing({ ...editing, img2: e.target.value })
                }
              />
            </label>
            <div className="actions col-2">
              <button className="btn primary" onClick={applyEdit}>
                Guardar cambios
              </button>
              <button className="btn" onClick={cancelEdit}>
                Cancelar
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
export default AdminProducts;
