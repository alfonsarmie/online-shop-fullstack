// AdminOrders.tsx
/**
 * AdminOrders
 * Purpose: CRUD management for orders (read, update status, delete).
 * Notes:
 *  - Uses localStorage to persist changes as a placeholder for a real backend.
 *  - Keeps the dark admin look & feel consistent with the dashboard and products.
 */
import React, { useEffect, useMemo, useState } from 'react';
import '../styles/admin-orders.css';

type Order = {
  id: number;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;
  address: string;
  paymentMethod: string;
};

type OrderItem = {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  size: string;
};

type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'delivered'
  | 'cancelled';

const STORAGE_KEY = 'adminOrders';

// Mock data for initial orders
const initialOrders: Order[] = [
  {
    id: 1001,
    customerName: 'Juan Pérez',
    customerEmail: 'juan.perez@email.com',
    items: [
      { productId: 1, productName: 'Camiseta Titular 24/25', quantity: 2, price: 25000, size: 'M' },
      { productId: 3, productName: 'Pantalón Deportivo', quantity: 1, price: 18000, size: 'L' }
    ],
    total: 68000,
    status: 'confirmed',
    date: '2023-11-15',
    address: 'Av. Corrientes 1234, CABA',
    paymentMethod: 'MercadoPago'
  },
  {
    id: 1002,
    customerName: 'María García',
    customerEmail: 'maria.garcia@email.com',
    items: [
      { productId: 2, productName: 'Buzo Entrenamiento', quantity: 1, price: 31000, size: 'S' }
    ],
    total: 31000,
    status: 'processing',
    date: '2023-11-16',
    address: 'Lavalle 567, CABA',
    paymentMethod: 'Tarjeta de crédito'
  },
  {
    id: 1003,
    customerName: 'Carlos López',
    customerEmail: 'carlos.lopez@email.com',
    items: [
      { productId: 1, productName: 'Camiseta Titular 24/25', quantity: 1, price: 25000, size: 'XL' },
      { productId: 4, productName: 'Medias Oficiales', quantity: 2, price: 5000, size: 'Único' }
    ],
    total: 35000,
    status: 'confirmed',
    date: '2023-11-14',
    address: 'Cabildo 2345, CABA',
    paymentMethod: 'Transferencia'
  },
  {
    id: 1004,
    customerName: 'Ana Rodríguez',
    customerEmail: 'ana.rodriguez@email.com',
    items: [
      { productId: 5, productName: 'Gorra Oficial', quantity: 1, price: 12000, size: 'Único' }
    ],
    total: 12000,
    status: 'delivered',
    date: '2023-11-10',
    address: 'Av. Santa Fe 3456, CABA',
    paymentMethod: 'MercadoPago'
  },
  {
    id: 1005,
    customerName: 'Luis Martínez',
    customerEmail: 'luis.martinez@email.com',
    items: [
      { productId: 3, productName: 'Pantalón Deportivo', quantity: 2, price: 18000, size: 'M' }
    ],
    total: 36000,
    status: 'pending',
    date: '2023-11-17',
    address: 'Av. Rivadavia 4567, CABA',
    paymentMethod: 'Tarjeta de débito'
  }
];

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return initialOrders;
}

function saveOrders(data: Order[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Order of statuses as requested: pendiente, confirmado, entregado, cambiado, cancelado
const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'delivered', label: 'Entregado' },
  { value: 'processing', label: 'Cambiado' },
  { value: 'cancelled', label: 'Cancelado' },
];

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedOrders, setEditedOrders] = useState<Order[]>([]);

  useEffect(() => {
    const data = loadOrders();
    setOrders(data);
  }, []);

  useEffect(() => {
    if (orders.length) saveOrders(orders);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    // When editing, operate on the draft copy
    let source = editMode ? editedOrders : orders;
    let result = source;
    
    // Filter by search text
    if (filter.trim()) {
      const q = filter.trim().toLowerCase();
      result = result.filter(order => 
        order.customerName.toLowerCase().includes(q) ||
        order.customerEmail.toLowerCase().includes(q) ||
        order.id.toString().includes(q)
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    return result;
  }, [orders, editedOrders, editMode, filter, statusFilter]);

  const updateOrderStatus = (id: number, newStatus: OrderStatus) => {
    if (!editMode) return; // Only allow changes in edit mode
    setEditedOrders(prev => prev.map(order =>
      order.id === id ? { ...order, status: newStatus } : order
    ));
  };

  const startEdit = () => {
    setEditedOrders(orders.map(o => ({ ...o, items: o.items.map(i => ({ ...i })) })));
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditedOrders([]);
    setEditMode(false);
  };

  const saveChanges = () => {
    setOrders(editedOrders);
    setEditMode(false);
  };

  const confirmDelete = (order: Order) => {
    setDeleteTarget(order);
  };

  const deleteOrder = (id: number) => {
    setOrders(prev => prev.filter(order => order.id !== id));
  };

  const getStatusClass = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'processing': return 'status-processing';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    return statusOptions.find(opt => opt.value === status)?.label || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  const currency = (n: number) =>
    n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

  return (
    <div className="admin-orders">
      <h1>Gestión de pedidos</h1>
      <p className="subtitle">Visualizar, actualizar estado y gestionar pedidos</p>

      <section className="panel">
        <div className="panel-header">
          <h2>Filtros</h2>
        </div>
        <div className="panel-body">
          <div className="filters-grid">
            <label>
              <span className="span-admin">Buscar</span>
              <input 
                className="input-admin" 
                placeholder="Buscar por cliente, email o ID"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              />
            </label>
            <label>
              <span className="span-admin">Estado</span>
              <select 
                className="input-admin"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as OrderStatus | 'all')}
              >
                <option value="all">Todos los estados</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Pedidos ({filteredOrders.length})</h2>
          {!editMode && (
            <button className="btn primary" onClick={startEdit}>Modificar estados</button>
          )}
        </div>
        <div className="panel-body">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    <div>{order.customerName}</div>
                    <div className="text-muted">{order.customerEmail}</div>
                  </td>
                  <td>{formatDate(order.date)}</td>
                  <td>
                    {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                    <button 
                      className="btn-link"
                      onClick={() => setSelectedOrder(order)}
                    >
                      Ver detalles
                    </button>
                  </td>
                  <td>{currency(order.total)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <select
                        value={order.status}
                        onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="status-select"
                        disabled={!editMode}
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <button
                        className="btn danger"
                        onClick={() => confirmDelete(order)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#bdbdbd' }}>
                    No hay pedidos para mostrar
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {editMode && (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
              <button className="btn" onClick={cancelEdit}>Cancelar</button>
              <button className="btn primary" onClick={saveChanges}>Guardar cambios</button>
            </div>
          )}
        </div>
      </section>

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalles del pedido #{selectedOrder.id}</h2>
              <button className="btn-close" onClick={() => setSelectedOrder(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="order-details-grid">
                <div>
                  <h3>Información del cliente</h3>
                  <p><strong>Nombre:</strong> {selectedOrder.customerName}</p>
                  <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                  <p><strong>Dirección:</strong> {selectedOrder.address}</p>
                  <p><strong>Método de pago:</strong> {selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <h3>Detalles del pedido</h3>
                  <p><strong>Fecha:</strong> {formatDate(selectedOrder.date)}</p>
                  <p>
                    <strong>Estado:</strong>{' '}
                    <span className={`status-badge ${getStatusClass(selectedOrder.status)}`}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </p>
                  <p><strong>Total:</strong> {currency(selectedOrder.total)}</p>
                </div>
              </div>
              
              <h3>Productos</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Talle</th>
                    <th>Cantidad</th>
                    <th>Precio unit.</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.productName}</td>
                      <td>{item.size}</td>
                      <td>{item.quantity}</td>
                      <td>{currency(item.price)}</td>
                      <td>{currency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Eliminar pedido #{deleteTarget.id}</h2>
              <button className="btn-close" onClick={() => setDeleteTarget(null)}>×</button>
            </div>
            <div className="modal-body">
              <p className="modal-warning">
                ¿Estás seguro de eliminar el pedido #{deleteTarget.id} de {deleteTarget.customerName}? Esta acción es irreversible.
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button className="btn" onClick={() => setDeleteTarget(null)}>Cancelar</button>
                <button
                  className="btn danger"
                  onClick={() => {
                    deleteOrder(deleteTarget.id);
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
  );
};

export default AdminOrders;
