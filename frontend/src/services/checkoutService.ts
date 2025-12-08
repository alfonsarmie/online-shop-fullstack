import api from "./api";
import type { CartItem } from "../types/cart";
import type { User } from "../types/user";

export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  notes?: string;
  sport?: string;
  expectedPickupDate?: string;
}

type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

const validateCheckoutForm = (data: CheckoutFormData): ValidationResult => {
  const errors: string[] = [];
  if (!data.name || data.name.trim().length === 0)
    errors.push("Nombre requerido");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email))
    errors.push("Email inválido");
  if (!data.phone || data.phone.trim().length === 0)
    errors.push("Teléfono requerido");


  if (data.expectedPickupDate) {

    const parts = data.expectedPickupDate.split("-");
    if (parts.length === 3) {
      const [yyyy, mm, dd] = parts.map((p) => parseInt(p, 10));
      if (
        !Number.isFinite(yyyy) ||
        !Number.isFinite(mm) ||
        !Number.isFinite(dd)
      ) {
        errors.push("Fecha de retiro inválida");
      } else {
        const picked = new Date(yyyy, mm - 1, dd);
        // Normalize today's date to local midnight
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (!(picked > today)) {
          errors.push(
            "La fecha estimada de retiro debe ser posterior a la fecha actual"
          );
        }
      }
    } else {
      errors.push("Formato de fecha de retiro inválido");
    }
  }
  return { isValid: errors.length === 0, errors };
};

// Create a Mercado Pago preference in the backend so the user is redirected to the checkout UI.
const createPaymentPreference = async (
  checkoutData: CheckoutFormData,
  items: CartItem[],
  user: User
) => {
  try {
    const cartItems = items.map((item) => ({
      id: Number(item.idProduct),
      idProduct: Number(item.idProduct),
      title: item.name,
      name: item.name,
      quantity: item.quantity,
      unit_price: Number(item.price),
      price: Number(item.price),
      sizeId: item.sizeId !== undefined ? Number(item.sizeId) : undefined,
    }));

    const payload = {
      cartItems,
      storedUser: {
        ...user,
        idUser: Number(user.idUser),
        email: user.email ?? checkoutData.email ?? "",
        name: user.name ?? checkoutData.name ?? "",
      },
      checkoutData,
    };

    const response = await api.post(
      "/payments/create-checkout-preference",
      payload
    );

    const data = response.data || {};
    const redirectUrl = data.init_point || data.sandbox_init_point || data.url;

    if (!redirectUrl) {
      throw new Error(
        `No redirect URL returned from backend: ${JSON.stringify(data)}`
      );
    }

    return {
      init_point: redirectUrl,
      sandbox_init_point: data.sandbox_init_point || redirectUrl,
      raw: data,
    };
  } catch (error: any) {
    // If axios error, include status and response data to help debugging
    if (error?.response) {
      const status = error.response.status;
      const data = error.response.data;
      throw new Error(`Request failed (${status}): ${JSON.stringify(data)}`);
    }
    throw error;
  }
};

export const checkoutService = {
  validateCheckoutForm,
  createPaymentPreference,
};

export default checkoutService;
