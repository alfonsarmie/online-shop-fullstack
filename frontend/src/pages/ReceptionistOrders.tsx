/**
 * ReceptionistOrders
 * Shows pending orders to deliver and a secondary list of orders delivered today.
 * Uses localStorage key 'adminOrders' shared with admin pages. Seeds mock orders if missing.
 */
import React, { useEffect, useMemo, useState } from 'react';
import '../styles/receptionist-orders.css';

type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

type OrderItem = {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  size: string;
};

type Order = {
  id: number;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string; // ISO date when created
  address: string;
  paymentMethod: string;
  deliveredAt?: string; // ISO datetime when marked delivered
};

const STORAGE_KEY = 'adminOrders';

const todayIsoDate = () => new Date().toISOString().slice(0, 10);
const nowIso = () => new Date().toISOString();

// Seed examples: 2 pending + 1 delivered today
const initialOrders: Order[] = [
  {
    id: 3001,
    customerName: 'Juan Perez',
    customerEmail: 'juan.perez@example.com',
    items: [
      { productId: 1, productName: 'Camiseta Titular 24/25', quantity: 1, price: 25000, size: 'M' },
      { productId: 4, productName: 'Medias Oficiales', quantity: 2, price: 5000, size: 'Unico' }
    ],
    total: 35000,
    status: 'pending',
    date: todayIsoDate(),
    address: 'Av. Corrientes 1234, CABA',
    paymentMethod: 'MercadoPago'
  },
  {
    id: 3002,
    customerName: 'Maria Garcia',
    customerEmail: 'maria.garcia@example.com',
    items: [
      { productId: 2, productName: 'Buzo Entrenamiento', quantity: 1, price: 31000, size: 'S' }
    ],
    total: 31000,
    status: 'pending',
    date: todayIsoDate(),
    address: 'Lavalle 567, CABA',
    paymentMethod: 'Tarjeta de credito'
  },
  {
    id: 3003,
    customerName: 'Carlos Lopez',
    customerEmail: 'carlos.lopez@example.com',
    items: [
      { productId: 9, productName: 'Llavero Oficial', quantity: 1, price: 3000, size: 'Unico' }
    ],
    total: 3000,
    status: 'delivered',
    date: todayIsoDate(),
    deliveredAt: nowIso(),
    address: 'Cabildo 2345, CABA',
    paymentMethod: 'Efectivo'
  }
];

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const data: Order[] = Array.isArray(parsed) ? parsed : [];

      // Nothing stored: seed all
      if (data.length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialOrders));
        return initialOrders;
      }

      // Ensure we always have at least one pending and one delivered today for demo
      const today = new Date();
      const hasPending = data.some(o => o.status === 'pending');
      const hasDeliveredToday = data.some(o => o.status === 'delivered' && o.deliveredAt && sameDay(new Date(o.deliveredAt), today));

      let merged = data.slice();
      const existingIds = new Set(merged.map(o => o.id));

      if (!hasPending) {
        const pendingExample = initialOrders.find(o => o.status === 'pending');
        if (pendingExample && !existingIds.has(pendingExample.id)) {
          merged.push(pendingExample);
        } else {
          merged.push({
            id: 3991,
            customerName: 'Ejemplo Pendiente',
            customerEmail: 'pending@example.com',
            items: [{ productId: 5, productName: 'Gorra Oficial', quantity: 1, price: 12000, size: 'Unico' }],
            total: 12000,
            status: 'pending',
            date: todayIsoDate(),
            address: 'Demostracion',
            paymentMethod: 'Efectivo'
          });
        }
      }

      if (!hasDeliveredToday) {
        const deliveredExample = initialOrders.find(o => o.status === 'delivered');
        const example = deliveredExample || {
          id: 3992,
          customerName: 'Ejemplo Entregado',
          customerEmail: 'delivered@example.com',
          items: [{ productId: 10, productName: 'Sticker Oficial', quantity: 2, price: 800, size: 'Unico' }],
          total: 1600,
          status: 'delivered',
          date: todayIsoDate(),
          deliveredAt: nowIso(),
          address: 'Demostracion',
          paymentMethod: 'Efectivo'
        } as Order;
        if (!existingIds.has(example.id)) merged.push(example);
      }

      if (merged.length !== data.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      }
      return merged;
    }
  } catch (_) {}
  // No key: seed
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialOrders));
  return initialOrders;
}

function saveOrders(data: Order[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const ReceptionistOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  useEffect(() => {
    if (orders.length) saveOrders(orders);
  }, [orders]);

  const pendingOrders = useMemo(() => {
    const lower = filter.trim().toLowerCase();
    return orders
      .filter(o => o.status === 'pending')
      .filter(o => {
        if (!lower) return true;
        return (
          o.customerName.toLowerCase().includes(lower) ||
          o.customerEmail.toLowerCase().includes(lower) ||
          String(o.id).includes(lower)
        );
      });
  }, [orders, filter]);

  const deliveredToday = useMemo(() => {
    const today = new Date();
    return orders.filter(o => o.status === 'delivered' && o.deliveredAt && sameDay(new Date(o.deliveredAt), today));
  }, [orders]);

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('es-AR');
  const currency = (n: number) => n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

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
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmado';
      case 'processing': return 'Procesando';
      case 'shipped': return 'Despachado';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const markAsDelivered = (id: number) => {
    const now = nowIso();
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, status: 'delivered', deliveredAt: now } : o)));
    setSelectedOrder(null);
  };

  const revertToPending = (id: number) => {
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, status: 'pending', deliveredAt: undefined } : o)));
  };

  return (
    <div className="receiver-dashboard">
      <h1>Pedidos pendientes a entregar</h1>
      <p className="subtitle">Visualiza los pedidos pendientes y márcalos como entregados</p>

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
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Pedidos ({pendingOrders.length})</h2>
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
              {pendingOrders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    <div>{order.customerName}</div>
                    <div className="text-muted">{order.customerEmail}</div>
                  </td>
                  <td>{formatDate(order.date)}</td>
                  <td>
                    {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                    <button className="btn-link" onClick={() => setSelectedOrder(order)}>
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
                    <button className="btn" onClick={() => markAsDelivered(order.id)}>
                      Marcar como entregado
                    </button>
                  </td>
                </tr>
              ))}
              {pendingOrders.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#bdbdbd' }}>
                    No hay pedidos pendientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Delivered today */}
      <section className="panel delivered-panel">
        <div className="panel-header">
          <h2>Entregados hoy ({deliveredToday.length})</h2>
        </div>
        <div className="panel-body">
          <table className="data-table delivered-table">
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
              {deliveredToday.map(order => (
                <tr key={order.id} className="delivered-row">
                  <td>#{order.id}</td>
                  <td>
                    <div>{order.customerName}</div>
                    <div className="text-muted">{order.customerEmail}</div>
                  </td>
                  <td>{formatDate(order.date)}</td>
                  <td>
                    {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                    <button className="btn-link" onClick={() => setSelectedOrder(order)}>
                      Ver detalles
                    </button>
                  </td>
                  <td>{currency(order.total)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass('delivered')}`}>Entregado</span>
                  </td>
                  <td>
                    <button className="btn" onClick={() => revertToPending(order.id)}>
                      Revertir a pendiente
                    </button>
                  </td>
                </tr>
              ))}
              {deliveredToday.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#9b9b9b' }}>
                    No hay pedidos entregados hoy
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

              <div style={{ marginTop: 16, textAlign: 'right' }}>
                <button className="btn" onClick={() => markAsDelivered(selectedOrder.id)}>
                  Marcar como entregado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceptionistOrders;

