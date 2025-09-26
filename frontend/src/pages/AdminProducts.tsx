import React, { useEffect, useMemo, useState } from "react";
import "../styles/admin-products.css";
import { FrontendProduct } from "../types/product";
import { productService } from "../services/productService";
import api from "../services/api";
import SuccessMessage from "../components/SuccessMessage";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";

type Draft = Omit<FrontendProduct, "id"> & {
  imgFile?: File;
  img2File?: File;
};

// Opciones de categorías cargadas dinámicamente
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "Único"];

// Empty draft template
const emptyDraft: Draft = {
  name: "",
  price: 0,
  description: "",
  sizes: [],
  stock: 0,
  category: "",
  img: "",
  img2: "",
};

// Mock products for fallback
const MOCK_PRODUCTS: FrontendProduct[] = [
  {
    id: "101",
    name: "Camiseta Titular 24/25",
    price: 25000,
    description: "Camiseta oficial temporada 24/25",
    sizes: ["S", "M", "L", "XL"],
    stock: 12,
    category: "Remera",
    img: "",
    img2: "",
  },
];

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<FrontendProduct[]>([]);
  const [filter, setFilter] = useState("");
  const [creating, setCreating] = useState<Draft>(emptyDraft); // State for new product
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Draft>(emptyDraft); // State for editing product
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<
    { id: string; name: string }[]
  >([]);

  // Function to upload images
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.url;
    } catch (error: any) {
      console.error("Error uploading image:", error);
      throw new Error(
        error.response?.data?.message || "No se pudo subir la imagen"
      );
    }
  };

  // Function for adding images
  const addImageToProduct = async (
    productId: number,
    imageData: { url: string; description: string }
  ): Promise<void> => {
    try {
      await api.post(`/images/${productId}/add`, imageData);
    } catch (error) {
      console.warn("Error agregando imagen:", error);
    }
  };

  // Implement logic to get size ID by name
  const mapSizeNameToId = (sizeName: string): number => {
    const sizeMap: { [key: string]: number } = {
      XS: 1,
      S: 2,
      M: 3,
      L: 4,
      XL: 5,
      XXL: 6,
      Único: 7,
    };
    return sizeMap[sizeName] || 0;
  };

  // Load products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData = await productService.getAllProducts();

        // DEBUG: See what the backend returns
        console.log("Productos desde backend:", productsData);

        if (Array.isArray(productsData) && productsData.length > 0) {
          // DEBUG: See the structure of each product
          productsData.forEach((product, index) => {
            console.log(`Producto ${index}:`, product);
            console.log(`Talles:`, product.sizes);
            console.log(`Categoría:`, product.category);
          });

          setProducts(productsData);
        } else {
          setProducts(MOCK_PRODUCTS);
        }
      } catch (err) {
        setErrorMessage("Error cargando productos. Usando datos de prueba.");
        setTimeout(() => setErrorMessage(""), 3000);
        console.error("Error loading products:", err);
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Cargar categorías dinámicamente
  useEffect(() => {
    api
      .get("/categories")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCategoryOptions(
            res.data.map((cat: any) => ({
              id: cat.idCategory.toString(),
              name: cat.name,
            }))
          );
        } else if (res.data && Array.isArray(res.data.categories)) {
          setCategoryOptions(
            res.data.categories.map((cat: any) => ({
              id: cat.idCategory.toString(),
              name: cat.name,
            }))
          );
        } else {
          setCategoryOptions([]);
        }
      })
      .catch(() => setCategoryOptions([]));
  }, []);

  // Helper to manage size selection
  const handleSizeChange = (
    sizes: string[],
    size: string,
    checked: boolean
  ) => {
    return checked ? [...sizes, size] : sizes.filter((s) => s !== size);
  };

  // Helper to render sizes as a string
  const renderSizes = (sizes: string[]) =>
    sizes.length ? sizes.join(", ") : "-";

  // Function to create a new product
  const create = async () => {
    if (!creating.name.trim()) setErrorMessage("Nombre requerido");
    setTimeout(() => setErrorMessage(""), 3000);
    if (creating.price <= 0) setErrorMessage("Precio inválido");
    setTimeout(() => setErrorMessage(""), 3000);
    if (!creating.category) setErrorMessage("Categoría requerida");
    setTimeout(() => setErrorMessage(""), 3000);

    try {
      setUploading(true);

      // Convert sizes to IDs
      const sizeIds = creating.sizes.map(mapSizeNameToId);

      // 1. Create the basic product
      const productData = {
        name: creating.name.trim(),
        description: creating.description.trim(),
        stock: creating.stock,
        idCategory: parseInt(creating.category || ""),
        initialPrice: creating.price,
        sizes: sizeIds.filter((id) => id !== 0),
      };

      // DEBUG: Check the data being sent
      console.log("Enviando datos del producto:", productData);
      console.log(
        "idCategory type:",
        typeof productData.idCategory,
        productData.idCategory
      );

      // productService.createProduct returns the product directly
      const newProduct = await productService.createProduct(productData);

      if (!newProduct || !newProduct.idProduct) {
        throw new Error("Respuesta inválida del backend");
      }

      // 2. Get the new product ID
      const productId = newProduct.idProduct;

      // Debug: Check the created product
      console.log("Producto creado:", newProduct);

      // 3. Upload images if there are files
      const imageFiles = [
        { file: creating.imgFile, description: "Imagen principal" },
        { file: creating.img2File, description: "Imagen secundaria" },
      ].filter((img) => img.file);

      // Upload each image and associate it with the product
      for (const image of imageFiles) {
        if (image.file) {
          try {
            const imgUrl = await uploadImage(image.file);
            await addImageToProduct(productId, {
              url: imgUrl,
              description: image.description,
            });
          } catch (imageError) {
            console.warn("Error procesando imagen:", imageError);
          }
        }
      }

      // 4. Refill the full product details
      const completeProduct = await api.get(`/products/${productId}`);
      const mappedProduct = mapProductToFrontend(completeProduct.data.product);

      setProducts((prev) => [mappedProduct, ...prev]); // Add new product to the top
      setCreating(emptyDraft); // Reset creation form

      setMessage("Producto creado exitosamente!");
      setTimeout(() => {
        setMessage("");
      }, 1000);
    } catch (error: any) {
      console.error("Error creating product:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Error desconocido";
      setErrorMessage(`Error al crear el producto: ${errorMessage}`);
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setUploading(false);
    }
  };

  // Function to map backend product to frontend format
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

    // Extract the most recent price
    let latestPrice = 0;
    if (product.prices && product.prices.length > 0) {
      // Sort prices by updateDate descending
      const sortedPrices = [...product.prices].sort(
        (a: any, b: any) =>
          new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime()
      );
      latestPrice = sortedPrices[0]?.value || 0;
    }

    // Extract sizes
    const sizes =
      product.sizes
        ?.map((size: any) => size.sizeDesc || size.name || "")
        .filter(Boolean) || [];

    // Extract category
    let category = "";
    if (product.category?.name) {
      category = product.category.name;
    } else if (product.idCategory) {
      const found = categoryOptions.find(
        (opt) => parseInt(opt.id) === product.idCategory
      );
      category = found ? found.name : "";
    }

    // Map to FrontendProduct structure
    return {
      id: product.idProduct?.toString() || product.id || "0",
      name: product.name || "",
      price: latestPrice,
      img: product.images?.[0]?.url || product.img || "",
      img2: product.images?.[1]?.url || product.img2 || "",
      description: product.description || "",
      sizes: sizes,
      stock: product.stock || 0,
      category: category,
    };
  };

  // Function to delete a product
  const deleteProduct = async (id: string) => {
    try {
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setMessage("Producto eliminado exitosamente!");
      setTimeout(() => {
        setMessage("");
      }, 1000);
    } catch (error: any) {
      console.error("Error deleting product:", error);
      const errorMessage =
        error.response?.data?.message || "Error al eliminar producto";
      setErrorMessage(errorMessage);
    }
  };

  // Function to apply edits to a product
  const applyEdit = async () => {
    if (editingId === null) return;
    if (!editing.name.trim()) return setErrorMessage("Nombre requerido");
    setTimeout(() => setErrorMessage(""), 3000);
    if (editing.price <= 0) return setErrorMessage("Precio inválido");
    setTimeout(() => setErrorMessage(""), 3000);
    if (!editing.category) return setErrorMessage("Categoría requerida");
    setTimeout(() => setErrorMessage(""), 3000);

    try {
      setUploading(true);

      // Convert sizes to IDs
      const sizeIds = editing.sizes.map(mapSizeNameToId);

      // 1. Upload new images if any
      const newImages: { url: string; description: string }[] = [];

      if (editing.imgFile) {
        try {
          const imgUrl = await uploadImage(editing.imgFile);
          newImages.push({ url: imgUrl, description: "Imagen principal" });
        } catch (imageError) {
          console.warn("Error subiendo imagen principal:", imageError);
        }
      }

      if (editing.img2File) {
        try {
          const img2Url = await uploadImage(editing.img2File);
          newImages.push({ url: img2Url, description: "Imagen secundaria" });
        } catch (imageError) {
          console.warn("Error subiendo imagen secundaria:", imageError);
        }
      }

      // 2. Prepare updated product data including images
      const productData = {
        name: editing.name.trim(),
        description: editing.description.trim(),
        stock: editing.stock,
        idCategory: parseInt(editing.category),
        initialPrice: editing.price,
        sizes: sizeIds.filter((id) => id !== 0),
        images: newImages.length > 0 ? newImages : undefined,
      };

      console.log("Enviando datos de actualización:", productData);

      // 3. Update product
      const response = await api.put(
        `/products/update/${editingId}`,
        productData
      );
      const updatedProductFromBackend = response.data.product;

      // 4. Get complete product details
      let completeProduct;
      if (newImages.length === 0) {
        // Not uploading new images, keep existing ones
        const completeResponse = await api.get(`/products/${editingId}`);
        completeProduct = completeResponse.data.product;
      } else {
        // New images were uploaded, use the updated product from response
        completeProduct = updatedProductFromBackend;
      }

      // Debug: Check what the backend returns
      console.log("Producto completo desde backend:", completeProduct);
      console.log("Precios:", completeProduct.prices);
      console.log("Imágenes:", completeProduct.images);

      // 5. Map correctly and update state
      const mappedProduct = mapProductToFrontend(completeProduct);
      console.log("Producto mapeado:", mappedProduct);

      // 6. Update state correctly
      setProducts((prev) =>
        prev.map((p) => (p.id === editingId ? mappedProduct : p))
      );

      setEditingId(null);
      setMessage("Producto actualizado exitosamente!");
      setTimeout(() => {
        setMessage("");
      }, 1000);
    } catch (error: any) {
      console.error("Error updating product:", error);
      const errorMessage =
        error.response?.data?.message || "Error al actualizar producto";
      setErrorMessage(errorMessage);
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setUploading(false);
    }
  };

  // States and editing functions
  const startEdit = (p: FrontendProduct) => {
    setEditingId(p.id);

    // Find the category ID based on the name
    const categoryObj = categoryOptions.find((cat) => cat.name === p.category);
    const categoryId = categoryObj ? categoryObj.id : "";

    setEditing({
      name: p.name,
      price: p.price,
      description: p.description,
      sizes: p.sizes,
      stock: p.stock,
      category: categoryId, // Save the ID, not the name
      img: p.img || "",
      img2: p.img2 || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  // Modal state for delete confirmation
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: string | null;
    name: string;
  }>({ open: false, id: null, name: "" });

  const del = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setDeleteModal({ open: true, id, name: product.name });
    }
  };

  const confirmDelete = async () => {
    if (deleteModal.id) {
      await deleteProduct(deleteModal.id);
    }
    setDeleteModal({ open: false, id: null, name: "" });
  };

  const cancelDelete = () => {
    setDeleteModal({ open: false, id: null, name: "" });
  };

  // Filtering function
  const filteredProducts = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q)
    );
  }, [products, filter]);

  if (loading) {
    return (
      <div className="loading">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="admin-products">
      {/* DELETE CONFIRMATION MODAL */}
      {deleteModal.open && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>¿Eliminar producto?</h3>
            <p>¿Estás seguro de que deseas eliminar "{deleteModal.name}"?</p>
            <div className="modal-actions">
              <button className="btn danger" onClick={confirmDelete}>
                Eliminar
              </button>
              <button className="btn" onClick={cancelDelete}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      <ErrorMessage
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
      <SuccessMessage message={message} onClose={() => setMessage("")} />
      <h1>Gestión de productos</h1>
      <p className="subtitle">Crear, editar, eliminar y ajustar stock</p>

      {uploading && (
        <div className="loading">
          <LoadingSpinner />
        </div>
      )}

      {/* CREATION FORM */}
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
              step="0.01"
              placeholder="Precio"
              value={creating.price === 0 ? "" : creating.price}
              onChange={(e) => {
                const val = e.target.value;
                setCreating({
                  ...creating,
                  price: val === "" ? 0 : Number(val),
                });
              }}
            />
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
              {categoryOptions.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
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

          <div className="sizes">
            <span className="span-admin">Talles</span>
            <div className="sizes-container">
              {SIZE_OPTIONS.map((size) => (
                <label key={size} className="checkbox">
                  <input
                  type="checkbox"
                  checked={(creating.sizes || []).includes(size)}
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
          </div>

          <label>
            <span className="span-admin">Stock</span>
            <input
              className="input-admin"
              type="number"
              placeholder="Stock"
              value={creating.stock === 0 ? "" : creating.stock}
              onChange={(e) => {
                const val = e.target.value;
                setCreating({
                  ...creating,
                  stock: val === "" ? 0 : Number(val),
                });
              }}
            />
          </label>

          <label>
            <span className="span-admin">Imagen principal</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setCreating({ ...creating, imgFile: e.target.files?.[0] })
              }
            />
          </label>

          <label>
            <span className="span-admin">Imagen 2</span>
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
              onClick={() => {
                console.log("Estado completo de creating:", creating);
                console.log("categoryOptions:", categoryOptions);
                create();
              }}
              disabled={uploading}
            >
              {uploading ? "Creando..." : "Crear producto"}
            </button>
          </div>
        </div>
      </section>

      {/* PRODUCT TABLE */}
      <section className="panel">
        <div className="panel-header">
          <h2>Inventario ({products.length} productos)</h2>
          <div className="tools">
            <input
              className="search"
              placeholder="Buscar por nombre o categoría"
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
                <th>Categoría</th>
                <th>Talles</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>${p.price} ARS</td>
                  <td>{p.category || "-"}</td>
                  <td>{renderSizes(p.sizes)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn" onClick={() => startEdit(p)}>
                        Editar
                      </button>
                      <button className="btn danger" onClick={() => del(p.id)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
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

      {/* EDITING MODAL */}
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
                step="0.01"
                placeholder="Precio"
                value={editing.price === 0 ? "" : editing.price}
                onChange={(e) => {
                  const val = e.target.value;
                  setEditing({
                    ...editing,
                    price: val === "" ? 0 : Number(val),
                  });
                }}
              />
            </label>

            <label>
              <span>Categoría</span>
              <select
                value={editing.category}
                onChange={(e) =>
                  setEditing({ ...editing, category: e.target.value })
                }
              >
                <option value="">Seleccionar categoría</option>
                {categoryOptions.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
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

            <div className="sizes">
              <span className="span-admin">Talles</span>
              <div className="sizes-container">
                {SIZE_OPTIONS.map((size) => (
                  <label key={size} className="checkbox">
                    <input
                      type="checkbox"
                      checked={(editing.sizes || []).includes(size)}
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
            </div>

            <label>
              <span>Stock</span>
              <input
                type="number"
                placeholder="Stock"
                value={editing.stock === 0 ? "" : editing.stock}
                onChange={(e) => {
                  const val = e.target.value;
                  setEditing({
                    ...editing,
                    stock: val === "" ? 0 : Number(val),
                  });
                }}
              />
            </label>

            <label>
              <span>Nueva imagen principal</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEditing({ ...editing, imgFile: e.target.files?.[0] })
                }
              />
            </label>

            <label>
              <span>Nueva imagen 2</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEditing({ ...editing, img2File: e.target.files?.[0] })
                }
              />
            </label>

            <div className="actions col-2">
              <button
                className="btn primary"
                onClick={applyEdit}
                disabled={uploading}
              >
                {uploading ? "Guardando..." : "Guardar cambios"}
              </button>
              <button className="btn" onClick={cancelEdit}>
                Cancelar
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminProducts;
