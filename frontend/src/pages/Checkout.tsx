import React, { useState, useEffect, ChangeEvent, FormEvent, useMemo } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "../styles/checkout.css";
import { useCart } from "../components/CartContext";
import { useNavigate } from "react-router-dom";
import { CartItem } from "../types/cart";
import WhatsAppButton from "../components/WhatsAppButton";
import ProgressBar from "../components/ProgressBar";
import { User } from "../types/user";
import { checkoutService, CheckoutFormData } from "../services/checkoutService";
import ErrorMessage from "../components/ErrorMessage";

// Form data interface
interface FormData extends CheckoutFormData {}

// Get user from localStorage (same as App.tsx)
function getLoggedUser(): User | null {
  const savedUser = localStorage.getItem("user");
  if (savedUser) return JSON.parse(savedUser);
  return null;
}

// Page for handling checkout process
const Checkout = () => {
  // Access cart items and navigation
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

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
      sport: '',
      expectedPickupDate: undefined,
    };
  });

  // Handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) {
      setFormData((prev) => ({ ...prev, expectedPickupDate: undefined }));
      return;
    }
    // store as YYYY-MM-DD
    const iso = date.toISOString().slice(0, 10);
    setFormData((prev) => ({ ...prev, expectedPickupDate: iso }));
  };

  // Handle manejar cambios en los radio buttons de deportes
  const handleSportChange = (sport: string) => {
    setFormData((prev) => ({ ...prev, sport }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    
    // Validate form
    const validation = checkoutService.validateCheckoutForm(formData);
    if (!validation.isValid) {
      setErrorMessage(validation.errors.join(", "));
      return;
    }

    // Get current user
    const currentUser = getLoggedUser();
    if (!currentUser) {
      setErrorMessage("Debes iniciar sesión para continuar");
      navigate("/login");
      return;
    }

    // Store checkout data in localStorage for the payment page
    localStorage.setItem('checkoutData', JSON.stringify(formData));
    
    // Navigate to payment page
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

  // Minimum date for pickup: tomorrow (to match validation that requires > today)
  const minPickupDate = useMemo(() => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    return t.toISOString().slice(0, 10); // YYYY-MM-DD
  }, []);

  return (
    <>
      <ProgressBar currentStep="Información" />
      <main className="page-with-nav-spacing">
        <div className="data-container">
          <div className="form-container">
            <form onSubmit={handleSubmit} className="checkout-form">
              <h3>Tus detalles</h3>
              
              {errorMessage && (
                <ErrorMessage message={errorMessage} />
              )}
              
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

              <div className="form__group_checkout field">
                <label htmlFor="expectedPickupDate" className="form__label">Fecha estimada de retiro (opcional)</label>
                <DatePicker
                  id="expectedPickupDate"
                  selected={formData.expectedPickupDate ? new Date(formData.expectedPickupDate) : null}
                  onChange={handleDateChange}
                  dateFormat="yyyy-MM-dd"
                  minDate={new Date(minPickupDate)}
                  placeholderText="Seleccionar fecha"
                  className="form__field dateInput"
                  calendarClassName="custom-react-datepicker"
                />
              </div>

              {/* Sports radio buttons */}
              <div style={{ margin: "18px 0 10px 0" }}>
                <span className="deportes-label">¿Qué deporte practicás en Rowing?</span>
                <span className="deportes-opcional">(opcional)</span>
                <div className="deportes-container">
                  <label className="deporte-checkbox">
                    <input
                      type="radio"
                      name="sport"
                      value=""
                      checked={!formData.sport}
                      onChange={() => setFormData(prev => ({ ...prev, sport: '' }))}
                    />
                    Ninguno
                  </label>
                  {['hockey', 'futbol', 'futsal', 'voley', 'remo', 'natación', 'vela', 'tenis'].map((dep) => (
                    <label key={dep} className="deporte-checkbox">
                      <input
                        type="radio"
                        name="sport"
                        value={dep}
                        checked={formData.sport === dep}
                        onChange={() => handleSportChange(dep)}
                      />
                      {dep.charAt(0).toUpperCase() + dep.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
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
