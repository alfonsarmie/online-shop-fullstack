import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import '../styles/admin-orders.css';

type Category = {
  id: number;
  name: string;
  description?: string;
};



const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState('');
  const [creating, setCreating] = useState<Omit<Category, 'id'>>({ name: '', description: '' });
  // Bulk edit mode (igual a productos/pedidos)
  const [editMode, setEditMode] = useState(false);
  const [edited, setEdited] = useState<Category[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);


  // Render categories from backend on mount
  useEffect(() => {
    axios.get('/api/categories')
      .then(res => {
        console.log('Respuesta backend categorías:', res.data);
        // Si el backend devuelve { categories: [...] }
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else if (res.data && Array.isArray(res.data.categories)) {
          setCategories(res.data.categories);
        } else {
          setCategories([]);
        }
      })
      .catch(() => setCategories([]));
  }, []);

  const view = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const source = editMode ? edited : categories;
    if (!Array.isArray(source)) return [];
    if (!q) return source;
    return source.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q) ||
      c.id.toString().includes(q)
    );
  }, [categories, edited, editMode, filter]);

  const startBulkEdit = () => {
    // Copia editable
    setEdited(categories.map(c => ({ ...c })));
    setEditMode(true);
  };

  const cancelBulkEdit = () => {
    setEdited([]);
    setEditMode(false);
  };

  const onEditedChange = <K extends keyof Omit<Category,'id'>>(
    id: number,
    key: K,
    value: Omit<Category, 'id'>[K]
  ) => {
    if (!editMode) return;
    setEdited(prev => prev.map(c => c.id === id ? { ...c, [key]: value } as Category : c));
  };


  const saveBulkChanges = async () => {
    // Actualiza todas las categorías editadas en el backend
    await Promise.all(edited.map(async (cat) => {
      await axios.put(`/api/categories/${cat.id}`, cat);
    }));
    setCategories(edited);
    setEditMode(false);
  };


  const create = async () => {
    const name = creating.name.trim();
    if (!name) return;
    const res = await axios.post('/api/categories', {
      name,
      description: creating.description?.trim(),
    });
    if (res.status === 201 || res.status === 200) {
      setCategories(prev => [...prev, res.data]);
      setCreating({ name: '', description: '' });
    }
  };

  const confirmDelete = (c: Category) => setDeleteTarget(c);

  const deleteCategory = async (id: number) => {
    await axios.delete(`/api/categories/${id}`);
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="admin-orders">
      <h1>Gestión de categorías</h1>
      <p className="subtitle">Crear, editar y eliminar categorías de productos</p>

      {/* Crear nueva */}
      <section className="panel">
        <div className="panel-header">
          <h2>Crear nueva categoría</h2>
        </div>
        <div className="panel-body">
          <div className="filters-grid">
            <label>
              <span className="span-admin">Nombre</span>
              <input
                className="input-admin"
                value={creating.name}
                onChange={e => setCreating(v => ({ ...v, name: e.target.value }))}
              />
            </label>
            <label>
              <span className="span-admin">Descripción</span>
              <input
                className="input-admin"
                value={creating.description || ''}
                onChange={e => setCreating(v => ({ ...v, description: e.target.value }))}
              />
            </label>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="btn primary" onClick={create}>Crear categoría</button>
          </div>
        </div>
      </section>

      {/* Listado */}
      <section className="panel">
        <div className="panel-header">
          <h2>Categorías ({view.length})</h2>
          <div className="tools">
            <input
              className="input-admin"
              placeholder="Buscar por nombre o descripción"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{ minWidth: 260 }}
            />
            {!editMode && (
              <button className="btn primary" onClick={startBulkEdit}>Modificar categorías</button>
            )}
          </div>
        </div>
        <div className="panel-body">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {view.map(c => (
                <tr key={c.id}>
                  <td>#{c.id}</td>
                  <td>
                    {editMode ? (
                      <input
                        className="input-admin"
                        value={c.name}
                        onChange={e => onEditedChange(c.id, 'name', e.target.value)}
                      />
                    ) : (c.name)}
                  </td>
                  <td>
                    {editMode ? (
                      <input
                        className="input-admin"
                        value={c.description || ''}
                        onChange={e => onEditedChange(c.id, 'description', e.target.value)}
                      />
                    ) : (c.description || '-')}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="btn danger" disabled={editMode} onClick={() => confirmDelete(c)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
              {view.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: '#bdbdbd' }}>No hay categorías para mostrar</td>
                </tr>
              )}
            </tbody>
          </table>
          {editMode && (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
              <button className="btn" onClick={cancelBulkEdit}>Cancelar</button>
              <button className="btn primary" onClick={saveBulkChanges}>Guardar cambios</button>
            </div>
          )}
        </div>
      </section>

      {/* Modal de confirmación */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Eliminar categoría #{deleteTarget.id}</h2>
              <button className="btn-close" onClick={() => setDeleteTarget(null)}>×</button>
            </div>
            <div className="modal-body">
              <p className="modal-warning">¿Estás seguro de eliminar "{deleteTarget.name}"? Esta acción es irreversible.</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button className="btn" onClick={() => setDeleteTarget(null)}>Cancelar</button>
                <button className="btn danger" onClick={() => { deleteCategory(deleteTarget.id); setDeleteTarget(null); }}>Eliminar definitivamente</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
