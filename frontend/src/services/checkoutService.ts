import api from './api';
import { CartItem } from '../types/cart';
import { User } from '../types/user';

// Interface for checkout form data
export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  notes: string;
  deportes: string[];
}

// Interface for order draft payload to send to backend
export interface OrderDraftPayload {
  idUser: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_notes?: string;
  sports?: string[];
  items: OrderDraftItem[];
}

export interface OrderDraftItem {
  idProduct: number;
  quantity: number;
  size?: string;
  unitPrice: number;
  name: string;
}

// Interface for the response from the payment preference creation
export interface PaymentPreferenceResponse {
  init_point?: string;
  sandbox_init_point?: string;
  orderId?: number;
  external_reference?: string;
}

// Convert cart items to order draft items
function mapCartItemsToOrderDraft(cartItems: CartItem[]): OrderDraftItem[] {
  return cartItems.map((item) => {
    // Parse the product ID from the cart item ID
    const productId = parseInt(item.id);
    if (isNaN(productId)) {
      throw new Error(`Invalid product ID: ${item.id}`);
    }

    return {
      idProduct: productId,
      quantity: item.quantity,
      size: item.size,
      unitPrice: item.price,
      name: item.name,
    };
  });
}

// Build the complete order draft payload
export function buildOrderDraftPayload(
  formData: CheckoutFormData,
  cartItems: CartItem[],
  user: User | null
): OrderDraftPayload {
  if (!user?.idUser) {
    throw new Error('Usuario no autenticado');
  }

  if (!cartItems.length) {
    throw new Error('El carrito está vacío');
  }

  const orderItems = mapCartItemsToOrderDraft(cartItems);

  return {
    idUser: user.idUser,
    customer_name: formData.name,
    customer_email: formData.email,
    customer_phone: formData.phone,
    customer_notes: formData.notes,
    sports: formData.deportes.length > 0 ? formData.deportes : undefined,
    items: orderItems,
  };
}

// Service object with checkout-related API calls
export const checkoutService = {
  // Create a payment preference for the order
  async createPaymentPreference(
    formData: CheckoutFormData,
    cartItems: CartItem[],
    user: User | null
  ): Promise<PaymentPreferenceResponse> {
    console.log('🚀 [CHECKOUT-SERVICE] Iniciando creación de preferencia...');
    console.log('👤 [CHECKOUT-SERVICE] Usuario:', { 
      idUser: user?.idUser, 
      email: user?.email, 
      name: user?.name 
    });
    console.log('📝 [CHECKOUT-SERVICE] Datos del formulario:', formData);
    console.log('🛒 [CHECKOUT-SERVICE] Items del carrito:', cartItems);
    
    const orderPayload = buildOrderDraftPayload(formData, cartItems, user);
    console.log('📦 [CHECKOUT-SERVICE] Payload de la orden:', orderPayload);

    // Map cart items to the format expected by Mercado Pago
    const preferenceItems = cartItems.map((item) => ({
      id: item.id,
      title: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: 'ARS',
      description: item.name,
      picture_url: item.img,
    }));
    console.log('💳 [CHECKOUT-SERVICE] Items para Mercado Pago:', preferenceItems);

    const payerData = {
      email: formData.email,
      name: user?.name,
      surname: user?.surname,
    };

    const requestBody = {
      items: preferenceItems,
      payer: payerData,
      orderPayload,
    };
    console.log('📤 [CHECKOUT-SERVICE] Request body completo:', requestBody);

    console.log('🌐 [CHECKOUT-SERVICE] Enviando request al backend...');
    const response = await api.post<PaymentPreferenceResponse>(
      '/payments/create-preference',
      requestBody
    );

    console.log('✅ [CHECKOUT-SERVICE] Respuesta del backend:', response.data);
    return response.data;
  },

  // Validate checkout form data
  validateCheckoutForm(formData: CheckoutFormData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push('El nombre es requerido');
    }

    if (!formData.email.trim()) {
      errors.push('El email es requerido');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.push('El email no es válido');
      }
    }

    if (!formData.phone.trim()) {
      errors.push('El teléfono es requerido');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

export default checkoutService;