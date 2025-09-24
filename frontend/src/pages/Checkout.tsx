import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import "../styles/checkout.css";
import { useCart } from "../components/CartContext";
import { useNavigate } from "react-router-dom";
import { CartItem } from "../types/cart";
import WhatsAppButton from "../components/WhatsAppButton";
import ProgressBar from "../components/ProgressBar";
import { User } from "../types/user";

// Form data interface
interface FormData {
  name: string;
  email: string;
  phone: string;
  notes: string;
  deportes: string[];
}

// Get user from localStorage (same as App.tsx)
function getLoggedUser(): User | null {
  const savedUser = localStorage.getItem("user");
  if (savedUser) return JSON.parse(savedUser);
  return null;
}

// Page for handling checkout process
const Checkout = () => {
  // Access cart items and navigation
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [isFormValid, setIsFormValid] = useState(false);

  // Redirect to products if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/");
    }
  }, [cartItems, navigate]);

  // Calculate subtotal and total
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal;

  // Form states
  const [formData, setFormData] = useState<FormData>(() => {
    const user = getLoggedUser();
    return {
      name: user ? `${user.name} ${user.surname ?? ""}`.trim() : "",
      email: user?.email || "",
      phone: user?.phone || "",
      notes: "",
      deportes: [],
    };
  });

  // Handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Hlde manejar cambios en los checkboxes de deportes
  const handleDeporteChange = (deporte: string, checked: boolean) => {
    setFormData((prev) => {
      if (checked) {
        return { ...prev, deportes: [...prev.deportes, deporte] };
      } else {
        return { ...prev, deportes: prev.deportes.filter((d) => d !== deporte) };
      }
    });
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    navigate("/payment");
  };

  // Function to format prices, example: 1000 -> 1,000.00
  const formatPrice = (price: number) => {
    return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Validate form fields
  useEffect(() => {
    const { name, email, phone } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid =
      name.trim() !== "" && emailRegex.test(email) && phone.trim() !== "";
    setIsFormValid(isValid);
  }, [formData]);

  // (Opcional) Si el usuario cambia durante la sesión, actualizar el form
  useEffect(() => {
    const user = getLoggedUser();
    setFormData((prev) => ({
      ...prev,
      name: user ? `${user.name} ${user.surname ?? ""}`.trim() : "",
      email: user?.email || "",
      phone: user?.phone || "",
    }));
  }, []);

  return (
    <>
      <ProgressBar currentStep="Información" />
      <main>
        <div className="data-container">
          <div className="form-container">
            <form onSubmit={handleSubmit} className="checkout-form">
              <h3>Tus detalles</h3>
              <div className="form__group_checkout field">
                <input
                  type="text"
                  className="form__field nameInput"
                  placeholder="Nombre completo"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="name" className="form__label">
                  Nombre completo
                </label>
              </div>


                <div className="form__group_checkout field">
                  <input
                    type="email"
                    className="form__field emailInput"
                    placeholder="Correo electrónico"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="email" className="form__label">
                    Correo electrónico
                  </label>
                </div>
                <div className="form__group_checkout field">
                  <input
                    type="text"
                    className="form__field phoneInput"
                    placeholder="Teléfono"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="phone" className="form__label">
                    Teléfono
                  </label>
                </div>

              <div className="form__group_checkout field">
                <textarea
                  className="form__field notesInput"
                  placeholder="Observaciones (opcional)"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange as any}
                  rows={3}
                  style={{ resize: "vertical" }}
                />
                <label htmlFor="notes" className="form__label">
                  Observaciones (opcional)
                </label>
              </div>

              {/* Sports checkboxes */}
              <div style={{ margin: "18px 0 10px 0" }}>
                <span className="deportes-label">¿Qué deporte/s practicás?</span>
                <span className="deportes-opcional">(opcional)</span>
                <div className="deportes-container">
                  {['hockey', 'futbol', 'futsal', 'voley', 'remo', 'natación', 'vela', 'tenis'].map((dep) => (
                    <label key={dep} className="deporte-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.deportes.includes(dep)}
                        onChange={e => handleDeporteChange(dep, e.target.checked)}
                      />
                      {dep.charAt(0).toUpperCase() + dep.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                onClick={() => navigate("/payment")}
                disabled={!isFormValid}
                className={isFormValid ? "allow" : "disabled"}
              >
                CONTINUAR
              </button>
            </form>
          </div>
        </div>

        <div className="cart-container">
          <div className="cart-header">
            <h2>
              Tu carrito |{" "}
              <span id="itemCount">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>{" "}
              Artículos
            </h2>
          </div>
          <div className="cart-items">
            {cartItems.length === 0 ? (
              <p>No hay artículos en el carrito</p>
            ) : (
              cartItems.map((item: CartItem) => (
                <div
                  key={`${item.name}-${item.size || ""}`}
                  className="cart-item"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      width="60"
                      style={{ borderRadius: "8px" }}
                    />
                    <div>
                      <h3 style={{ margin: 0 }}>{item.name}</h3>
                      {item.size && (
                        <p style={{ margin: "2px 0" }}>Talle: {item.size}</p>
                      )}
                      <p style={{ margin: "2px 0" }}>
                        ${item.price.toLocaleString("es-AR")} × {item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="cart-footer">
            <p className="cart-footer-item">
              Subtotal: $<span id="subtotal">{formatPrice(subtotal)}</span>
            </p>
            <p className="cart-footer-item">
              Total: $<span id="total">{formatPrice(total)}</span>
            </p>
          </div>
        </div>
        <WhatsAppButton />
      </main>
    </>
  );
};

export default Checkout;
