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
  | 'shipped' 
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
    status: 'shipped',
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

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'processing', label: 'Procesando' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' }
];

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const data = loadOrders();
    setOrders(data);
  }, []);

  useEffect(() => {
    if (orders.length) saveOrders(orders);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let result = orders;
    
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
  }, [orders, filter, statusFilter]);

  const updateOrderStatus = (id: number, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));
  };

  const deleteOrder = (id: number) => {
    if (!confirm('¿Eliminar este pedido?')) return;
    setOrders(prev => prev.filter(order => order.id !== id));
  };

  const getStatusClass = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
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
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <button 
                        className="btn danger" 
                        onClick={() => deleteOrder(order.id)}
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
    </div>
  );
};

export default AdminOrders;