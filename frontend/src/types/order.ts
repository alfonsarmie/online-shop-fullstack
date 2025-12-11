export type MercadoPagoStatus =
  | 'paid'
  | 'unpaid'
  | 'no_payment_required';

export interface OrderStatusHistory {
  idOrder: number;
  statusDate: string;
  description: string;
}

export interface FrontendOrderStatusHistory extends OrderStatusHistory {
  description: FrontendOrderStatus;
}

export interface BackendOrderLine {
  idOrder: number;
  idProduct: number;
  quantity: number;
  subtotal: number | string;
  size?: string;
  product_name: string;
  product_image?: string;
  product?: {
    idProduct: number;
    name: string;
    description?: string;
  };
}

export interface BackendOrder {
  idOrder: number;
  orderDate: string;
  PickupDate?: string;
  idUser: string;
  idPaymentMethod: number;
  external_reference?: string;
  payment_id?: string;
  total_amount: number | string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_notes?: string;
  sport?: string | undefined;
  statusMp?: MercadoPagoStatus;
  currencyId?: string;
  paymentMethod?: {
    name: string;
  };
  pickup_code?: string | null;
  pickup_used?: boolean | number | null;
  pickupCode?: string | null;
  pickupUsed?: boolean | number | null;
  user?: {
    idUser: string;
    name: string;
    email: string;
  };
  orderLines: BackendOrderLine[];
  statusHistory: OrderStatusHistory[];
  latestStatus?: OrderStatusHistory | null;
}

export interface PaginatedOrders {
  orders: BackendOrder[];
  total: number;
  page: number;
  totalPages: number;
}

export interface FrontendOrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  size?: string;
  image?: string;
}

export type FrontendOrderStatus =
  | 'confirmed'
  | 'ready'
  | 'withdrawn'
  | 'cancelled'
  | 'pending_payment';

export interface FrontendOrder {
  id: number;
  orderNumber: string;
  date: string;
  sport?: string | undefined;
  status: FrontendOrderStatus;
  total: number;
  items: FrontendOrderItem[];
  pickupDate?: string;
  pickupCode?: string;
  pickupUsed?: boolean;
  canCancel: boolean;
  statusMp?: MercadoPagoStatus;
  history: FrontendOrderStatusHistory[];
  latestStatus?: FrontendOrderStatusHistory | null;
}
