/**
 * ReceptionistOrders
 * Shows pending orders to deliver and a secondary list of orders delivered today.
 * Uses localStorage key 'adminOrders' shared with admin pages. Seeds mock orders if missing.
 */
import React, { useEffect, useMemo, useState } from 'react';
import '../styles/receptionist-orders.css';
import LoadingSpinner from '../components/LoadingSpinner';
import { orderService } from '../services/orderService';
import type { BackendOrder, BackendOrderLine } from '../types/order';

type OrderStatus =
  | 'confirmed'
  | 'ready'
  | 'withdrawn'
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
  withdrawnAt?: string;
};

const nowIso = () => new Date().toISOString();

const parseDecimal = (v: number | string | undefined) => {
  if (typeof v === 'number') return v;
  if (!v) return 0;
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
};

// Map backend order fields (statusMp, actualPickupDate) to frontend OrderStatus
const determineStatusFromBackend = (o: BackendOrder): OrderStatus => {
  if (o.actualPickupDate) return 'withdrawn';
  // statusMp from backend is typically 'unpaid' | 'no_payment_required' | undefined,
  // but some environments may provide 'paid' so normalize safely.
  const status = o.statusMp as string | undefined;
  if (status === 'paid' || status === 'no_payment_required') return 'ready';
  if (status === 'unpaid') return 'cancelled';
  // fallback
  return 'confirmed';
};

const ReceptionistOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch paginated orders from backend (admin list). We only need a page with many items
  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await orderService.getOrders({ page: 1, limit: 200 });
        // data.orders is BackendOrder[] mapped on backend; map to local Order shape
        const mapped: Order[] = (data.orders || []).map((o: BackendOrder) => ({
          id: o.idOrder,
          customerName: o.customer_name,
          customerEmail: o.customer_email,
          items: (o.orderLines || []).map((ln: BackendOrderLine) => ({
            productId: ln.idProduct,
            productName: ln.product?.name || ln.product_name,
            quantity: ln.quantity,
            price: typeof ln.subtotal === 'number' ? ln.subtotal / Math.max(1, ln.quantity) : Number(ln.subtotal) / Math.max(1, ln.quantity),
            size: ln.size || 'Unico',
          })),
          total: parseDecimal(o.total_amount),
          status: determineStatusFromBackend(o),
          date: o.orderDate,
          address: o.customer_notes || 'Retiro en Rowing Club',
          paymentMethod: o.paymentMethod?.name || 'Sin datos',
          withdrawnAt: o.actualPickupDate || undefined,
        }));
        if (!mounted) return;
        setOrders(mapped);
        setError('');
      } catch (err: any) {
        console.error('Error fetching orders for receptionist:', err);
        setError((err as any)?.response?.data?.message || err.message || 'Error cargando pedidos');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  const pendingOrders = useMemo(() => {
    const lower = filter.trim().toLowerCase();
    const desired = new Set<OrderStatus>(['confirmed', 'ready', 'withdrawn']);
    return orders
      .filter(o => desired.has(o.status))
      .filter(o => {
        if (!lower) return true;
        return (
          o.customerName.toLowerCase().includes(lower) ||
          o.customerEmail.toLowerCase().includes(lower) ||
          String(o.id).includes(lower)
        );
      });
  }, [orders, filter]);

  // Show all delivered/withdrawn orders (no filtering by date)
  const deliveredOrders = useMemo(() => orders.filter(o => o.status === 'withdrawn'), [orders]);

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('es-AR');
  const currency = (n: number) => n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

  const getStatusClass = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'ready': return 'status-ready';
      case 'withdrawn': return 'status-withdrawn';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'ready': return 'ready';
      case 'withdrawn': return 'withdrawn';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const markAsDelivered = async (id: number) => {
    const now = nowIso();
    // Optimistic update
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, status: 'withdrawn', withdrawnAt: now } : o)));
    setSelectedOrder(null);
    try {
      await orderService.updateOrderStatus(id, {
        status: 'withdrawn',
        statusMp: 'approved',
        description: 'Retirado'
      });
      // Refresh list from backend to ensure consistency
      const data = await orderService.getOrders({ page: 1, limit: 200 });
      const mapped: Order[] = (data.orders || []).map((o: BackendOrder) => ({
        id: o.idOrder,
        customerName: o.customer_name,
        customerEmail: o.customer_email,
        items: (o.orderLines || []).map((ln: BackendOrderLine) => ({
          productId: ln.idProduct,
          productName: ln.product?.name || ln.product_name,
          quantity: ln.quantity,
          price: typeof ln.subtotal === 'number' ? ln.subtotal / Math.max(1, ln.quantity) : Number(ln.subtotal) / Math.max(1, ln.quantity),
          size: ln.size || 'Unico',
        })),
        total: parseDecimal(o.total_amount),
  status: determineStatusFromBackend(o),
        date: o.orderDate,
        address: o.customer_notes || 'Retiro en Rowing Club',
        paymentMethod: o.paymentMethod?.name || 'Sin datos',
  withdrawnAt: o.actualPickupDate || undefined,
      }));
      setOrders(mapped);
    } catch (err: any) {
      console.error('Error marking order as delivered:', err);
      // rollback optimistic update
      // re-fetch to get correct state
      try {
        const data = await orderService.getOrders({ page: 1, limit: 200 });
        const mapped: Order[] = (data.orders || []).map((o: BackendOrder) => ({
          id: o.idOrder,
          customerName: o.customer_name,
          customerEmail: o.customer_email,
          items: (o.orderLines || []).map((ln: BackendOrderLine) => ({
            productId: ln.idProduct,
            productName: ln.product?.name || ln.product_name,
            quantity: ln.quantity,
            price: typeof ln.subtotal === 'number' ? ln.subtotal / Math.max(1, ln.quantity) : Number(ln.subtotal) / Math.max(1, ln.quantity),
            size: ln.size || 'Unico',
          })),
          total: parseDecimal(o.total_amount),
          status: determineStatusFromBackend(o),
          date: o.orderDate,
          address: o.customer_notes || 'Retiro en Rowing Club',
          paymentMethod: o.paymentMethod?.name || 'Sin datos',
          withdrawnAt: o.actualPickupDate || undefined,
        }));
        setOrders(mapped);
      } catch (e) {
        console.error('Error refetching orders after failed mark delivered:', e);
      }
    }
  };

  const revertToPending = async (id: number) => {
    // Optimistic update: mark as confirmed (not withdrawn)
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, status: 'confirmed', withdrawnAt: undefined } : o)));
    try {
      await orderService.updateOrderStatus(id, {
        status: 'confirmed',
        statusMp: 'pending',
        description: 'Revertido a pendiente'
      });
      // Refresh
      const data = await orderService.getOrders({ page: 1, limit: 200 });
      const mapped: Order[] = (data.orders || []).map((o: BackendOrder) => ({
        id: o.idOrder,
        customerName: o.customer_name,
        customerEmail: o.customer_email,
        items: (o.orderLines || []).map((ln: BackendOrderLine) => ({
          productId: ln.idProduct,
          productName: ln.product?.name || ln.product_name,
          quantity: ln.quantity,
          price: typeof ln.subtotal === 'number' ? ln.subtotal / Math.max(1, ln.quantity) : Number(ln.subtotal) / Math.max(1, ln.quantity),
          size: ln.size || 'Unico',
        })),
        total: parseDecimal(o.total_amount),
  status: determineStatusFromBackend(o),
        date: o.orderDate,
        address: o.customer_notes || 'Retiro en Rowing Club',
        paymentMethod: o.paymentMethod?.name || 'Sin datos',
  withdrawnAt: o.actualPickupDate || undefined,
      }));
      setOrders(mapped);
    } catch (err) {
      console.error('Error reverting order to pending:', err);
      // try refetch
      try {
        const data = await orderService.getOrders({ page: 1, limit: 200 });
        const mapped: Order[] = (data.orders || []).map((o: BackendOrder) => ({
          id: o.idOrder,
          customerName: o.customer_name,
          customerEmail: o.customer_email,
          items: (o.orderLines || []).map((ln: BackendOrderLine) => ({
            productId: ln.idProduct,
            productName: ln.product?.name || ln.product_name,
            quantity: ln.quantity,
            price: typeof ln.subtotal === 'number' ? ln.subtotal / Math.max(1, ln.quantity) : Number(ln.subtotal) / Math.max(1, ln.quantity),
            size: ln.size || 'Unico',
          })),
          total: parseDecimal(o.total_amount),
          status: determineStatusFromBackend(o),
          date: o.orderDate,
          address: o.customer_notes || 'Retiro en Rowing Club',
          paymentMethod: o.paymentMethod?.name || 'Sin datos',
          withdrawnAt: o.actualPickupDate || undefined,
        }));
        setOrders(mapped);
      } catch (e) {
        console.error('Error refetching orders after failed revert:', e);
      }
    }
  };

  return (
    <div className="receiver-dashboard">
      <h1>Pedidos pendientes a entregar</h1>
      <p className="subtitle">Visualiza los pedidos pendientes y márcalos como entregados</p>

      {loading && (
        <div className="loading" style={{ textAlign: 'center', margin: '1rem 0' }}>
          <LoadingSpinner />
          <p style={{ marginTop: 8 }}>Cargando pedidos...</p>
        </div>
      )}

      {error && (
        <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>
      )}

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

  {/* Delivered (all withdrawn) */}
      <section className="panel delivered-panel">
        <div className="panel-header">
          <h2>Entregados ({deliveredOrders.length})</h2>
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
              {deliveredOrders.map(order => (
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
                    <span className={`status-badge ${getStatusClass(order.status)}`}>{getStatusLabel(order.status)}</span>
                  </td>
                  <td>
                    <button className="btn" onClick={() => revertToPending(order.id)}>
                      Revertir a pendiente
                    </button>
                  </td>
                </tr>
              ))}
              {deliveredOrders.length === 0 && (
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

