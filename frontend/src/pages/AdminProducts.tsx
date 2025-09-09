/**
 * AdminProducts
 * Purpose: CRUD management for products (create, read, update, delete) and stock adjustments.
 * Notes:
 *  - Uses localStorage to persist changes as a placeholder for a real backend.
 *  - Seeds from `data/products` if no prior data exists in storage.
 *  - Keeps the dark admin look & feel consistent with the dashboard.
 */
import React, { useEffect, useMemo, useState } from 'react';
import '../styles/admin-products.css';
import { Product } from '../types/product';
import seed from '../data/products';

type Draft = Omit<Product, 'id' | 'img' | 'img2' | 'img3'> & {
  img?: string;
  img2?: string;
  img3?: string;
};

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

const emptyDraft: Draft = {
  name: '',
  price: 0,
  description: '',
  sizes: [],
  stock: 0,
  category: '',
  color: '',
};

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState('');
  const [creating, setCreating] = useState<Draft>(emptyDraft);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editing, setEditing] = useState<Draft>(emptyDraft);

  useEffect(() => {
    const data = loadProducts();
    setProducts(data);
  }, []);

  useEffect(() => {
    if (products.length) saveProducts(products);
  }, [products]);

  const view = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return products;
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.color || '').toLowerCase().includes(q)
    );
  }, [products, filter]);

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditing({
      name: p.name,
      price: p.price,
      description: p.description,
      sizes: p.sizes,
      stock: p.stock,
      category: p.category || '',
      color: p.color || '',
      img: p.img,
      img2: p.img2,
      img3: p.img3,
    });
  };

  const applyEdit = (id: number) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...editing } as Product : p)));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const del = (id: number) => {
    if (!confirm('Eliminar este producto?')) return;
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const incStock = (id: number, delta: number) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p)));
  };

  const create = () => {
    // Basic validation
    if (!creating.name.trim()) return alert('Nombre requerido');
    if (creating.price <= 0) return alert('Precio invalido');

    const nextId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newP: Product = {
      id: nextId,
      name: creating.name.trim(),
      price: creating.price,
      img: creating.img || '',
      img2: creating.img2 || '',
      img3: creating.img3,
      description: creating.description.trim(),
      sizes: creating.sizes,
      stock: creating.stock,
      category: creating.category || undefined,
      color: creating.color || undefined,
    };
    setProducts(prev => [newP, ...prev]);
    setCreating(emptyDraft);
  };

  const renderSizes = (sizes: string[]) => (sizes.length ? sizes.join(', ') : '-');

  return (
    <div className="admin-products">
      <h1>Gestión de productos</h1>
      <p className="subtitle">Crear, editar, eliminar y ajustar stock </p>

      <section className="panel">
        <div className="panel-header">
          <h2>Crear nuevo producto</h2>
        </div>
        <div className="panel-body form-grid">
          <label>
            <span>Nombre</span>
            <input value={creating.name} onChange={e => setCreating({ ...creating, name: e.target.value })} />
          </label>
          <label>
            <span>Precio</span>
            <input type="number" value={creating.price} onChange={e => setCreating({ ...creating, price: Number(e.target.value) })} />
          </label>
          <label>
            <span>Color</span>
            <input value={creating.color} onChange={e => setCreating({ ...creating, color: e.target.value })} />
          </label>
          <label>
            <span>Categoría</span>
            <input value={creating.category} onChange={e => setCreating({ ...creating, category: e.target.value })} />
          </label>
          <label className="col-2">
            <span>Descripción</span>
            <textarea rows={3} value={creating.description} onChange={e => setCreating({ ...creating, description: e.target.value })} />
          </label>
          <label>
            <span>Talles (CSV)</span>
            <input placeholder="XS,S,M,L,XL" value={creating.sizes.join(',')} onChange={e => setCreating({ ...creating, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
          </label>
          <label>
            <span>Stock</span>
            <input type="number" value={creating.stock} onChange={e => setCreating({ ...creating, stock: Number(e.target.value) })} />
          </label>
          <label>
            <span>Imagen principal (URL)</span>
            <input value={creating.img || ''} onChange={e => setCreating({ ...creating, img: e.target.value })} />
          </label>
          <label>
            <span>Imagen 2 (URL)</span>
            <input value={creating.img2 || ''} onChange={e => setCreating({ ...creating, img2: e.target.value })} />
          </label>
          <label>
            <span>Imagen 3 (URL)</span>
            <input value={creating.img3 || ''} onChange={e => setCreating({ ...creating, img3: e.target.value })} />
          </label>
          <div className="actions col-2">
            <button className="btn primary" onClick={create}>Crear producto</button>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Inventario</h2>
          <div className="tools">
            <input
              className="search"
              placeholder="Buscar por nombre, categoría o color"
              value={filter}
              onChange={e => setFilter(e.target.value)}
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
              {view.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</td>
                  <td>{p.color || '-'}</td>
                  <td>{p.category || '-'}</td>
                  <td>{renderSizes(p.sizes)}</td>
                  <td>
                    <div className="stock-ctrl">
                      <button className="btn" onClick={() => incStock(p.id, -1)}>-</button>
                      <span className="stock">{p.stock}</span>
                      <button className="btn" onClick={() => incStock(p.id, 1)}>+</button>
                    </div>
                  </td>
                  <td>
                    {editingId === p.id ? (
                      <div className="row-actions">
                        <button className="btn primary" onClick={() => applyEdit(p.id)}>Guardar</button>
                        <button className="btn" onClick={cancelEdit}>Cancelar</button>
                      </div>
                    ) : (
                      <div className="row-actions">
                        <button className="btn" onClick={() => startEdit(p)}>Editar</button>
                        <button className="btn danger" onClick={() => del(p.id)}>Eliminar</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {view.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#bdbdbd' }}>No hay productos para mostrar</td>
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
              <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
            </label>
            <label>
              <span>Precio</span>
              <input type="number" value={editing.price} onChange={e => setEditing({ ...editing, price: Number(e.target.value) })} />
            </label>
            <label>
              <span>Color</span>
              <input value={editing.color || ''} onChange={e => setEditing({ ...editing, color: e.target.value })} />
            </label>
            <label>
              <span>Categoría</span>
              <input value={editing.category || ''} onChange={e => setEditing({ ...editing, category: e.target.value })} />
            </label>
            <label className="col-2">
              <span>Descripción</span>
              <textarea rows={3} value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} />
            </label>
            <label>
              <span>Talles (CSV)</span>
              <input value={editing.sizes.join(',')} onChange={e => setEditing({ ...editing, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
            </label>
            <label>
              <span>Stock</span>
              <input type="number" value={editing.stock} onChange={e => setEditing({ ...editing, stock: Number(e.target.value) })} />
            </label>
            <label>
              <span>Imagen principal (URL)</span>
              <input value={editing.img || ''} onChange={e => setEditing({ ...editing, img: e.target.value })} />
            </label>
            <label>
              <span>Imagen 2 (URL)</span>
              <input value={editing.img2 || ''} onChange={e => setEditing({ ...editing, img2: e.target.value })} />
            </label>
            <label>
              <span>Imagen 3 (URL)</span>
              <input value={editing.img3 || ''} onChange={e => setEditing({ ...editing, img3: e.target.value })} />
            </label>
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminProducts;
