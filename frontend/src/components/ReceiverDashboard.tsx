// ReceiverDashboard.tsx (corregido)
/**
 * ReceiverDashboard
 * Purpose: Stock management for receivers (view products, adjust stock).
 * Notes:
 *  - Uses the same product data as AdminProducts but with a simplified interface
 *  - Focuses only on stock management without edit/delete capabilities
 *  - Maintains the dark admin look & feel
 */
import React, { useEffect, useMemo, useState } from 'react';
import '../styles/receiver-dashboard.css';
import { Product } from '../types/product';
import seed from '../data/products';

const STORAGE_KEY = 'adminProducts';

function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return seed as Product[];
}

function saveProducts(data: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const ReceiverDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const data = loadProducts();
    setProducts(data);
  }, []);

  useEffect(() => {
    if (products.length) saveProducts(products);
  }, [products]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = products
      .map(p => p.category)
      .filter(Boolean)
      .filter((cat, index, arr) => arr.indexOf(cat) === index);
    return cats.sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products;
    
    // Filter by search text
    if (filter.trim()) {
      const q = filter.trim().toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
      );
    }
    
    // Filter by low stock
    if (lowStockOnly) {
      result = result.filter(p => p.stock < 10);
    }
    
    // Filter by category
    if (categoryFilter !== 'all') {
      result = result.filter(p => p.category === categoryFilter);
    }
    
    return result;
  }, [products, filter, lowStockOnly, categoryFilter]);

  const adjustStock = (id: number, delta: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newStock = Math.max(0, p.stock + delta);
        return { ...p, stock: newStock };
      }
      return p;
    }));
    
    // Show success message
    const product = products.find(p => p.id === id);
    if (product) {
      setSuccessMessage(`Stock de ${product.name} actualizado correctamente`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const setStockValue = (id: number, value: number) => {
    const newStock = Math.max(0, value);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
    
    // Show success message
    const product = products.find(p => p.id === id);
    if (product) {
      setSuccessMessage(`Stock de ${product.name} establecido a ${newStock}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return 'out-of-stock';
    if (stock < 5) return 'critical';
    if (stock < 10) return 'low';
    return 'normal';
  };

  const getStockStatusText = (stock: number) => {
    if (stock === 0) return 'Sin stock';
    if (stock < 5) return 'Crítico';
    if (stock < 10) return 'Bajo';
    return 'Normal';
  };

  const currency = (n: number) =>
    n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

  return (
    <div className="receiver-dashboard">
      <h1>Gestión de Stock</h1>
      <p className="subtitle">Panel de recepcionista - Control y ajuste de inventario</p>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <section className="panel">
        <div className="panel-header">
          <h2>Filtros de inventario</h2>
        </div>
        <div className="panel-body">
          <div className="filters-grid">
            <label>
              <span className="span-admin">Buscar producto</span>
              <input 
                className="input-admin" 
                placeholder="Buscar por nombre o categoría"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              />
            </label>
            
            <label>
              <span className="span-admin">Categoría</span>
              <select 
                className="input-admin"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              >
                <option value="all">Todas las categorías</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>
            
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={lowStockOnly}
                onChange={e => setLowStockOnly(e.target.checked)}
              />
              <span>Mostrar solo stock bajo</span>
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
              Stock bajo: <strong className="warn">{products.filter(p => p.stock < 10).length}</strong>
            </span>
            <span className="summary-item">
              Sin stock: <strong className="danger">{products.filter(p => p.stock === 0).length}</strong>
            </span>
          </div>
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
              {filteredProducts.map(product => (
                <tr key={product.id} className={`stock-${getStockStatus(product.stock)}`}>
                  <td>
                    <div className="product-name">{product.name}</div>
                    <div className="product-price">{currency(product.price)}</div>
                  </td>
                  <td>{product.category || '-'}</td>
                  <td>{product.sizes.length ? product.sizes.join(', ') : '-'}</td>
                  <td>
                    <span className={`status-badge status-${getStockStatus(product.stock)}`}>
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
                          disabled={product.stock <= 0}
                        >
                          -
                        </button>
                        <button 
                          className="btn stock-btn"
                          onClick={() => adjustStock(product.id, 1)}
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="set-stock">
                        <input 
                          type="number" 
                          min="0"
                          value={product.stock}
                          onChange={e => setStockValue(product.id, parseInt(e.target.value) || 0)}
                          className="stock-input"
                        />
                        <button 
                          className="btn primary"
                          onClick={() => {
                            // Force update in case input was changed without blur
                            setStockValue(product.id, product.stock);
                          }}
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#bdbdbd' }}>
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
          {products.filter(p => p.stock < 5).length > 0 ? (
            <div className="alerts-list">
              {products
                .filter(p => p.stock < 5)
                .sort((a, b) => a.stock - b.stock)
                .map(product => (
                  <div key={product.id} className="alert-item">
                    <div className="alert-info">
                      <span className="alert-product">{product.name}</span>
                      <span className="alert-category">{product.category}</span>
                    </div>
                    <div className="alert-stock">
                      <span className={`stock-indicator ${getStockStatus(product.stock)}`}>
                        {product.stock} unidades
                      </span>
                    </div>
                    <div className="alert-actions">
                      <button 
                        className="btn primary"
                        onClick={() => setStockValue(product.id, 10)}
                      >
                        Reponer a 10
                      </button>
                    </div>
                  </div>
                ))
              }
            </div>
          ) : (
            <p className="no-alerts">No hay alertas de stock crítico</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ReceiverDashboard;