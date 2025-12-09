import api from "./api";
import type {
  BackendOrder,
  PaginatedOrders,
  FrontendOrder,
  FrontendOrderItem,
  FrontendOrderStatus,
} from "../types/order";

const API_URL = "";


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

  const latestStatus = (order.latestStatus?.description ?? order.statusHistory?.[0]?.description) as FrontendOrderStatus | undefined;

  let status: FrontendOrderStatus;
  if (latestStatus) {
    status = latestStatus;
  } else if (order.actualPickupDate) {
    status = "withdrawn";
  } else if (order.statusMp === "unpaid") {
    status = "cancelled";
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
    pickupDate: order.expectedPickupDate,
    canCancel: !order.actualPickupDate && order.statusMp !== "paid",
    statusMp: order.statusMp,
    history: order.statusHistory || [],
    latestStatus: order.latestStatus ?? order.statusHistory?.[0],
  };
  return mapped;
};

export const getItemImage = (fallback?: string) => {

  if (!fallback) return "/placeholder-image.jpg";

  if (fallback.startsWith("/uploads")) {
    const host =
      (import.meta as any).env?.VITE_API_HOST || "http://localhost:3000";
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

const cancelOrder = async (id: number) => {
  try {
    const response = await api.put(`/orders/regret/${id}`);
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
  cancelOrder,
  getSportsStats,
  getStatusStats,
  mapOrderToFrontend,
  getMonthlyWorth,
  getItemImage,
};

export default orderService;
