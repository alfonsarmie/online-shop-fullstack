import api from './api';
import {
  BackendOrder,
  FrontendOrder,
  FrontendOrderItem,
  FrontendOrderStatus,
  MercadoPagoStatus,
  PaginatedOrders,
} from '../types/order';

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  userId?: number;
  status?: MercadoPagoStatus;
  search?: string;
  fromDate?: string;
  toDate?: string;
}

export interface UpdateOrderStatusPayload {
  description: string;
  status?: string;
  statusMp?: MercadoPagoStatus;
  payment_id?: string;
}

const FRONT_STATUSES: Record<MercadoPagoStatus, FrontendOrderStatus> = {
  pending: 'pending',
  in_process: 'processing',
  approved: 'completed',
  rejected: 'cancelled',
  cancelled: 'cancelled',
  refunded: 'cancelled',
  charged_back: 'cancelled',
};

const DEFAULT_IMAGE =
  'https://via.placeholder.com/60x60?text=Producto';

const parseDecimal = (value: number | string | undefined): number => {
  if (value === undefined) return 0;
  if (typeof value === 'number') return value;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const mapOrderToFrontend = (order: BackendOrder): FrontendOrder => {
  console.log('🔄 Mapping order to frontend:', order);
  
  const items: FrontendOrderItem[] = (order.orderLines || []).map((line, index) => {
    const quantity = line.quantity || 0;
    const subtotal = parseDecimal(line.subtotal);
    const unitPrice = quantity > 0 ? subtotal / quantity : subtotal;

    return {
      id: line.idProduct ?? index,
      name: line.product?.name || line.product_name,
      quantity,
      price: unitPrice,
      size: line.size ?? undefined,
      image: undefined,
    };
  });

  console.log('📦 Mapped items:', items);

  const total = parseDecimal(order.total_amount);
  const statusMp = order.statusMp ?? 'pending';
  const status = FRONT_STATUSES[statusMp] ?? 'pending';
  const history = [...(order.statusHistory ?? [])].sort(
    (a, b) =>
      new Date(b.statusDate).getTime() - new Date(a.statusDate).getTime()
  );

  return {
    id: order.idOrder,
    orderNumber: `ORD-${order.idOrder.toString().padStart(4, '0')}`,
    date: order.orderDate,
    status,
    total,
    items,
    pickupDate: order.expectedPickupDate ?? undefined,
    canCancel: status === 'pending' || status === 'processing',
    statusMp,
    history,
  };
};

export const orderService = {
  async getOrders(params: GetOrdersParams = {}) {
    const response = await api.get<PaginatedOrders>('/orders', { params });
    return {
      ...response.data,
      orders: response.data.orders,
    };
  },

  async getUserOrders(userId: number) {
    const response = await api.get<{ orders: BackendOrder[] }>(
      `/orders/user/${userId}`
    );
    return response.data.orders;
  },

  async getOrderById(id: number) {
    const response = await api.get<BackendOrder>(`/orders/${id}`);
    return response.data;
  },

  async updateOrderStatus(id: number, payload: UpdateOrderStatusPayload) {
    const response = await api.patch<{ order: BackendOrder; message: string }>(
      `/orders/${id}/status`,
      payload
    );
    return response.data;
  },

  async deleteOrder(id: number) {
    await api.delete(`/orders/${id}`);
  },
};

export const getItemImage = (): string => DEFAULT_IMAGE;
