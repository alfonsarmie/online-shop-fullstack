import React, { useEffect, useMemo, useState } from 'react';
import '../styles/receptionist-orders.css';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { orderService } from '../services/orderService';
import type { BackendOrder, BackendOrderLine } from '../types/order';

type OrderStatus =
  | 'confirmed'
  | 'ready'
  | 'withdrawn'
  | 'cancelled'
  | 'pending_payment';

type OrderItem = {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  size: string;
};

type Order = {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string; 
  address: string;
  paymentMethod: string;
  withdrawnAt?: string;
  previousStatus?: OrderStatus;
};

const formatOrderNumber = (id: number) => `ORD-${id.toString().padStart(4, '0')}`;

const nowIso = () => new Date().toISOString();

const parseDecimal = (v: number | string | undefined) => {
  if (typeof v === 'number') return v;
  if (!v) return 0;
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
};

const normalizeStatus = (status?: string | null): OrderStatus => {
  if (!status) return 'confirmed';
  const cleaned = status.toLowerCase().replace(/[-\s]+/g, '_');
  const allowed: OrderStatus[] = ['confirmed', 'ready', 'withdrawn', 'cancelled', 'pending_payment'];
  return allowed.includes(cleaned as OrderStatus)
    ? (cleaned as OrderStatus)
    : 'confirmed';
};

const determineStatusFromBackend = (o: BackendOrder): OrderStatus => {
  const rawHistoryStatus = o.latestStatus?.description ?? o.statusHistory[0]?.description;
  if (rawHistoryStatus) return normalizeStatus(rawHistoryStatus);

  if (o.PickupDate) return 'withdrawn';

  const status = o.statusMp as string | undefined;
  if (status === 'unpaid') return 'pending_payment';
  if (status === 'paid' || status === 'no_payment_required') return 'ready';

  return 'confirmed';
};

const ReceptionistOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const mapBackendOrders = (backendList: BackendOrder[], carryFrom: Order[] = []): Order[] => {
    return (backendList || []).map((o: BackendOrder) => {
      const prev = carryFrom.find(p => p.id === o.idOrder)?.previousStatus;
      return {
        id: o.idOrder,
        orderNumber: formatOrderNumber(o.idOrder),
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
        withdrawnAt: o.PickupDate || undefined,
        previousStatus: prev,
      };
    });
  };

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await orderService.getOrders({ page: 1, limit: 200 });
        const mapped: Order[] = mapBackendOrders(data.orders || [], []);
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

  const paymentPendingOrders = useMemo(() => orders.filter(o => o.status === 'pending_payment'), [orders]);

  const corfirmedOrders = useMemo(() => {
    const lower = filter.trim().toLowerCase();
    const desired = new Set<OrderStatus>(['confirmed', 'ready']);
    return orders
      .filter(o => desired.has(o.status))
      .filter(o => {
        if (!lower) return true;
        return (
          o.customerName.toLowerCase().includes(lower) ||
          o.customerEmail.toLowerCase().includes(lower) ||
          String(o.id).includes(lower) ||
          o.orderNumber.toLowerCase().includes(lower)
        );
      });
  }, [orders, filter]);

  const deliveredOrders = useMemo(() => orders.filter(o => o.status === 'withdrawn'), [orders]);

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('es-AR');
  const currency = (n: number) => n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

  const getStatusClass = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'ready': return 'status-ready';
      case 'withdrawn': return 'status-withdrawn';
      case 'cancelled': return 'status-cancelled';
      case 'pending_payment': return 'status-pending';
      default: return '';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'ready': return 'Listo';
      case 'withdrawn': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      case 'pending_payment': return 'Pendiente de pago';
      default: return status;
    }
  };

  const markAsReady = async (id: number) => {
    const optimistic = orders.map(o => (o.id === id ? { ...o, previousStatus: o.status, status: 'ready' as OrderStatus } : o));
    setOrders(optimistic);
    setSelectedOrder(null);
    try {
      await orderService.updateStatusTransition(id, {
        description: 'ready'
      });

      const data = await orderService.getOrders({ page: 1, limit: 200 });
      const mapped: Order[] = mapBackendOrders(data.orders || [], optimistic);
      setOrders(mapped);
    } catch (err: any) {
      console.error('Error marking order as ready:', err);
      try {
        const data = await orderService.getOrders({ page: 1, limit: 200 });
        const mapped: Order[] = mapBackendOrders(data.orders || [], orders);
        setOrders(mapped);
      } catch (e) {
        console.error('Error refetching orders after failed mark ready:', e);
      }
    }
  };

  const revertToConfirmed = async (id: number) => {
    const optimistic = orders.map(o => (o.id === id ? { ...o, previousStatus: o.status, status: 'confirmed' as OrderStatus } : o));
    setOrders(optimistic);
    setSelectedOrder(null);
    try {
      await orderService.updateStatusTransition(id, {
        description: 'confirmed'
      });

      const data = await orderService.getOrders({ page: 1, limit: 200 });
      const mapped: Order[] = mapBackendOrders(data.orders || [], optimistic);
      setOrders(mapped);
    } catch (err: any) {
      console.error('Error reverting order to confirmed:', err);
      try {
        const data = await orderService.getOrders({ page: 1, limit: 200 });
        const mapped: Order[] = mapBackendOrders(data.orders || [], orders);
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
        <ErrorMessage message={error} />
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
          <h2>Pedidos pendientes de pago ({paymentPendingOrders.length})</h2>
        </div>
        <div className="panel-body">
          <table className="data-table">
            <thead>
              <tr>
                <th>N° Pedido</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {paymentPendingOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.orderNumber}</td>
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
                </tr>
              ))}
              </tbody>
          </table>
        </div>          
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Pedidos ({corfirmedOrders.length})</h2>
        </div>
        <div className="panel-body">
          <table className="data-table">
            <thead>
              <tr>
                <th>N° Pedido</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {corfirmedOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.orderNumber}</td>
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
                    <button 
                      className="btn" 
                      onClick={() => {
                        if (order.status === 'confirmed') {
                          markAsReady(order.id);
                        } else if (order.status === 'ready') {
                          revertToConfirmed(order.id);
                        }
                      }}
                    >
                      {order.status === 'confirmed' ? 'Marcar como listo' : 'Revertir a confirmado'}
                    </button>
                  </td>
                </tr>
              ))}
              {corfirmedOrders.length === 0 && (
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

      <section className="panel delivered-panel">
        <div className="panel-header">
          <h2>Entregados ({deliveredOrders.length})</h2>
        </div>
        <div className="panel-body">
          <table className="data-table delivered-table">
            <thead>
              <tr>
                <th>N° Pedido</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {deliveredOrders.map(order => (
                <tr key={order.id} className="delivered-row">
                  <td>{order.orderNumber}</td>
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
                </tr>
              ))}
              {deliveredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#9b9b9b' }}>
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
              <h2>Detalles del pedido {selectedOrder.orderNumber}</h2>
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
                <button 
                  className="btn" 
                  onClick={() => {
                    if (selectedOrder.status === 'confirmed') {
                      markAsReady(selectedOrder.id);
                    } else if (selectedOrder.status === 'ready') {
                      revertToConfirmed(selectedOrder.id);
                    }
                  }}
                >
                  {selectedOrder.status === 'confirmed' ? 'Marcar como listo' : 'Revertir a confirmado'}
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

