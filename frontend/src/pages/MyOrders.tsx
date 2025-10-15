import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import '../styles/myOrders.css';
import SuccessMessage from '../components/SuccessMessage';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  orderService,
  mapOrderToFrontend,
  getItemImage,
} from '../services/orderService';
import { FrontendOrder, FrontendOrderStatus } from '../types/order';
import { User } from '../types/user';

const ITEM_IMAGE_PLACEHOLDER = getItemImage();

const STATUS_LABELS: Record<FrontendOrderStatus, string> = {
  pending: 'Pendiente',
  processing: 'Procesando',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

const STATUS_COLORS: Record<FrontendOrderStatus, string> = {
  pending: '#f39c12',
  processing: '#4a90e2',
  completed: '#1E7335',
  cancelled: '#dc3545',
};

const formatCurrency = (value: number) =>
  value.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
  });

const calculateDaysRemaining = (pickupDate?: string) => {
  if (!pickupDate) return null;
  const today = new Date();
  const pickup = new Date(pickupDate);
  const diffTime = pickup.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (Number.isNaN(diffDays)) return null;
  return diffDays > 0 ? diffDays : 0;
};

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<FrontendOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<FrontendOrder | null>(
    null
  );
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    'all' | FrontendOrderStatus
  >('all');

  const fetchOrders = useCallback(
    async (id: number) => {
      setLoading(true);
      try {
        const backendOrders = await orderService.getUserOrders(id);
        const normalized = backendOrders.map(mapOrderToFrontend);
        setOrders(normalized);
        setErrorMessage('');
      } catch (error: unknown) {
        console.error('Error fetching orders:', error);
        const message =
          (error as any)?.response?.data?.message ||
          (error as any)?.response?.data?.error;
        setErrorMessage(
          message ?? 'No se pudieron cargar tus pedidos. Intenta nuevamente.'
        );
        setOrders([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      setLoading(false);
      return;
    }

    try {
      const parsedUser: User = JSON.parse(savedUser);
      if (parsedUser?.idUser) {
        setUserId(parsedUser.idUser);
        setUserRole(parsedUser.role ?? null);
        fetchOrders(parsedUser.idUser);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('No se pudo leer el usuario almacenado:', error);
      setLoading(false);
    }
  }, [fetchOrders]);

  const statusCounts = useMemo(() => {
    return orders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] ?? 0) + 1;
        acc.all += 1;
        return acc;
      },
      {
        all: 0,
        pending: 0,
        processing: 0,
        completed: 0,
        cancelled: 0,
      } as Record<'all' | FrontendOrderStatus, number>
    );
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  const handleCancelOrder = useCallback(
    async (order: FrontendOrder) => {
      if (!order.canCancel || !userId) return;
      if (userRole !== 'admin' && userRole !== 'receptionist') {
        setErrorMessage(
          'Por el momento los pedidos solo pueden cancelarse contactando al equipo del club.'
        );
        return;
      }
      const confirmation = window.confirm(
        '¿Estás seguro de que deseas cancelar este pedido?'
      );
      if (!confirmation) return;

      try {
        await orderService.updateOrderStatus(order.id, {
          status: 'cancelled',
          statusMp: 'cancelled',
          description: 'Pedido cancelado por el cliente desde el portal',
        });
        setSuccessMessage('Pedido cancelado exitosamente');
        setSelectedOrder(null);
        fetchOrders(userId);
      } catch (error: unknown) {
        console.error('Error cancelling order:', error);
        const backendMessage =
          (error as any)?.response?.data?.message ||
          (error as any)?.response?.data?.error;
        if ((error as any)?.response?.status === 403) {
          setErrorMessage(
            'No tienes permisos para cancelar pedidos. Por favor contacta al club.'
          );
        } else {
          setErrorMessage(
            backendMessage ??
              'No pudimos cancelar el pedido. Intenta nuevamente o contacta al club.'
          );
        }
      }
    },
    [fetchOrders, userId, userRole]
  );

  const canManageOrders =
    userRole === 'admin' || userRole === 'receptionist';

  const renderStatusPill = (
    status: 'all' | FrontendOrderStatus,
    label: string
  ) => (
    <button
      key={status}
      className={`status-pill ${statusFilter === status ? 'active' : ''}`}
      onClick={() => setStatusFilter(status)}
    >
      {label}
      <span className="status-count">{statusCounts[status] ?? 0}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="my-orders-container">
        <div className="loading-spinner">
          <LoadingSpinner />
          <p>Cargando tus pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-container">
      <div className="orders-header">
        <Link to="/catalog" className="back-button">
          ← Seguir comprando
        </Link>
        <h1>Mis pedidos</h1>
        <p>Consulta el estado y detalle de tus compras en el club.</p>
      </div>

      <SuccessMessage
        message={successMessage}
        onClose={() => setSuccessMessage('')}
      />
      <ErrorMessage
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />

      <div className="status-filters">
        {renderStatusPill('all', 'Todos')}
        {renderStatusPill('pending', 'Pendientes')}
        {renderStatusPill('processing', 'Procesando')}
        {renderStatusPill('completed', 'Completados')}
        {renderStatusPill('cancelled', 'Cancelados')}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-icon">🛶</div>
          <h3>No encontramos pedidos con ese estado</h3>
          <p>
            Parece que no hay pedidos para mostrar en esta categoría. Si creés
            que falta alguno, contáctanos.
          </p>
          <Link to="/catalog" className="shop-button">
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => {
            const statusText = STATUS_LABELS[order.status];
            const statusColor = STATUS_COLORS[order.status];
            const statusBadgeStyle = { backgroundColor: statusColor };

            return (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>{order.orderNumber}</h3>
                    <p>
                      Realizado el{' '}
                      {new Date(order.date).toLocaleDateString('es-AR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="order-status">
                    <span className="status-badge" style={statusBadgeStyle}>
                      {statusText}
                    </span>
                    <span className="order-total">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={`${order.id}-${item.id}`} className="order-item">
                      <img
                        src={item.image ?? ITEM_IMAGE_PLACEHOLDER}
                        alt={item.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            ITEM_IMAGE_PLACEHOLDER;
                        }}
                      />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>
                          Cantidad: {item.quantity}
                          {item.size ? ` · Talle ${item.size}` : ''}
                        </p>
                        <p className="item-price">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <button
                    className="details-button"
                    onClick={() => setSelectedOrder(order)}
                  >
                    Ver detalles
                  </button>
                  {order.canCancel && canManageOrders && (
                    <button
                      className="cancel-order-btn"
                      onClick={() => handleCancelOrder(order)}
                    >
                      Cancelar pedido
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedOrder && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Pedido #{selectedOrder.orderNumber}</h2>
              <button
                className="close-modal"
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="order-detail-section">
                <h4>Información del pedido</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>Número de pedido:</strong>
                    <span>#{selectedOrder.orderNumber}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Fecha:</strong>
                    <span>
                      {new Date(selectedOrder.date).toLocaleDateString(
                        'es-AR',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                    </span>
                  </div>
                  <div className="detail-item">
                    <strong>Estado:</strong>
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor:
                          STATUS_COLORS[selectedOrder.status],
                      }}
                    >
                      {STATUS_LABELS[selectedOrder.status]}
                    </span>
                  </div>
                  <div className="detail-item">
                    <strong>Total:</strong>
                    <span>{formatCurrency(selectedOrder.total)}</span>
                  </div>
                  {selectedOrder.pickupDate &&
                    selectedOrder.status !== 'cancelled' && (
                      <div className="detail-item">
                        <strong>Retiro hasta:</strong>
                        <span>
                          {new Date(
                            selectedOrder.pickupDate
                          ).toLocaleDateString('es-AR')}
                        </span>
                      </div>
                    )}
                </div>
              </div>

              <div className="order-detail-section">
                <h4>Productos</h4>
                <div className="order-items-detail">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={`${selectedOrder.id}-${item.id}`}
                      className="order-item-detail"
                    >
                      <img
                        src={item.image ?? ITEM_IMAGE_PLACEHOLDER}
                        alt={item.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            ITEM_IMAGE_PLACEHOLDER;
                        }}
                      />
                      <div className="item-info">
                        <h5>{item.name}</h5>
                        {item.size && <p>Talle: {item.size}</p>}
                        <p>Cantidad: {item.quantity}</p>
                        <p className="item-price">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                      <div className="item-total">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.pickupDate &&
                selectedOrder.status !== 'cancelled' && (
                  <div className="order-detail-section">
                    <h4>Información de retiro</h4>
                    <div className="pickup-notice">
                      <div className="pickup-alert">
                        <span className="alert-icon">⚠️</span>
                        <div className="alert-content">
                          <strong>Recordatorio importante</strong>
                          <p>
                            Tienes{' '}
                            {calculateDaysRemaining(
                              selectedOrder.pickupDate
                            ) ?? '0'}{' '}
                            días para retirar tu pedido en nuestro local.
                          </p>
                          <p className="pickup-address">
                            <strong>Dirección:</strong> Av. Carlos Colombres
                            1798
                          </p>
                          <p className="pickup-hours">
                            <strong>Horario:</strong> Lunes a Viernes 9:00 -
                            18:00 · Sábados 9:00 - 13:00
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>

            <div className="modal-footer">
              {selectedOrder.canCancel && canManageOrders && (
                <button
                  className="cancel-button"
                  onClick={() => handleCancelOrder(selectedOrder)}
                >
                  Cancelar pedido
                </button>
              )}
              <button
                className="close-button"
                onClick={() => setSelectedOrder(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
