import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage } from 'react-icons/fi';
import { orderService, mapOrderToFrontend } from '../services/orderService';
import { FrontendOrder, FrontendOrderStatus } from '../types/order';
import { User } from '../types/user';
import '../styles/myOrders.css';

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<FrontendOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<FrontendOrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<FrontendOrder | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const filteredOrders = useMemo(() => {
    console.log('Calculating filteredOrders with orders:', orders, 'selectedStatus:', selectedStatus);
    const filtered = selectedStatus === 'all' ? orders : orders.filter(order => order.status === selectedStatus);
    console.log('Filtered orders result:', filtered);
    return filtered;
  }, [orders, selectedStatus]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      console.log('User loaded from localStorage:', parsedUser);
      setUser(parsedUser);
    } else {
      console.log('No user in localStorage');
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching orders for user:', user.idUser);
      const backendOrders = await orderService.getUserOrders(user.idUser);
      console.log('Backend orders received:', backendOrders);
      const frontendOrders = backendOrders.map(mapOrderToFrontend);
      console.log('Frontend orders mapped:', frontendOrders);
      console.log('Setting orders state to:', frontendOrders);
      setOrders(frontendOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Error al cargar los pedidos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusCounts = () => {
    const counts = {
      all: orders.length,
      pending: 0,
      confirmed: 0,
      processing: 0,
      completed: 0,
      cancelled: 0,
    };
    orders.forEach(order => {
      counts[order.status]++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  const getStatusBadgeClass = (status: FrontendOrderStatus) => {
    switch (status) {
      case 'pending': return 'status-badge status-pending';
      case 'confirmed': return 'status-badge status-confirmed';
      case 'processing': return 'status-badge status-processing';
      case 'completed': return 'status-badge status-completed';
      case 'cancelled': return 'status-badge status-cancelled';
      default: return 'status-badge';
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      await orderService.updateOrderStatus(orderId, { status: 'cancelled', statusMp: 'cancelled' });
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  if (!user) {
    return (
      <div className="my-orders-container">
        <div className="empty-orders">
          <div className="empty-icon">🔒</div>
          <h3>Acceso requerido</h3>
          <p>Debes iniciar sesión para ver tus pedidos.</p>
          <Link to="/login" className="shop-button">Iniciar Sesión</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="my-orders-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando tus pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-orders-container">
        <div className="empty-orders">
          <div className="empty-icon">⚠️</div>
          <h3>Error al cargar pedidos</h3>
          <p>{error}</p>
          <button className="shop-button" onClick={fetchOrders}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-container">
      <div className="orders-header">
        <Link to="/" className="back-button">← Volver al inicio</Link>
        <h1>Mis Pedidos</h1>
        <p>Revisa el estado de tus compras y pedidos anteriores</p>
      </div>

      <div className="status-filters">
        <button
          className={`status-pill ${selectedStatus === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedStatus('all')}
        >
          Todos <span className="status-count">{statusCounts.all}</span>
        </button>
        <button
          className={`status-pill ${selectedStatus === 'pending' ? 'active' : ''}`}
          onClick={() => setSelectedStatus('pending')}
        >
          Pendiente <span className="status-count">{statusCounts.pending}</span>
        </button>
        <button
          className={`status-pill ${selectedStatus === 'confirmed' ? 'active' : ''}`}
          onClick={() => setSelectedStatus('confirmed')}
        >
          Confirmado <span className="status-count">{statusCounts.confirmed}</span>
        </button>
        <button
          className={`status-pill ${selectedStatus === 'processing' ? 'active' : ''}`}
          onClick={() => setSelectedStatus('processing')}
        >
          Procesando <span className="status-count">{statusCounts.processing}</span>
        </button>
        <button
          className={`status-pill ${selectedStatus === 'completed' ? 'active' : ''}`}
          onClick={() => setSelectedStatus('completed')}
        >
          Completado <span className="status-count">{statusCounts.completed}</span>
        </button>
        <button
          className={`status-pill ${selectedStatus === 'cancelled' ? 'active' : ''}`}
          onClick={() => setSelectedStatus('cancelled')}
        >
          Cancelado <span className="status-count">{statusCounts.cancelled}</span>
        </button>
      </div>

      {filteredOrders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon"><FiPackage size={64} /></div>
            <h3>No hay pedidos</h3>
            <p>No tienes pedidos en esta categoría.</p>
            <Link to="/catalog" className="shop-button">Explorar productos</Link>
          </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>{order.orderNumber}</h3>
                  <p className="order-date">{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <span className={getStatusBadgeClass(order.status)}>
                  {order.status === 'pending' ? 'Pendiente' :
                   order.status === 'confirmed' ? 'Confirmado' :
                   order.status === 'processing' ? 'Procesando' :
                   order.status === 'completed' ? 'Completado' : 'Cancelado'}
                </span>
              </div>

              <div className="order-content">
                <div className="order-items">
                  {order.items.slice(0, 3).map(item => (
                    <div key={item.id} className="order-item-preview">
                      <img
                        src={orderService.getItemImage(item.image)}
                        alt={item.name}
                        onError={(e) => { (e.target as HTMLImageElement).src = orderService.getItemImage(); }}
                      />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="order-item-preview more-items">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                <div className="order-total">
                  Total: ${order.total.toFixed(2)}
                </div>
              </div>

              <div className="order-footer">
                {order.status === 'completed' && (
                  <div className="completed-info">
                    <span>✓</span>
                    <span>Pedido completado</span>
                  </div>
                )}
                {order.status === 'cancelled' && (
                  <div className="cancelled-info">
                    <span>✗</span>
                    <span>Pedido cancelado</span>
                  </div>
                )}
                {order.pickupDate && order.status === 'processing' && (
                  <div className="pickup-info">
                    <div className="pickup-time">
                      <span className="time-icon">🕒</span>
                      <span className="time-text">Retiro programado</span>
                    </div>
                    <p className="pickup-date">{new Date(order.pickupDate).toLocaleString()}</p>
                  </div>
                )}
                <div className="order-actions">
                  <button
                    className="view-details-btn"
                    onClick={() => setSelectedOrder(order)}
                  >
                    Ver detalles
                  </button>
                  {/* Cancel button removed per request */}
                  {/* buy again button removed per request */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalles del pedido {selectedOrder.orderNumber}</h2>
              <button className="close-modal" onClick={() => setSelectedOrder(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="order-detail-section">
                <h4>Información del pedido</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>Fecha del pedido:</strong>
                    <span>{new Date(selectedOrder.date).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Estado:</strong>
                    <span className={getStatusBadgeClass(selectedOrder.status)}>
                      {selectedOrder.status === 'pending' ? 'Pendiente' :
                       selectedOrder.status === 'confirmed' ? 'Confirmado' :
                       selectedOrder.status === 'processing' ? 'Procesando' :
                       selectedOrder.status === 'completed' ? 'Completado' : 'Cancelado'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <strong>Total:</strong>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                  {selectedOrder.pickupDate && (
                    <div className="detail-item">
                      <strong>Fecha de retiro:</strong>
                      <span>{new Date(selectedOrder.pickupDate).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="order-detail-section">
                <h4>Productos</h4>
                <div className="order-items-detail">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="order-item-detail">
                      <img
                        src={orderService.getItemImage(item.image)}
                        alt={item.name}
                        onError={(e) => { (e.target as HTMLImageElement).src = orderService.getItemImage(); }}
                      />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>Cantidad: {item.quantity}</p>
                        {item.size && <p>Talla: {item.size}</p>}
                        <p className="item-price">${item.price.toFixed(2)} c/u</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.history && selectedOrder.history.length > 0 && (
                <div className="order-detail-section">
                  <h4>Historial de estados</h4>
                  <ul>
                    {selectedOrder.history.map((hist, index) => (
                      <li key={index}>
                        {new Date(hist.statusDate).toLocaleString()}: {hist.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="close-button" onClick={() => setSelectedOrder(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;