import api from "./api";
import type {
  BackendOrder,
  PaginatedOrders,
  FrontendOrder,
  FrontendOrderItem,
  FrontendOrderStatus,
  OrderStatusHistory,
  FrontendOrderStatusHistory,
} from "../types/order";

const API_URL = "";

const normalizeStatus = (status?: string | null): FrontendOrderStatus => {
  if (!status) return "confirmed";
  const cleaned = status.toLowerCase().replace(/[-\s]+/g, "_");
  const allowed: FrontendOrderStatus[] = [
    "confirmed",
    "ready",
    "withdrawn",
    "cancelled",
    "pending_payment",
  ];
  return allowed.includes(cleaned as FrontendOrderStatus)
    ? (cleaned as FrontendOrderStatus)
    : "confirmed";
};

const normalizeHistory = (
  history?: OrderStatusHistory[]
): FrontendOrderStatusHistory[] =>
  (history || []).map((entry) => ({
    ...entry,
    description: normalizeStatus(entry.description),
  }));

export const mapOrderToFrontend = (order: BackendOrder): FrontendOrder => {
  const items: FrontendOrderItem[] = (order.orderLines || []).map((line) => ({
    id: line.idProduct,
    name: line.product?.name || line.product_name,
    quantity: line.quantity,
    price:
      typeof line.subtotal === "number"
        ? line.subtotal / Math.max(1, line.quantity)
        : Number(line.subtotal) / Math.max(1, line.quantity),
    size: line.size,

    image: line.product_image || undefined,
  }));

  const normalizedHistory = normalizeHistory(order.statusHistory);
  const normalizedLatest = order.latestStatus
    ? {
        ...order.latestStatus,
        description: normalizeStatus(order.latestStatus.description),
      }
    : normalizedHistory[0] ?? null;

  let status: FrontendOrderStatus;
  if (normalizedLatest) {
    status = normalizedLatest.description;
  } else if (order.PickupDate) {
    status = "withdrawn";
  } else if (order.statusMp === "unpaid") {
    status = "pending_payment";
  } else {
    status = "confirmed";
  }

  const mapped = {
    id: order.idOrder,
    orderNumber: `ORD-${String(order.idOrder || 0).padStart(4, "0")}`,
    date: order.orderDate,
    sport: typeof order.sport === "string" ? order.sport : undefined,
    status,
    total:
      typeof order.total_amount === "number"
        ? order.total_amount
        : Number(order.total_amount || 0),
    items,
    pickupDate: order.PickupDate || undefined,
    canCancel: !order.PickupDate && order.statusMp !== "paid",
    statusMp: order.statusMp,
    history: normalizedHistory,
    latestStatus: normalizedLatest,
  };
  return mapped;
};

export const getItemImage = (fallback?: string) => {

  if (!fallback) return "/placeholder-image.jpg";

  if (fallback.startsWith("/uploads")) {
    const host =
      (import.meta as any).env?.VITE_API_URL || "http://localhost:3000";
    return `${host}${fallback}`;
  }
  return fallback;
};


const getOrders = async (params?: { page?: number; limit?: number }) => {
  try {
    const response = await api.get<PaginatedOrders>("/orders", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};


const getUserOrders = async (userId: number) => {
  try {
    const response = await api.get<{ orders: BackendOrder[] } | BackendOrder[]>(
      `/orders/user/${userId}`
    );
    const data = response.data;
    if (Array.isArray(data)) return data;
    return data.orders || [];
  } catch (error) {
    throw error;
  }
};

const updateOrderStatus = async (
  id: number,
  payload: { description: string }
) => {
  try {
    const response = await api.post(`/status/${id}/create`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getSportsStats = async () => {
  try {
    const response = await api.get('/orders/sports');
    return response.data.stats;
  } catch (error) {
    throw error;
  }
};

const getStatusStats = async () => {
  try {
    const response = await api.get('/orders/status');
    return response.data.stats;
  } catch (error) {
    throw error;
  }
};

// Fetch monthly worth
const getMonthlyWorth = async () => {
  try {
    const response = await api.get('/orders/worth');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const orderService = {
  getOrders,
  getUserOrders,
  updateOrderStatus,
  getSportsStats,
  getStatusStats,
  mapOrderToFrontend,
  getMonthlyWorth,
  getItemImage,
};

export default orderService;
