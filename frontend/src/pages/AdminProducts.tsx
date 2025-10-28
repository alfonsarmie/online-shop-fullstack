import React, { useEffect, useMemo, useState } from "react";
import "../styles/admin-products.css";
import { FrontendProduct } from "../types/product";
import { productService } from "../services/productService";
import api from "../services/api";
import SuccessMessage from "../components/SuccessMessage";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";

type DraftLocal = Omit<FrontendProduct, "id" | "sizes"> & {
  imgFile?: File;
  img2File?: File;
  sizes: string[];
};

const emptyDraft: DraftLocal = {
  name: "",
  price: 0,
  description: "",
  sizes: [],
  stock: 0,
  category: "",
  img: "",
  img2: "",
};

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<FrontendProduct[]>([]);
  const [filter, setFilter] = useState("");
  const [creating, setCreating] = useState<DraftLocal>(emptyDraft); // State for new product (sizes as string[])
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<DraftLocal>(emptyDraft); // State for editing product (sizes as string[])
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [sizeOptions, setSizeOptions] = useState<
    { id: number; label: string; gender: string }[]
  >([]);

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

  useEffect(() => {
    api
      .get("/sizes/all")
      .then((res) => {
        if (Array.isArray(res.data?.sizes)) {
          setSizeOptions(
            res.data.sizes.map((size: any) => ({
              id: Number(size.idSize),
              label: size.sizeDesc,
              gender: size.gender,
            }))
          );
        } else {
          setSizeOptions([]);
        }
      })
      .catch((error) => {
        console.error("Error cargando talles:", error);
        setSizeOptions([]);
      });
  }, []);

  const sizeNameToIdMap = useMemo(() => {
    const map: Record<string, number> = {};
    sizeOptions.forEach((size) => {
      const key = (size.label || "").trim().toLowerCase();
      if (key) {
        map[key] = size.id;
      }
    });
    return map;
  }, [sizeOptions]);

  const mapSizeNameToId = (sizeName: string): number => {
    const key = (sizeName || "").trim().toLowerCase();
    return sizeNameToIdMap[key] || 0;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData = await productService.getAllProducts();


        const normalized = Array.isArray(productsData)
          ? productsData.map((p) => ({
              ...p,
              sizes:
                p.sizes && p.sizes.length
                  ? p.sizes.map((s: any) => ({
                      idSize: s.idSize || s.id || s.idSize || 0,
                      name: s.name || s.sizeDesc || s.label || "",
                      sizeDesc: s.sizeDesc || s.name || s.label || "",
                    }))
                  : [],
            }))
          : [];

        setProducts(normalized as FrontendProduct[]);
      } catch (err) {
        setErrorMessage("Error cargando productos.");
        setTimeout(() => setErrorMessage(""), 3000);
        console.error("Error loading products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  const handleSizeChange = (
    sizes: string[],
    size: string,
    checked: boolean
  ) => {
    return checked ? [...sizes, size] : sizes.filter((s) => s !== size);
  };

  const renderSizes = (sizes: any[] | string[]) => {
    if (!sizes || sizes.length === 0) return "-";
    const out = sizes
      .map((s: any) => {
        if (!s) return "";
        if (typeof s === "string") return s;
        return s.sizeDesc || s.name || s.label || String(s);
      })
      .filter(Boolean);
    return out.length ? out.join(", ") : "-";
  };

  const create = async () => {
    const errores: string[] = [];
    if (!creating.name.trim()) errores.push("nombre");
    if (creating.price <= 0) errores.push("precio");
    if (!creating.category) errores.push("categoría");
    if (!creating.description.trim()) errores.push("descripción");
    if (creating.sizes.length === 0) errores.push("talles");
    if (creating.stock <= 0) errores.push("stock");
    // Puedes agregar validación de imágenes si son obligatorias

    if (errores.length > 0) {
      setErrorMessage(
        `Error en la creación del producto: completa todos los campos requeridos (${errores.join(", ")})`
      );
      setTimeout(() => setErrorMessage(""), 4000);
      return;
    }

    try {
      const mappedSizes = creating.sizes.map((label) => ({
        label,
        id: mapSizeNameToId(label),
      }));
      const invalidSizes = mappedSizes
        .filter((entry) => entry.id === 0)
        .map((entry) => entry.label);

      if (invalidSizes.length > 0) {
        setErrorMessage(
          `No se encontraron talles válidos para: ${invalidSizes.join(", ")}`
        );
        setTimeout(() => setErrorMessage(""), 4000);
        return;
      }

      setUploading(true);
      const sizeIds = mappedSizes.map((entry) => entry.id);
      const productData = {
        name: creating.name.trim(),
        description: creating.description.trim(),
        stock: creating.stock,
        idCategory: parseInt(creating.category || ""),
        initialPrice: creating.price,
        sizes: sizeIds,
      };
      const newProduct = await productService.createProduct(productData);
      if (!newProduct || !newProduct.idProduct) {
        throw new Error("Respuesta inválida del backend");
      }
      const productId = newProduct.idProduct;
      const imageFiles = [
        { file: creating.imgFile, description: "Imagen principal" },
        { file: creating.img2File, description: "Imagen secundaria" },
      ].filter((img) => img.file);
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
      const completeProduct = await api.get(`/products/${productId}`);
      const mappedProduct = mapProductToFrontend(completeProduct.data.product);
      setProducts((prev) => [mappedProduct, ...prev]);
      setCreating(emptyDraft);
      setMessage("Producto creado exitosamente!");
      setTimeout(() => {
        setMessage("");
      }, 1000);
    } catch (error: any) {
      console.error("Error creating product:", error);
      const detalle = error.response?.data?.message || error.message || "Error desconocido";
      setErrorMessage(`Error en la creación del producto: ${detalle}`);
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setUploading(false);
    }
  };

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

    let latestPrice = 0;
    if (product.prices && product.prices.length > 0) {
      const sortedPrices = [...product.prices].sort(
        (a: any, b: any) =>
          new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime()
      );
      latestPrice = sortedPrices[0]?.value || 0;
    }

    const sizes =
      product.sizes
        ?.map((size: any) => ({
          idSize: size.idSize || size.id || 0,
          name: size.name || size.sizeDesc || "",
          sizeDesc: size.sizeDesc || size.name || "",
        }))
        .filter((s: any) => s.name || s.sizeDesc) || [];

    let category = "";
    if (product.category?.name) {
      category = product.category.name;
    } else if (product.idCategory) {
      const found = categoryOptions.find(
        (opt) => parseInt(opt.id) === product.idCategory
      );
      category = found ? found.name : "";
    }

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

  const applyEdit = async () => {
    if (editingId === null) return;
    const errores: string[] = [];
    if (!editing.name.trim()) errores.push("nombre");
    if (editing.price <= 0) errores.push("precio");
    if (!editing.category) errores.push("categoría");
    if (!editing.description.trim()) errores.push("descripción");
    if ((editing.sizes || []).length === 0) errores.push("talles");
    if (editing.stock <= 0) errores.push("stock");

    if (errores.length > 0) {
      setErrorMessage(
        `Error en la edición del producto: completa todos los campos requeridos (${errores.join(", ")})`
      );
      setTimeout(() => setErrorMessage(""), 4000);
      return;
    }

    try {
      const mappedSizes = editing.sizes.map((label) => ({
        label,
        id: mapSizeNameToId(label),
      }));
      const invalidSizes = mappedSizes
        .filter((entry) => entry.id === 0)
        .map((entry) => entry.label);

      if (invalidSizes.length > 0) {
        setErrorMessage(
          `No se encontraron talles válidos para: ${invalidSizes.join(", ")}`
        );
        setTimeout(() => setErrorMessage(""), 4000);
        return;
      }

      setUploading(true);

      const sizeIds = mappedSizes.map((entry) => entry.id);

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

      const productData = {
        name: editing.name.trim(),
        description: editing.description.trim(),
        stock: editing.stock,
        idCategory: parseInt(editing.category || ""),
        initialPrice: editing.price,
        sizes: sizeIds,
        images: newImages.length > 0 ? newImages : undefined,
      };


      const response = await api.put(
        `/products/update/${editingId}`,
        productData
      );
      const updatedProductFromBackend = response.data.product;

      let completeProduct;
      if (newImages.length === 0) {
        // Not uploading new images, keep existing ones
        const completeResponse = await api.get(`/products/${editingId}`);
        completeProduct = completeResponse.data.product;
      } else {
        completeProduct = updatedProductFromBackend;
      }

  const mappedProduct = mapProductToFrontend(completeProduct);

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

  const startEdit = (p: FrontendProduct) => {
    setEditingId(p.id);

    const categoryObj = categoryOptions.find((cat) => cat.name === p.category);
    const categoryId = categoryObj ? categoryObj.id : "";

    const sizeLabels = (p.sizes || []).map((s: any) =>
      typeof s === "string" ? s : s.sizeDesc || s.name || s.label || ""
    );

    setEditing({
      name: p.name,
      price: p.price,
      description: p.description,
      sizes: sizeLabels,
      stock: p.stock,
      category: categoryId, 
      img: p.img || "",
      img2: p.img2 || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

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
    <div className="page-with-nav-spacing admin-surface">
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
            {sizeOptions.length === 0 ? (
              <p style={{ marginTop: "0.5rem", color: "#bdbdbd" }}>
                No hay talles disponibles. Crea talles antes de asignarlos.
              </p>
            ) : (
              <div className="sizes-container">
                {sizeOptions.map((size) => (
                  <label key={size.id} className="checkbox-admin">
                    <input
                      type="checkbox"
                      checked={(creating.sizes || []).includes(size.label)}
                      onChange={(e) =>
                        setCreating({
                          ...creating,
                          sizes: handleSizeChange(
                            creating.sizes,
                            size.label,
                            e.target.checked
                          ),
                        })
                      }
                    />
                    {size.label}
                  </label>
                ))}
              </div>
            )}
          </div>

          <label>
            <span className="span-admin">Stock</span>
            <input
              className="input-admin"
              type="number"
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
                create();
              }}
              disabled={uploading}
            >
              {uploading ? "Creando..." : "Crear producto"}
            </button>
          </div>
        </div>
      </section>

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
              {sizeOptions.length === 0 ? (
                <p style={{ marginTop: "0.5rem", color: "#bdbdbd" }}>
                  No hay talles disponibles para seleccionar.
                </p>
              ) : (
                <div className="sizes-container">
                  {sizeOptions.map((size) => (
                    <label key={size.id} className="checkbox-admin">
                      <input
                        type="checkbox"
                        checked={(editing.sizes || []).includes(size.label)}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            sizes: handleSizeChange(
                              editing.sizes,
                              size.label,
                              e.target.checked
                            ),
                          })
                        }
                      />
                      {size.label}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <label>
              <span>Stock</span>
              <input
                type="number"
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
    </div>
  );
};

export default AdminProducts;
