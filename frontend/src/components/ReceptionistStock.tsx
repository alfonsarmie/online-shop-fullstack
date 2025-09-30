import React, { useEffect, useMemo, useState } from "react";
import "../styles/receiver-dashboard.css";
import { Product, FrontendProduct } from "../types/product";
import { productService } from "../services/productService";
import SuccessMessage from "./SuccessMessage";

// Helper: map backend Product to flat FrontendProduct for UI
function mapProductToFrontend(p: Product): FrontendProduct {
  return {
    id: p.idProduct.toString(),
    name: p.name,
    price: p.prices && p.prices.length > 0 ? p.prices[0].value : 0,
    img: p.images && p.images[0] ? p.images[0].url : "",
    img2: p.images && p.images[1] ? p.images[1].url : "",
    description: p.description,
    sizes: p.sizes ? p.sizes.map((s) => s.sizeDesc || s.name) : [],
    stock: p.stock,
    category: p.category ? p.category.name : "",
  };
}

const ReceptionistStock: React.FC = () => {
  const [products, setProducts] = useState<FrontendProduct[]>([]);
  const [draft, setDraft] = useState<FrontendProduct[] | null>(null);
  const [editing, setEditing] = useState(false);
  const [filter, setFilter] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Load products from backend
  useEffect(() => {
    setLoading(true);
    productService
      .getAllProducts()
      .then((backendProducts) => {
        setProducts(backendProducts);
      })
      .finally(() => setLoading(false));
  }, []);

  // Get unique categories for filter
  const currentList = editing && draft ? draft : products;
  const categories = useMemo(() => {
    const cats = currentList
      .map((p) => (typeof p.category === "string" ? p.category : ""))
      .filter(Boolean)
      .filter((cat, index, arr) => arr.indexOf(cat) === index);
    return cats.sort();
  }, [currentList]);

  const filteredProducts = useMemo(() => {
    let result = currentList;
    if (filter.trim()) {
      const q = filter.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q)
      );
    }
    if (lowStockOnly) {
      result = result.filter((p) => p.stock < 10);
    }
    if (categoryFilter !== "all") {
      result = result.filter((p) => (p.category || "") === categoryFilter);
    }
    return result;
  }, [currentList, filter, lowStockOnly, categoryFilter]);

  const adjustStock = (id: string, delta: number) => {
    if (!editing || !draft) return;
    setDraft((prev) =>
      (prev || []).map((p) => {
        if (p.id === id) {
          const newStock = Math.max(0, p.stock + delta);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
  };

  const setStockValue = (id: string, value: number) => {
    if (!editing || !draft) return;
    const newStock = Math.max(0, value);
    setDraft((prev) =>
      (prev || []).map((p) => (p.id === id ? { ...p, stock: newStock } : p))
    );
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return "out-of-stock";
    if (stock < 5) return "critical";
    if (stock < 10) return "low";
    return "normal";
  };

  const getStockStatusText = (stock: number) => {
    if (stock === 0) return "Sin stock";
    if (stock < 5) return "Crítico";
    if (stock < 10) return "Bajo";
    return "Normal";
  };

  const currency = (n: number) =>
    n.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    });

  // Save changes to backend
  const saveStockChanges = async () => {
    if (!draft) return;
    setLoading(true);
    try {
      // Only update products whose stock changed
      const updates = draft.filter((d, i) => d.stock !== products[i]?.stock);
      await Promise.all(
        updates.map((p) =>
          productService.updateProduct(p.id, { stock: p.stock })
        )
      );
      setProducts(draft);
      setSuccessMessage("Cambios de stock guardados");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (e) {
      setSuccessMessage("Error al guardar los cambios de stock");
    } finally {
      setEditing(false);
      setDraft(null);
      setLoading(false);
    }
  };

  return (
    <div className="receiver-dashboard">
      <h1>Gestión de Stock</h1>
      <p className="subtitle">
        Panel de recepcionista - Control y ajuste de inventario
      </p>

      <SuccessMessage message={successMessage} onClose={() => setSuccessMessage("")} />

      {/* Edit controls */}
      <section className="panel" style={{ display: "none" }}>
        <div className="panel-header">
          <h2>Edición</h2>
        </div>
        <div className="panel-body" style={{ display: "flex", gap: 8 }}>
          {!editing && (
            <button
              className="btn primary"
              onClick={() => {
                setDraft(JSON.parse(JSON.stringify(products)));
                setEditing(true);
              }}
            >
              Modificar stock
            </button>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Filtros de inventario</h2>
        </div>
        <div className="panel-body">
          <div className="filters-grid">
            <label>
              <span className="span-rec">Buscar producto</span>
              <input
                className="input-admin"
                placeholder="Buscar por nombre o categoría"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </label>

            <label>
              <span className="span-rec">Categoría</span>
              <select
                className="input-admin"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">Todas las categorías</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            <label className="checkbox">
              <input
                type="checkbox"
                checked={lowStockOnly}
                onChange={(e) => setLowStockOnly(e.target.checked)}
              />
              <span className="span-rec">Mostrar solo stock bajo</span>
            </label>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Inventario ({filteredProducts.length} productos)</h2>
          <div className="summary">
            <span className="summary-item">
              Total productos: <strong>{products.length}</strong>
            </span>
            <span className="summary-item">
              Stock bajo:{" "}
              <strong className="warn">
                {products.filter((p) => p.stock < 10).length}
              </strong>
            </span>
            <span className="summary-item">
              Sin stock:{" "}
              <strong className="danger">
                {products.filter((p) => p.stock === 0).length}
              </strong>
            </span>
          </div>
          {!editing && (
            <button
              className="btn primary"
              onClick={() => {
                setDraft(JSON.parse(JSON.stringify(products)));
                setEditing(true);
              }}
            >
              Modificar stock
            </button>
          )}
        </div>
        <div className="panel-body">
          <table className="data-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Talles</th>
                <th>Estado</th>
                <th>Stock actual</th>
                <th>Ajustar stock</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className={`stock-${getStockStatus(product.stock)}`}
                >
                  <td>
                    <div className="product-name">{product.name}</div>
                    <div className="product-price">
                      {currency(product.price)}
                    </div>
                  </td>
                  <td>{product.category || "-"}</td>
                  <td>
                    {product.sizes && product.sizes.length
                      ? product.sizes.join(", ")
                      : "-"}
                  </td>
                  <td>
                    <span
                      className={`status-badge status-${getStockStatus(product.stock)}`}
                    >
                      {getStockStatusText(product.stock)}
                    </span>
                  </td>
                  <td>
                    <div className="stock-display">
                      <span className="stock-number">{product.stock}</span>
                      unidades
                    </div>
                  </td>
                  <td>
                    <div className="stock-controls">
                      <div className="quick-adjust">
                        <button
                          className="btn stock-btn"
                          onClick={() => adjustStock(product.id, -1)}
                          disabled={!editing || product.stock <= 0}
                        >
                          -
                        </button>
                        <button
                          className="btn stock-btn"
                          onClick={() => adjustStock(product.id, 1)}
                          disabled={!editing}
                        >
                          +
                        </button>
                      </div>

                      <div className="set-stock">
                        <input
                          type="number"
                          min="0"
                          value={product.stock}
                          onChange={(e) =>
                            setStockValue(
                              product.id,
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="stock-input"
                          disabled={!editing}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{ textAlign: "center", color: "#bdbdbd" }}
                  >
                    No hay productos para mostrar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {editing && (
            <div
              style={{
                marginTop: 12,
                display: "flex",
                gap: 8,
                justifyContent: "flex-end",
              }}
            >
              <button
                className="btn"
                onClick={() => {
                  setEditing(false);
                  setDraft(null);
                }}
              >
                Cancelar
              </button>
              <button
                className="btn primary"
                onClick={saveStockChanges}
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Alertas de stock crítico</h2>
        </div>
        <div className="panel-body">
          {products.filter((p) => p.stock < 5).length > 0 ? (
            <div className="alerts-list">
              {products
                .filter((p) => p.stock < 5)
                .sort((a, b) => a.stock - b.stock)
                .map((product) => (
                  <div key={product.id} className="alert-item">
                    <div className="alert-info">
                      <span className="alert-product">{product.name}</span>
                      <span className="alert-category">{product.category}</span>
                    </div>
                    <div className="alert-stock">
                      <span
                        className={`stock-indicator ${getStockStatus(product.stock)}`}
                      >
                        {product.stock} unidades
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="no-alerts">No hay alertas de stock crítico</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ReceptionistStock;
