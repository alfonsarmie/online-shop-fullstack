import api from './api';
import type {
	BackendOrder,
	PaginatedOrders,
	FrontendOrder,
	FrontendOrderItem,
	FrontendOrderStatus,
} from '../types/order';

const API_URL = '';

// Helper to map backend order to frontend shape used in MyOrders/AdminOrders
export const mapOrderToFrontend = (order: BackendOrder): FrontendOrder => {
  const items: FrontendOrderItem[] = (order.orderLines || []).map((line) => ({
    id: line.idProduct,
    name: line.product?.name || line.product_name,
    quantity: line.quantity,
    price: typeof line.subtotal === 'number' ? line.subtotal / Math.max(1, line.quantity) : Number(line.subtotal) / Math.max(1, line.quantity),
    size: line.size,
		// Backend now includes `product_image` (first image url) when available
		image: line.product_image || undefined,
  }));

  const latestStatus = (order.latestStatus?.description ?? order.statusHistory?.[0]?.description) as
    | FrontendOrderStatus
    | undefined;

  let status: FrontendOrderStatus;
  if (latestStatus) {
    status = latestStatus;
  } else if (order.actualPickupDate) {
    status = 'withdrawn';
  } else if (order.statusMp === 'unpaid') {
    status = 'cancelled';
  } else {
    status = 'confirmed';
  }

  const mapped = {
    id: order.idOrder,
    orderNumber: `ORD-${String(order.idOrder || 0).padStart(4, '0')}`,
    date: order.orderDate,
    sport: typeof order.sport === 'string' ? order.sport : undefined,
    status,
    total: typeof order.total_amount === 'number' ? order.total_amount : Number(order.total_amount || 0),
    items,
    pickupDate: order.expectedPickupDate,
	canCancel: !(order.actualPickupDate) && order.statusMp !== 'paid',
    statusMp: order.statusMp,
    history: order.statusHistory || [],
    latestStatus: order.latestStatus ?? order.statusHistory?.[0],
  };
  return mapped;
};

export const getItemImage = (fallback?: string) => {
	// Return a placeholder image path used in the app if available
	if (!fallback) return '/placeholder-image.jpg';
	// If backend serves uploads under /uploads, prefix with backend host so browser can fetch it
	if (fallback.startsWith('/uploads')) {
		const host = (import.meta as any).env?.VITE_API_HOST || 'http://localhost:3000';
		return `${host}${fallback}`;
	}
	return fallback;
};

// Admin: get paginated orders
const getOrders = async (params?: { page?: number; limit?: number }) => {
	try {
		const response = await api.get<PaginatedOrders>('/orders', { params });
		return response.data;
	} catch (error) {
		throw error;
	}
};

// Get orders for a user (array)
const getUserOrders = async (userId: number) => {
	try {
		const response = await api.get<{ orders: BackendOrder[] } | BackendOrder[]>(`/orders/user/${userId}`);
		const data = response.data;
		if (Array.isArray(data)) return data;
		return data.orders || [];
	} catch (error) {
		throw error;
	}
};

// Update order status
const updateOrderStatus = async (
	id: number,
	payload: { status: string; statusMp?: string; description?: string }
) => {
	try {
		// New endpoint: PUT /api/status/:idOrder
		const response = await api.put(`/status/${id}`, payload);
		return response.data;
	} catch (error) {
		throw error;
	}
};

const deleteOrder = async (id: number) => {
	try {
		const response = await api.delete(`/orders/${id}`);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const orderService = {
	getOrders,
	getUserOrders,
	updateOrderStatus,
	deleteOrder,
	mapOrderToFrontend,
	getItemImage,
};

export default orderService;
