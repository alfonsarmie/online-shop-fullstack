import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiPackage } from "react-icons/fi";
import { orderService, mapOrderToFrontend } from "../services/orderService";
import { FrontendOrder, FrontendOrderStatus } from "../types/order";
import { User } from "../types/user";
import "../styles/myOrders.css";

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<FrontendOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<
    FrontendOrderStatus | "all"
  >("all");
  const [selectedOrder, setSelectedOrder] = useState<FrontendOrder | null>(
    null
  );
  const [user, setUser] = useState<User | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<FrontendOrder | null>(null);

  const CANCELLATION_WINDOW_HOURS = 24;
  const MILLISECONDS_IN_HOUR = 1000 * 60 * 60;

  const isWithinCancellationWindow = (order: FrontendOrder) => {
    const placedAt = new Date(order.date).getTime();
    if (Number.isNaN(placedAt)) return false;
    const deadline = placedAt + CANCELLATION_WINDOW_HOURS * MILLISECONDS_IN_HOUR;
    return Date.now() <= deadline;
  };

  const remainingHoursToCancel = (order: FrontendOrder) => {
    const placedAt = new Date(order.date).getTime();
    if (Number.isNaN(placedAt)) return 0;
    const remaining =
      placedAt + CANCELLATION_WINDOW_HOURS * MILLISECONDS_IN_HOUR - Date.now();
    if (remaining <= 0) return 0;
    return Math.ceil(remaining / MILLISECONDS_IN_HOUR);
  };

  const canShowRepentButton = (order: FrontendOrder) => {
    if (!order.canCancel) return false;
    if (order.status === "cancelled" || order.status === "withdrawn") return false;
    return isWithinCancellationWindow(order);
  };

  const filteredOrders = useMemo(() => {
    console.log(
      "Calculating filteredOrders with orders:",
      orders,
      "selectedStatus:",
      selectedStatus
    );
    const filtered =
      selectedStatus === "all"
        ? orders
        : orders.filter((order) => order.status === selectedStatus);
    console.log("Filtered orders result:", filtered);
    return filtered;
  }, [orders, selectedStatus]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      console.log("User loaded from localStorage:", parsedUser);
      setUser(parsedUser);
    } else {
      console.log("No user in localStorage");
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
      console.log("Fetching orders for user:", user.idUser);
      const backendOrders = await orderService.getUserOrders(user.idUser);
      console.log("Backend orders received:", backendOrders);
      const frontendOrders = backendOrders.map(mapOrderToFrontend);
      console.log("Frontend orders mapped:", frontendOrders);
      console.log("Setting orders state to:", frontendOrders);
      setOrders(frontendOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Error al cargar los pedidos. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (order: FrontendOrder) => {
    setActionMessage(null);
    const optimistic: FrontendOrder[] = orders.map((o) =>
      o.id === order.id ? { ...o, status: "cancelled" as FrontendOrderStatus } : o
    );
    const previous = [...orders];
    setOrders(optimistic);
    try {
      await orderService.cancelOrder(order.id);
      setSelectedOrder((current) =>
        current && current.id === order.id ? { ...current, status: "cancelled" } : current
      );
    } catch (err) {
      console.error("Error cancelling order:", err);
      setOrders(previous);
      setActionMessage("No pudimos cancelar el pedido. Intenta nuevamente.");
    }
    setOrderToCancel(null);
  };

  const getStatusCounts = () => {
    const counts: Record<FrontendOrderStatus | "all", number> = {
      all: orders.length,
      confirmed: 0,
      ready: 0,
      withdrawn: 0,
      cancelled: 0,
      pending_payment: 0,
    };
    orders.forEach((order) => {
      counts[order.status]++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  const getStatusBadgeClass = (status: FrontendOrderStatus) => {
    switch (status) {
      case "confirmed":
        return "status-badge status-confirmed";
      case "ready":
        return "status-badge status-ready";
      case "withdrawn":
        return "status-badge status-withdrawn";
      case "cancelled":
        return "status-badge status-cancelled";
      case "pending_payment":
        return "status-badge status-pending_payment";
      default:
        return "status-badge";
    }
  };

  const getStatusLabel = (status: FrontendOrderStatus) => {
    switch (status) {
      case "ready":
        return "Listo para retirar";
      case "withdrawn":
        return "Retirado";
      case "cancelled":
        return "Cancelado";
      case "pending_payment":
        return "Pendiente de pago";
      default:
        return "Confirmado";
    }
  };

  if (!user) {
    return (
      <div className="my-orders-container">
        <div className="empty-orders">
          <div className="empty-icon">🔒</div>
          <h3>Acceso requerido</h3>
          <p>Debes iniciar sesión para ver tus pedidos.</p>
          <Link to="/login" className="shop-button">
            Iniciar Sesión
          </Link>
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
          <button className="shop-button" onClick={fetchOrders}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-container">
      <div className="orders-header">
        <Link to="/" className="back-button">
          ← Volver al inicio
        </Link>
        <h1>Mis Pedidos</h1>
        <p>Revisa el estado de tus compras y pedidos anteriores</p>
      </div>

      {actionMessage && (
        <div className="action-message">
          {actionMessage}
        </div>
      )}

      <div className="status-filters">
        <button
          className={`status-pill ${selectedStatus === "all" ? "active" : ""}`}
          onClick={() => setSelectedStatus("all")}
        >
          Todos <span className="status-count">{statusCounts.all}</span>
        </button>
        <button
          className={`status-pill ${selectedStatus === "ready" ? "active" : ""}`}
          onClick={() => setSelectedStatus("ready")}
        >
          Listo para retirar{" "}
          <span className="status-count">{statusCounts.ready}</span>
        </button>
        <button
          className={`status-pill ${selectedStatus === "confirmed" ? "active" : ""}`}
          onClick={() => setSelectedStatus("confirmed")}
        >
          Confirmado{" "}
          <span className="status-count">{statusCounts.confirmed}</span>
        </button>
        <button
          className={`status-pill ${selectedStatus === "pending_payment" ? "active" : ""}`}
          onClick={() => setSelectedStatus("pending_payment")}
        >
          Pendiente de pago{" "}
          <span className="status-count">{statusCounts.pending_payment}</span>
        </button>
        <button
          className={`status-pill ${selectedStatus === "withdrawn" ? "active" : ""}`}
          onClick={() => setSelectedStatus("withdrawn")}
        >
          Retirado{" "}
          <span className="status-count">{statusCounts.withdrawn}</span>
        </button>
        <button
          className={`status-pill ${selectedStatus === "cancelled" ? "active" : ""}`}
          onClick={() => setSelectedStatus("cancelled")}
        >
          Cancelado{" "}
          <span className="status-count">{statusCounts.cancelled}</span>
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-icon">
            <FiPackage size={32} />
          </div>
          <h3>No hay pedidos</h3>
          <p>No tienes pedidos en esta categoría.</p>
          <Link to="/catalog" className="shop-button">
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>{order.orderNumber}</h3>
                  <p className="order-date">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <span className={getStatusBadgeClass(order.status)}>
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="order-content">
                <div className="order-items">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="order-item-preview">
                      <img
                        src={orderService.getItemImage(item.image)}
                        alt={item.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            orderService.getItemImage();
                        }}
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
                {order.status === "ready" && (
                  <div className="ready-info">
                    <FiPackage size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    <span>¡Listo para retirar!</span>
                  </div>
                )}
                {order.status === "withdrawn" && (
                  <div className="completed-info">
                    <FiPackage size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    <span>Pedido completado</span>
                  </div>
                )}
                {order.status === "cancelled" && (
                  <div className="cancelled-info">
                    <FiPackage size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    <span>Pedido cancelado</span>
                  </div>
                )}
                {order.status === "pending_payment" && (
                  <div className="pending-payment-info">
                    <FiPackage size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    <span>Estamos esperando la confirmación de tu pago.</span>
                  </div>
                )}
                {canShowRepentButton(order) && (
                  <div className="repent-window">
                    <div className="repent-text">
                      Puedes cancelar este pedido por arrepentimiento durante las primeras 24 horas.
                    </div>
                    <div className="repent-row">
                      <div className="repent-time">
                        Tiempo restante: {remainingHoursToCancel(order)}h
                      </div>
                      <button
                        className="cancel-button solid"
                        onClick={() => setOrderToCancel(order)}
                      >
                        Cancelar pedido
                      </button>
                    </div>
                  </div>
                )}
                <div className="order-actions">
                  <button
                    className="view-details-btn"
                    onClick={() => setSelectedOrder(order)}
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalles del pedido {selectedOrder.orderNumber}</h2>
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
                    <strong>Fecha del pedido:</strong>
                    <span>
                      {new Date(selectedOrder.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <strong>Estado:</strong>
                    <span className={getStatusBadgeClass(selectedOrder.status)}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <strong>Total:</strong>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                  {selectedOrder.pickupDate && (
                    <div className="detail-item">
                      <strong>Fecha de retiro:</strong>
                      <span>
                        {new Date(selectedOrder.pickupDate).toLocaleString()}
                      </span>
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
                        src={orderService.getItemImage(item.image)}
                        alt={item.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            orderService.getItemImage();
                        }}
                      />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>Cantidad: {item.quantity}</p>
                        {item.size && <p>Talla: {item.size}</p>}
                        <p className="item-price">
                          ${item.price.toFixed(2)} c/u
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.history && selectedOrder.history.length > 0 && (
                <div className="order-detail-section">
                  <h4>Historial de estados</h4>

                  <div className="status-history-list">
                    {selectedOrder.history.map((hist, index) => (
                      <div key={index} className="history-item">
                        <span className="history-date">
                          {new Date(hist.statusDate).toLocaleString()}
                        </span>
                        <span className="history-status">
                          {getStatusLabel(hist.description)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              {selectedOrder && canShowRepentButton(selectedOrder) && (
                <div className="repent-window inline">
                  <div className="repent-text">
                    Puedes cancelar este pedido por arrepentimiento durante las primeras 24 horas.
                  </div>
                  <div className="repent-row">
                    <div className="repent-time">
                      Horas restantes: {remainingHoursToCancel(selectedOrder)}h
                    </div>
                    <button
                      className="cancel-button solid"
                      onClick={() => setOrderToCancel(selectedOrder)}
                    >
                      Cancelar pedido
                    </button>
                  </div>
                </div>
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

      {orderToCancel && (
        <div className="modal-overlay" onClick={() => setOrderToCancel(null)}>
          <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header confirm-header">
              <h2>Confirmar cancelación</h2>
              <button
                className="close-modal confirm-close"
                onClick={() => setOrderToCancel(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="confirm-message">¿Está seguro que quiere cancelar el pedido?</p>
            </div>
            <div className="modal-footer confirm-actions">
              <button
                className="neutral-button"
                onClick={() => setOrderToCancel(null)}
              >
                VOLVER
              </button>
              <button
                className="confirm-button"
                onClick={() => cancelOrder(orderToCancel)}
              >
                CANCELAR PEDIDO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
