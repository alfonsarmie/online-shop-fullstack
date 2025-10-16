import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import "../styles/admin-orders.css";
import SuccessMessage from "../components/SuccessMessage";
import ErrorMessage from "../components/ErrorMessage";

type Category = {
  idCategory: number;
  name: string;
};

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState(""); // Search filter
  const [creating, setCreating] = useState<Omit<Category, "idCategory">>({
    name: "",
  });
  const [editMode, setEditMode] = useState(false); // Boolean to indicate if we are in edit mode
  const [edited, setEdited] = useState<Category[]>([]); // Editable copy of categories
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null); // Category to delete
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch categories from backend
  useEffect(() => {
    api
      .get("/categories")
      .then((res) => {
        console.log("Respuesta backend categorías:", res.data); // Debug log
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

  // Filtered and/or edited view of categories
  const view = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const source = editMode ? edited : categories;
    if (!Array.isArray(source)) return [];
    if (!q) return source;
    return source.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.idCategory.toString().includes(q)
    );
  }, [categories, edited, editMode, filter]);

  // Start bulk editing
  const startBulkEdit = () => {
    // Editable copy
    setEdited(categories.map((c) => ({ ...c })));
    setEditMode(true);
  };

  // Cancel bulk editing
  const cancelBulkEdit = () => {
    setEdited([]);
    setEditMode(false);
  };

  // Handle changes in editable fields
  const onEditedChange = (idCategory: number, key: "name", value: string) => {
    if (!editMode) return;
    setEdited((prev) =>
      prev.map((c) =>
        c.idCategory === idCategory ? { ...c, [key]: value } : c
      )
    );
  };

  // Save all changes to backend
  const saveBulkChanges = async () => {
    try {
      await Promise.all(
        edited.map(async (cat) => {
          await api.put(`/categories/${cat.idCategory}`, cat);
        })
      );
      setCategories(edited);
      setEditMode(false);
      setSuccessMessage("Cambios guardados exitosamente.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      setErrorMessage(
        "No se pudieron guardar los cambios. Intente nuevamente."
      );
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  // Create a new category
  const create = async () => {
    const name = creating.name.trim();
    if (!name) return;

    try {
      const res = await api.post("/categories", { name });
      if (res.status === 201 || res.status === 200) {
        setCategories((prev) => [...prev, res.data]);
        setCreating({ name: "" });
        setSuccessMessage("Categoría creada exitosamente.");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error al crear categoría:", error);
      setErrorMessage("No se pudo crear la categoría. Intente nuevamente.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  // Confirm deletion of a category
  const confirmDelete = (c: Category) => setDeleteTarget(c);

  // Delete a category
  const deleteCategory = async (idCategory: number) => {
    try {
      await api.delete(`/categories/${idCategory}`);
      setCategories((prev) => prev.filter((c) => c.idCategory !== idCategory));
      setSuccessMessage("Categoría eliminada exitosamente.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      console.error("Error al eliminar categoría:", error);
      let backendMsg =
        error.response?.data?.error?.toLowerCase() ||
        error.message?.toLowerCase() ||
        "";

      // Si el mensaje del backend o el status code indica error de integridad, mostrar mensaje personalizado
      const isIntegrityError =
        backendMsg.includes("integridad referencial") ||
        backendMsg.includes("foreign key") ||
        backendMsg.includes("constraint") ||
        (error.response?.status === 500 && backendMsg.includes("error interno"));

      if (isIntegrityError) {
        setErrorMessage(
          "No se puede eliminar la categoría porque tiene productos asociados."
        );
      } else {
        setErrorMessage(
          backendMsg || "No se pudo eliminar la categoría. Intente nuevamente."
        );
      }
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <div className="page-with-nav-spacing admin-surface">
      <div className="admin-orders">
      <SuccessMessage
        message={successMessage ?? ""}
        onClose={() => setSuccessMessage(null)}
      />
      <ErrorMessage
        message={errorMessage ?? ""}
        onClose={() => setErrorMessage(null)}
      />
      <h1>Gestión de categorías</h1>
      <p className="subtitle">
        Crear, editar y eliminar categorías de productos
      </p>

      {/* Crear nueva categoría */}
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
                onChange={(e) =>
                  setCreating((v) => ({ ...v, name: e.target.value }))
                }
                placeholder="Nombre de la categoría"
              />
            </label>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button className="btn primary" onClick={create}>
              Crear categoría
            </button>
          </div>
        </div>
      </section>

      {/* Listado de categorías */}
      <section className="panel">
        <div className="panel-header">
          <h2>Categorías ({view.length})</h2>
          <div className="tools">
            <input
              className="input-admin"
              placeholder="Buscar por nombre o ID"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ minWidth: 260 }}
            />
            {!editMode && (
              <button className="btn primary" onClick={startBulkEdit}>
                Modificar categorías
              </button>
            )}
          </div>
        </div>
        <div className="panel-body">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {view.map((c) => (
                <tr key={c.idCategory}>
                  <td>#{c.idCategory}</td>
                  <td>
                    {editMode ? (
                      <input
                        className="input-admin"
                        value={c.name}
                        onChange={(e) =>
                          onEditedChange(c.idCategory, "name", e.target.value)
                        }
                      />
                    ) : (
                      c.name
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="btn danger"
                        disabled={editMode}
                        onClick={() => confirmDelete(c)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {view.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    style={{ textAlign: "center", color: "#bdbdbd" }}
                  >
                    No hay categorías para mostrar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {editMode && (
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "flex-end",
                marginTop: 12,
              }}
            >
              <button className="btn" onClick={cancelBulkEdit}>
                Cancelar
              </button>
              <button className="btn primary" onClick={saveBulkChanges}>
                Guardar cambios
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modal de confirmación */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Eliminar categoría #{deleteTarget.idCategory}</h2>
              <button
                className="btn-close"
                onClick={() => setDeleteTarget(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-warning">
                ¿Estás seguro de eliminar "{deleteTarget.name}"? Esta acción es
                irreversible.
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button className="btn" onClick={() => setDeleteTarget(null)}>
                  Cancelar
                </button>
                <button
                  className="btn danger"
                  onClick={() => {
                    deleteCategory(deleteTarget.idCategory);
                    setDeleteTarget(null);
                  }}
                >
                  Eliminar definitivamente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminCategories;
