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
		image: undefined,
	}));

	// Determine frontend status
	let status: FrontendOrderStatus = 'pending';
	if (order.actualPickupDate) status = 'completed';
	else if (order.statusMp === 'approved' || order.statusMp === 'in_process') status = 'processing';
	else if (order.statusMp === 'cancelled' || order.statusMp === 'rejected' || order.statusMp === 'refunded' || order.statusMp === 'charged_back') status = 'cancelled';

	return {
		id: order.idOrder,
		orderNumber: `ORD-${order.idOrder.toString().padStart(4, '0')}`,
		date: order.orderDate,
		status,
		total: typeof order.total_amount === 'number' ? order.total_amount : Number(order.total_amount),
		items,
		pickupDate: order.expectedPickupDate,
		canCancel: !(order.actualPickupDate) && order.statusMp !== 'approved',
		statusMp: order.statusMp,
		history: order.statusHistory || [],
	};
};

export const getItemImage = (fallback?: string) => {
	// Return a placeholder image path used in the app if available
	return fallback || '/placeholder-image.jpg';
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
		const response = await api.put(`/orders/${id}/status`, payload);
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
