import React, { useEffect, useMemo, useState } from "react";
import "../styles/receiver-dashboard.css";
import { FrontendProduct, Size } from "../types/product";
import { productService } from "../services/productService";
import SuccessMessage from "./SuccessMessage";

const ReceptionistStock: React.FC = () => {
  const [products, setProducts] = useState<FrontendProduct[]>([]);
  // Modal state for per-product size stock editing
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<FrontendProduct | null>(null);
  const [modalSizes, setModalSizes] = useState<Array<Size & { stock?: number }>>([]);
  const [filter, setFilter] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    productService
      .getAllProducts()
      .then((backendProducts) => {
        setProducts(backendProducts);
      })
      .finally(() => setLoading(false));
  }, []);

  const currentList = products;
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
      result = result.filter((p) => (p.stock ?? 0) < 10);
    }
    if (categoryFilter !== "all") {
      result = result.filter((p) => (p.category || "") === categoryFilter);
    }
    return result;
  }, [currentList, filter, lowStockOnly, categoryFilter]);

  // Modal handlers: adjust and set stock values per size within modal
  const adjustSizeStock = (sizeId: number, delta: number) => {
    setModalSizes((prev) =>
      (prev || []).map((s: any) =>
        s.idSize === sizeId ? { ...s, stock: Math.max(0, (s.stock || 0) + delta) } : s
      )
    );
  };

  const setSizeStockValue = (sizeId: number, value: number) => {
    const newStock = Math.max(0, value);
    setModalSizes((prev) =>
      (prev || []).map((s: any) => (s.idSize === sizeId ? { ...s, stock: newStock } : s))
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

  const openModal = (product: FrontendProduct) => {
    setModalProduct(product);
    setModalSizes(
      (product.sizes || []).map((s: any) => ({
        idSize: s.idSize,
        name: s.name,
        sizeDesc: s.sizeDesc,
        stock: s.stock ?? 0,
      }))
    );
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalProduct(null);
    setModalSizes([]);
  };

  const saveModal = async () => {
    if (!modalProduct) return;
    setLoading(true);
    try {
      const oldP = products.find((p) => p.id === modalProduct.id);
      const oldSizes = (oldP?.sizes || []) as any[];
      const calls: Promise<any>[] = [];
      for (const s of modalSizes as any[]) {
        const old = oldSizes.find((os) => os.idSize === s.idSize);
        const oldStock = old?.stock ?? 0;
        const newStock = s.stock ?? 0;
        if (newStock !== oldStock) {
          calls.push(productService.updateProductSizeStock(modalProduct.id, s.idSize, newStock));
        }
      }
      await Promise.all(calls);

      // Update local list
      const updatedProducts = products.map((p) => {
        if (p.id !== modalProduct.id) return p;
        const sizes = (p.sizes || []).map((s: any) => {
          const newS = (modalSizes as any[]).find((ms) => ms.idSize === s.idSize);
          return newS ? { ...s, stock: newS.stock ?? 0 } : s;
        });
        const agg = sizes.reduce((acc: number, s: any) => acc + (s.stock || 0), 0);
        return { ...p, sizes, stock: agg } as FrontendProduct;
      });
      setProducts(updatedProducts);
      setSuccessMessage("Stock por talle actualizado");
      setTimeout(() => setSuccessMessage(""), 2500);
      closeModal();
    } catch (e) {
      setSuccessMessage("Error al actualizar stock por talle");
      setTimeout(() => setSuccessMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const renderSizes = (sizes: any[] | undefined) => {
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

  return (
    <>
    <div className="receiver-dashboard">
      <h1>Gestión de Stock</h1>
      <p className="subtitle">
        Panel de recepcionista - Control y ajuste de inventario
      </p>

      <SuccessMessage message={successMessage} onClose={() => setSuccessMessage("")} />

      {/* Edición ahora se maneja con un modal por producto */}

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

            <label className="checkbox-rec">
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
                {products.filter((p) => (p.stock ?? 0) < 10).length}
              </strong>
            </span>
            <span className="summary-item">
              Sin stock:{" "}
              <strong className="danger">
                {products.filter((p) => (p.stock ?? 0) === 0).length}
              </strong>
            </span>
          </div>
          {/* La edición se realiza por fila con botón "Editar stock" */}
        </div>
        <div className="panel-body">
          <table className="data-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Talles y stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className={`stock-${getStockStatus(product.stock ?? 0)}`}
                >
                  <td>
                    <div className="product-name">{product.name}</div>
                    <div className="product-price">
                      {currency(product.price)}
                    </div>
                  </td>
                  <td>{product.category || "-"}</td>
                  <td>
                    <div className="sizes-stock-editor">
                      {(product.sizes || []).map((s: any) => (
                        <div key={s.idSize} className="size-line" style={{  marginBottom: 4, display: 'flex', justifyContent: 'flex-start' }}>
                          <span className="size-label">{s.sizeDesc || s.name}:</span>
                          <span style={{ marginLeft: 8, opacity: 0.8 }}>{s.stock ?? 0}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status-badge status-${getStockStatus(product.stock ?? 0)}`}
                    >
                      {getStockStatusText(product.stock ?? 0)}
                    </span>
                  </td>
                  <td>
                    <button className="btn primary" onClick={() => openModal(product)}>
                      Editar stock
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
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

      <section className="panel">
        <div className="panel-header">
          <h2>Alertas de stock crítico</h2>
        </div>
        <div className="panel-body">
          {products.filter((p) => (p.stock ?? 0) < 5).length > 0 ? (
            <div className="alerts-list">
              {products
                .filter((p) => (p.stock ?? 0) < 5)
                .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))
                .map((product) => (
                  <div key={product.id} className="alert-item">
                    <div className="alert-info">
                      <span className="alert-product">{product.name}</span>
                      <span className="alert-category">{product.category}</span>
                    </div>
                    <div className="alert-stock">
                      <span
                        className={`stock-indicator ${getStockStatus(product.stock ?? 0)}`}
                      >
                        {(product.stock ?? 0)} unidades
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
    </div>Eliminar método de pago de la visualización de pedidos y mejorar estilos de modal y tabla de datosActualizar modal de edición de stock: cambiar "Editar talles" a "Editar stock" y mejorar estilos del modal
    {modalOpen && modalProduct && (
      <div className="stock-modal-overlay">
        <div className="stock-modal">
          <div className="stock-modal-header">
            <div>
              <p className="modal-eyebrow">Inventario</p>
              <h3>Editar {modalProduct?.name}</h3>
              <p className="modal-sub">Ajusta el stock por talle </p>
            </div>
            <button className="btn close-btn" onClick={closeModal} aria-label="Cerrar modal">×</button>
          </div>

          <div className="stock-sizes-grid">
            {modalSizes.length > 0 ? (
              modalSizes.map((s) => (
                <div key={s.idSize} className="stock-size-card">
                  <div className="size-label">{s.sizeDesc || s.name}</div>
                  <div className="stock-control">
                    <button className="btn stock-btn" onClick={() => adjustSizeStock(s.idSize, -1)} disabled={(s.stock ?? 0) <= 0}>-</button>
                    <input
                      type="number"
                      min={0}
                      className="stock-input"
                      value={s.stock ?? 0}
                      onChange={(e) => setSizeStockValue(s.idSize, parseInt(e.target.value) || 0)}
                    />
                    <button className="btn stock-btn" onClick={() => adjustSizeStock(s.idSize, 1)}>+</button>
                  </div>
                  <div className="stock-hint">Stock actual: {s.stock ?? 0} u.</div>
                </div>
              ))
            ) : (
              <p className="no-sizes">Este producto no tiene talles asignados.</p>
            )}
          </div>

          <div className="modal-actions modal-actions-stock">
            <button className="btn primary" onClick={saveModal} disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default ReceptionistStock;
