import api from "./api";
import type { CartItem } from "../types/cart";

export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  notes?: string;
  deporte?: string;
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

  // If expectedPickupDate is provided, ensure it's strictly greater than today
  if (data.expectedPickupDate) {
    // Expecting format 'YYYY-MM-DD' from input[type=date]
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

// Create a Stripe Checkout Session in the backend.
// Important: we send minimal product info to the backend so the backend can
// create the session and (after payment) create the order server-side.
const createPaymentPreference = async (
  checkoutData: CheckoutFormData,
  items: CartItem[],
  user: { idUser: number; email?: string; name?: string }
) => {
  try {
    // Map items to the shape the backend expects: { idProduct, quantity }
    const lineItems = items.map((it) => ({
      idProduct: Number(it.id),
      quantity: it.quantity,
    }));

    // Format expectedPickupDate from YYYY-MM-DD to DD-MM-YYYY (with hyphens) if provided
    const pad = (s: string) => s.padStart(2, "0");
    const formatToDDMMYYYY = (d?: string) => {
      if (!d) return undefined;
      const parts = d.split("-");
      if (parts.length !== 3) return d.replace(/[^0-9-]/g, ""); // fallback: strip everything except digits and hyphen
      const [yyyy, mm, dd] = parts;
      return `${pad(dd)}-${pad(mm)}-${yyyy}`;
    };

    const payload = {
      user: { idUser: user.idUser },
      customer: {
        name: checkoutData.name,
        email: checkoutData.email || user.email,
        phone: checkoutData.phone,
      },
      items: lineItems,
      notes: checkoutData.notes,
      deporte: (checkoutData as any).deporte || "",
      expectedPickupDate: formatToDDMMYYYY(checkoutData.expectedPickupDate),
    };

    // Call backend endpoint that creates a Stripe Checkout Session
    const response = await api.post("/checkout/create_session", payload);

    // backend may return different field names (url, sessionUrl, checkoutUrl, init_point)
    const data = response.data || {};
    const redirectUrl =
      data.url || data.sessionUrl || data.checkoutUrl || data.init_point;

    // Maintain compatibility with existing Payment.tsx which expects init_point or sandbox_init_point
    return {
      init_point: redirectUrl,
      sandbox_init_point: redirectUrl,
      raw: data,
    };
  } catch (error) {
    throw error;
  }
};

export const checkoutService = {
  validateCheckoutForm,
  createPaymentPreference,
};

export default checkoutService;
