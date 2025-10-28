import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import '../styles/admin-orders.css';
import SuccessMessage from '../components/SuccessMessage';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { orderService } from '../services/orderService';
import { BackendOrder, MercadoPagoStatus } from '../types/order';

type OrderStatus =
  | 'confirmed'
  | 'withdrawn'
  | 'cancelled'
  | 'ready';

type OrderItem = {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  size?: string;
};

type AdminOrder = {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  sport?: string | undefined;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  statusMp: MercadoPagoStatus;
  date: string;
  address: string;
  paymentMethod: string;
  notes?: string;
};

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'ready', label: 'Listo' },
  { value: 'withdrawn', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' },
];

const parseDecimal = (value: number | string | undefined): number => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const determineStatus = (order: BackendOrder): OrderStatus => {
  const historyStatus =
    order.latestStatus?.description ?? order.statusHistory[0]?.description;
  if (historyStatus) {
    return historyStatus;
  }

  if (order.actualPickupDate) {
    return 'withdrawn';
  }

  if (order.statusMp === 'unpaid') return 'cancelled';

  if (order.statusMp === 'paid') return 'confirmed';

  return 'confirmed';
};



const mapBackendOrder = (order: BackendOrder): AdminOrder => {
  const items: OrderItem[] = (order.orderLines ?? []).map((line) => {
    const subtotal = parseDecimal(line.subtotal);
    const unitPrice =
      line.quantity && line.quantity > 0
        ? subtotal / line.quantity
        : subtotal;
    return {
      productId: line.idProduct,
      productName: line.product?.name || line.product_name,
      quantity: line.quantity,
      price: unitPrice,
      size: line.size ?? undefined,
    };
  });

  return {
    id: order.idOrder,
    orderNumber: `ORD-${order.idOrder.toString().padStart(4, '0')}`,
    customerName: order.customer_name,
    customerEmail: order.customer_email,
    customerPhone: order.customer_phone ?? undefined,
    sport: typeof order.sport === 'string' ? order.sport : undefined,
    items,
    total: parseDecimal(order.total_amount),
  status: determineStatus(order),
  statusMp: order.statusMp ?? 'no_payment_required',
    date: order.orderDate,
    address: order.customer_notes
      ? order.customer_notes
      : 'Retiro en Rowing Club',
    paymentMethod: order.paymentMethod?.name ?? 'Sin datos',
    notes: order.customer_notes ?? undefined,
  };
};

const getStatusClass = (status: OrderStatus) => {
  switch (status) {
    case 'confirmed':
      return 'status-confirmed';
    case 'ready':
      return 'status-ready';
    case 'withdrawn':
      return 'status-withdrawn';
    case 'cancelled':
      return 'status-cancelled';
    default:
      return '';
  }
};

const getStatusLabel = (status: OrderStatus) => {
  const option = statusOptions.find((opt) => opt.value === status);
  return option ? option.label : status;
};

const formatDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const currency = (n: number) =>
  n.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
  });

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] =
    useState<AdminOrder | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [editedOrders, setEditedOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching orders...');
      const { orders: backendOrders } = await orderService.getOrders({
        page: 1,
        limit: 100,
      });
      console.log('Orders received:', backendOrders);
      setOrders(backendOrders.map(mapBackendOrder));
      setErrorMessage('');
    } catch (error: unknown) {
      console.error('Error fetching orders:', error);
      console.error('Error details:', (error as any)?.response);
      const msg =
        (error as any)?.response?.data?.message ||
        (error as any)?.response?.data?.error ||
        'No se pudieron obtener los pedidos. Intenta nuevamente.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    const source = editMode ? editedOrders : orders;
    let result = source;

    if (filter.trim()) {
      const q = filter.trim().toLowerCase();
      result = result.filter(
        (order) =>
          order.customerName.toLowerCase().includes(q) ||
          order.customerEmail.toLowerCase().includes(q) ||
          order.id.toString().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((order) => order.status === statusFilter);
    }

    return result;
  }, [orders, editedOrders, editMode, filter, statusFilter]);

  const updateOrderStatus = (id: number, newStatus: OrderStatus) => {
    if (!editMode) return;
    setEditedOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const startEdit = () => {
    setEditedOrders(
      orders.map((order) => ({
        ...order,
        items: order.items.map((item) => ({ ...item })),
      }))
    );
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditedOrders([]);
    setEditMode(false);
  };

  const saveChanges = async () => {
    const changes = editedOrders
      .map((updatedOrder) => {
        const original = orders.find((o) => o.id === updatedOrder.id);
        if (!original) return null;
        if (original.status === updatedOrder.status) return null;
        return {
          id: updatedOrder.id,
          status: updatedOrder.status,
        };
      })
      .filter(Boolean) as { id: number; status: OrderStatus }[];

    if (!changes.length) {
      setEditMode(false);
      setEditedOrders([]);
      return;
    }

    setSaving(true);
    try {
      await Promise.all(
        changes.map(({ id, status }) =>
          orderService.updateOrderStatus(id, {
            description: status,
          })
        )
      );
      setSuccessMessage('Estados actualizados correctamente');
      setEditMode(false);
      setEditedOrders([]);
      fetchOrders();
    } catch (error: unknown) {
      console.error('Error updating order statuses:', error);
      const msg =
        (error as any)?.response?.data?.message ||
        (error as any)?.response?.data?.error ||
        'No se pudieron actualizar los pedidos. Intenta nuevamente.';
      setErrorMessage(msg);
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="admin-orders">
        <div className="panel">
          <div className="panel-body" style={{ textAlign: 'center' }}>
            <LoadingSpinner />
            <p style={{ marginTop: 16 }}>Cargando pedidos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <h1>Gestión de pedidos</h1>
      <p className="subtitle">
        Administra los pedidos del e-commerce: estados, detalle y acciones
        clave.
      </p>

      <SuccessMessage
        message={successMessage}
        onClose={() => setSuccessMessage('')}
      />
      <ErrorMessage
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />

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
                type="text"
                placeholder="Cliente, email o ID"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </label>
            <label>
              <span className="span-admin">Estado</span>
              <select
                className="input-admin"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as OrderStatus | 'all'
                  )
                }
              >
                <option value="all">Todos los estados</option>
                {statusOptions.map((option) => (
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
          {!editMode ? (
            <button className="btn primary" onClick={startEdit}>
              Modificar estados
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn" onClick={cancelEdit}>
                Cancelar
              </button>
              <button
                className="btn primary"
                onClick={saveChanges}
                disabled={saving}
              >
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
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
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.orderNumber}</td>
                  <td>
                    <div>{order.customerName}</div>
                    <div className="text-muted">{order.customerEmail}</div>
                  </td>
                  <td>{formatDate(order.date)}</td>
                  <td>
                    {order.items.length} producto
                    {order.items.length !== 1 ? 's' : ''}
                    <button
                      className="btn-link"
                      onClick={() => setSelectedOrder(order)}
                    >
                      Ver detalles
                    </button>
                  </td>
                  <td>{currency(order.total)}</td>
                  <td>
                    <span
                      className={`status-badge ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(
                            order.id,
                            e.target.value as OrderStatus
                          )
                        }
                        className="status-select"
                        disabled={!editMode}
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {/* Delete action removed from admin UI */}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{ textAlign: 'center', color: '#bdbdbd' }}
                  >
                    No hay pedidos para mostrar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedOrder && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Detalles del pedido #{selectedOrder.orderNumber}</h2>
              <button
                className="btn-close"
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="order-details-grid">
                <div>
                  <h3>Información del cliente</h3>
                  <p>
                    <strong>Nombre:</strong> {selectedOrder.customerName}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedOrder.customerEmail}
                  </p>
                  {selectedOrder.customerPhone && (
                    <p>
                      <strong>Teléfono:</strong>{' '}
                      {selectedOrder.customerPhone}
                    </p>
                  )}
                  <p>
                    <strong>Notas / Dirección:</strong>{' '}
                    {selectedOrder.address}
                  </p>
                  <p>
                    <strong>Método de pago:</strong>{' '}
                    {selectedOrder.paymentMethod}
                  </p>
                </div>
                <div>
                  <h3>Detalles del pedido</h3>
                  <p>
                    <strong>Fecha:</strong>{' '}
                    {formatDate(selectedOrder.date)}
                  </p>
                  <p>
                    <strong>Estado:</strong>{' '}
                    <span
                      className={`status-badge ${getStatusClass(
                        selectedOrder.status
                      )}`}
                    >
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </p>
                  <p>
                    <strong>Total:</strong>{' '}
                    {currency(selectedOrder.total)}
                  </p>
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
                      <td>{item.size ?? '—'}</td>
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
