// pages/MyOrders.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/myOrders.css';

// Interface para los pedidos
interface Order {
  id: number;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
  items: OrderItem[];
  pickupDate?: string; // Fecha límite de retiro
  canCancel: boolean; // Si el pedido puede ser cancelado
}

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  image: string;
}

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Calcular días restantes para retiro
  const calculateDaysRemaining = (pickupDate: string): number => {
    const today = new Date();
    const pickup = new Date(pickupDate);
    const diffTime = pickup.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Función para cancelar pedido
  const handleCancelOrder = (orderId: number) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar este pedido?')) {
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'cancelled', canCancel: false }
          : order
      ));
      alert('Pedido cancelado exitosamente');
    }
  };

  // Datos de ejemplo
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: 1,
        orderNumber: 'ORD-001',
        date: '2024-01-15',
        status: 'completed',
        total: 12500,
        pickupDate: '2024-01-30',
        canCancel: false,
        items: [
          {
            id: 1,
            name: 'Remera Deportiva',
            price: 8500,
            quantity: 1,
            size: 'M',
            image: '/images/product1.jpg'
          }
        ]
      },
      {
        id: 2,
        orderNumber: 'ORD-002',
        date: new Date().toISOString().split('T')[0],
        status: 'processing',
        total: 7500,
        pickupDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        canCancel: true,
        items: [
          {
            id: 3,
            name: 'Campera Deportiva',
            price: 7500,
            quantity: 1,
            size: 'XL',
            image: '/images/product3.jpg'
          }
        ]
      },
      {
        id: 3,
        orderNumber: 'ORD-003',
        date: '2024-01-18',
        status: 'pending',
        total: 12000,
        pickupDate: '2024-02-02',
        canCancel: true,
        items: [
          {
            id: 4,
            name: 'Pantalón Deportivo',
            price: 6000,
            quantity: 2,
            size: 'M',
            image: '/images/product4.jpg'
          }
        ]
      },
      {
        id: 4,
        orderNumber: 'ORD-004',
        date: '2024-01-10',
        status: 'cancelled',
        total: 9000,
        canCancel: false,
        items: [
          {
            id: 5,
            name: 'Gorra Deportiva',
            price: 4500,
            quantity: 2,
            image: '/images/product5.jpg'
          }
        ]
      }
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#1E7335';
      case 'processing':
        return '#4a90e2';
      case 'pending':
        return '#f39c12';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'processing':
        return 'Procesando';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

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

  return (
    <div className="my-orders-container">
      {/* Header */}
      <div className="orders-header">
        <Link to="/" className="back-button">
          ← Volver al Inicio
        </Link>
        <h1>Mis Pedidos</h1>
        <p>Gestiona y revisa el estado de tus compras</p>
      </div>

      {/* Orders List */}
      <div className="orders-list">
        {orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">📦</div>
            <h3>No tienes pedidos aún</h3>
            <p>¡Comienza a comprar y verás tus pedidos aquí!</p>
            <Link to="/products" className="shop-button">
              Ir a Comprar
            </Link>
          </div>
        ) : (
          orders.map((order) => {
            const daysRemaining = order.pickupDate ? calculateDaysRemaining(order.pickupDate) : 0;
            
            return (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Pedido #{order.orderNumber}</h3>
                    <p className="order-date">Realizado el {new Date(order.date).toLocaleDateString('es-ES')}</p>
                  </div>
                  <div className="order-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                <div className="order-content">
                  <div className="order-items">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={item.id} className="order-item-preview">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/60x60?text=Producto';
                          }}
                        />
                        {index === 2 && order.items.length > 3 && (
                          <div className="more-items">+{order.items.length - 3} más</div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="order-total">
                    <strong>Total: ${order.total.toLocaleString('es-AR')}</strong>
                  </div>
                </div>

                {/* Información de retiro y acciones */}
                <div className="order-footer">
                  {order.pickupDate && order.status !== 'cancelled' && order.status !== 'completed' && (
                    <div className="pickup-info">
                      <div className="pickup-time">
                        <span className="time-icon">⏰</span>
                        <span className="time-text">
                          {daysRemaining > 0 
                            ? `Tienes ${daysRemaining} día${daysRemaining !== 1 ? 's' : ''} para retirar`
                            : '¡Hoy es el último día para retirar!'
                          }
                        </span>
                      </div>
                      <div className="pickup-date">
                        Retiro hasta: {new Date(order.pickupDate).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  )}

                  {order.status === 'completed' && (
                    <div className="completed-info">
                      <span className="completed-icon">✅</span>
                      <span>Pedido retirado exitosamente</span>
                    </div>
                  )}

                  {order.status === 'cancelled' && (
                    <div className="cancelled-info">
                      <span className="cancelled-icon">❌</span>
                      <span>Pedido cancelado</span>
                    </div>
                  )}

                  <div className="order-actions">
                    <button 
                      className="view-details-btn"
                      onClick={() => setSelectedOrder(order)}
                    >
                      Ver Detalles
                    </button>
                    
                    {order.canCancel && (
                      <button 
                        className="cancel-order-btn"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Cancelar Pedido
                      </button>
                    )}
                    
                    {order.status === 'completed' && (
                      <button className="buy-again-btn">
                        Comprar Nuevamente
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalles del Pedido #{selectedOrder.orderNumber}</h2>
              <button 
                className="close-modal"
                onClick={() => setSelectedOrder(null)}
              >
                ✖
              </button>
            </div>

            <div className="modal-body">
              <div className="order-detail-section">
                <h4>Información del Pedido</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>Número de Pedido:</strong>
                    <span>#{selectedOrder.orderNumber}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Fecha:</strong>
                    <span>{new Date(selectedOrder.date).toLocaleDateString('es-ES')}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Estado:</strong>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(selectedOrder.status) }}
                    >
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <strong>Total:</strong>
                    <span>${selectedOrder.total.toLocaleString('es-AR')}</span>
                  </div>
                  {selectedOrder.pickupDate && selectedOrder.status !== 'cancelled' && (
                    <div className="detail-item">
                      <strong>Retiro hasta:</strong>
                      <span>{new Date(selectedOrder.pickupDate).toLocaleDateString('es-ES')}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="order-detail-section">
                <h4>Productos</h4>
                <div className="order-items-detail">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="order-item-detail">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/60x60?text=Producto';
                        }}
                      />
                      <div className="item-info">
                        <h5>{item.name}</h5>
                        {item.size && <p>Talle: {item.size}</p>}
                        <p>Cantidad: {item.quantity}</p>
                        <p className="item-price">${item.price.toLocaleString('es-AR')} c/u</p>
                      </div>
                      <div className="item-total">
                        ${(item.price * item.quantity).toLocaleString('es-AR')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.pickupDate && selectedOrder.status !== 'cancelled' && (
                <div className="order-detail-section">
                  <h4>Información de Retiro</h4>
                  <div className="pickup-notice">
                    <div className="pickup-alert">
                      <span className="alert-icon">⚠️</span>
                      <div className="alert-content">
                        <strong>Importante:</strong>
                        <p>
                          Tienes {calculateDaysRemaining(selectedOrder.pickupDate)} días para retirar tu pedido en 
                          nuestro local. Pasada la fecha, el pedido será cancelado automáticamente.
                        </p>
                        <p className="pickup-address">
                          <strong>Dirección de retiro:</strong> Av. Carlos Colombres 1798
                        </p>
                        <p className="pickup-hours">
                          <strong>Horario:</strong> Lunes a Viernes 9:00-18:00, Sábados 9:00-13:00
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {selectedOrder.canCancel && (
                <button 
                  className="cancel-button"
                  onClick={() => {
                    handleCancelOrder(selectedOrder.id);
                    setSelectedOrder(null);
                  }}
                >
                  Cancelar Pedido
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