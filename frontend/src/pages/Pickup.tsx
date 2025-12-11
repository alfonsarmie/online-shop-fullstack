import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../styles/pickup.css";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { orderService, mapOrderToFrontend } from "../services/orderService";
import type { FrontendOrder } from "../types/order";

const formatOrderNumber = (id?: number) => `ORD-${String(id ?? 0).padStart(4, "0")}`;

const Pickup: React.FC = () => {
  const [searchParams] = useSearchParams();
  const pickupCode = useMemo(
    () => (searchParams.get("c") || searchParams.get("code") || "").trim(),
    [searchParams]
  );

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<FrontendOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!pickupCode) {
      setError("Escanea un QR valido: no encontramos el codigo en este enlace.");
      return;
    }

    let mounted = true;
    const validate = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await orderService.validatePickupCode(pickupCode);
        const mapped = mapOrderToFrontend(result.order);
        if (!mounted) return;
        setOrder({
          ...mapped,
          pickupDate: result.order.PickupDate || mapped.pickupDate || new Date().toISOString(),
          pickupUsed: true,
        });
        setMessage(result.message || "Pedido marcado como entregado");
      } catch (err: any) {
        if (!mounted) return;
        const apiMsg = err?.response?.data?.message;
        setError(apiMsg || err.message || "No pudimos validar el QR.");
        setOrder(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    validate();
    return () => {
      mounted = false;
    };
  }, [pickupCode]);

  const totalItems = useMemo(
    () => order?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0,
    [order]
  );

  const pickupTime = order?.pickupDate
    ? new Date(order.pickupDate).toLocaleString()
    : new Date().toLocaleString();

  return (
    <div className="pickup-page">
      <div className="pickup-card">
        <header className="pickup-header">
          <div>
            <p className="pickup-label">Validacion de QR</p>
            <h1>Entrega confirmada</h1>
            <p className="pickup-subtitle">
              Validamos el QR del pedido y lo marcamos como entregado para mostrar el detalle de entrega.
            </p>
          </div>
          <div className="pickup-meta">
            {pickupCode && <span className="pickup-chip ghost">QR {pickupCode.slice(0, 6)}...</span>}
            {order && <span className="pickup-chip success">Entregado {pickupTime}</span>}
          </div>
        </header>

        {!loading && !error && message && (
          <div className="pickup-alert success">{message}</div>
        )}

        {loading && (
          <div className="pickup-state">
            <LoadingSpinner />
            <p>Validando QR y marcando el pedido como entregado...</p>
          </div>
        )}

        {error && (
          <div className="pickup-state">
            <ErrorMessage message={error} />
            <Link to="/receptionist-orders" className="pickup-button ghost">
              Volver a pedidos
            </Link>
          </div>
        )}

        {!loading && !error && order && (
          <>
            <section className="pickup-summary">
              <div>
                <p className="pickup-label">Pedido</p>
                <h2>{formatOrderNumber(order.id)}</h2>
                <p className="pickup-subtitle">
                  Cliente: {order.customerName || "Sin nombre"} · {totalItems} items
                </p>
              </div>
              <div className="pickup-amount">
                <p>Total abonado</p>
                <strong>
                  {order.total.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    maximumFractionDigits: 0,
                  })}
                </strong>
                <span className="pickup-chip">Estado: {order.status}</span>
              </div>
            </section>

            <section className="pickup-info-grid">
              <div className="pickup-info">
                <p className="pickup-label">Cliente</p>
                <h3>{order.customerName || "Sin datos"}</h3>
                <ul>
                  <li>Email: {order.customerEmail || "No informado"}</li>
                  <li>Telefono: {order.customerPhone || "No informado"}</li>
                  <li>Notas: {order.customerNotes || "Sin notas"}</li>
                </ul>
              </div>
              <div className="pickup-info">
                <p className="pickup-label">Entrega</p>
                <h3>Retiro presencial</h3>
                <ul>
                  <li>Fecha y hora: {pickupTime}</li>
                  <li>QR validado por recepcion</li>
                  <li>Pago: {order.paymentMethodName || "No informado"}</li>
                </ul>
              </div>
            </section>

            <section className="pickup-items">
              <div className="pickup-items-header">
                <div>
                  <p className="pickup-label">Detalle de productos</p>
                  <h3>Revisa antes de entregar</h3>
                </div>
                <span className="pickup-chip ghost">{totalItems} articulos</span>
              </div>
              <div className="pickup-items-list">
                {order.items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="pickup-item">
                    <div className="pickup-item-name">
                      <h4>{item.name}</h4>
                      <p>
                        Cantidad: {item.quantity} · Talle: {item.size || "Unico"}
                      </p>
                    </div>
                    <div className="pickup-item-price">
                      {(item.price * item.quantity).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        maximumFractionDigits: 0,
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="pickup-actions">
              <Link to="/receptionist-orders" className="pickup-button">
                Ver todos los pedidos
              </Link>
              <Link to="/receptionist-orders" className="pickup-button ghost">
                Registrar otro retiro
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Pickup;
