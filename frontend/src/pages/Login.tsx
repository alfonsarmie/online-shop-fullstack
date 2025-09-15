import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";
import FormContainer from "../components/FormContainer";
import Input from "../components/Input";
import "../styles/input.css";
import "../styles/login.css";
import axios from "axios";
import { User } from "../types/user";
import SuccessMessage from "../components/SuccessMessage";
import ErrorMessage from "../components/ErrorMessage";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import { GoogleLogin } from "@react-oauth/google";

// Props interface for LoginForm component
interface LoginFormProps {
  setUser: (user: User | null) => void;
}

export default function LoginForm({ setUser }: LoginFormProps) {
  // useState to handle form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const isFormValid = email.trim() !== "" && password.trim() !== "";
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Initially false, toggles between true/false
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // Realize login request
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password }
      );

      const userData = response.data.userFound; // Returned user data
      const token = response.data.token; // JWT token

      // Store user data and token in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      setUser(userData); // Update user state in App.jsx

      setMessage("Inicio de sesión exitoso");
      setErrorMessage("");

      // Redirect based on role after a short delay
      setTimeout(() => {
        if (userData.role === "admin") {
          navigate("/admin-dashboard");
          window.scrollTo(0, 0);
        } else if (userData.role === "receptionist") {
          navigate("/receptionist-orders");
        } else {
          navigate("/");
        }
      }, 1000);
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error.message);
      setErrorMessage("Error al iniciar sesión");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  // Handle Google login success
  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/google-login",
        { id_token: credentialResponse.credential }
      );

      const userData = response.data.user;
      const token = response.data.token;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);

      setUser(userData);
      setMessage("Inicio de sesión con Google exitoso");
      setErrorMessage("");
      setTimeout(() => {
        if (userData.role === "admin") {
          navigate("/admin-dashboard");
        } else if (userData.role === "receptionist") {
          navigate("/receptionist-orders");
        } else {
          navigate("/");
        }
      }, 1000);
    } catch (error: any) {
      setErrorMessage("Error al iniciar sesión con Google");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  return (
    <div className="login-container">
      <SuccessMessage message={message} onClose={() => setMessage("")} />
      <ErrorMessage message={errorMessage} onClose={() => setErrorMessage("")} />
      <FormContainer
        logo={logo}
        title="Introduce tus datos para iniciar sesión"
        onSubmit={handleSubmit}
      >
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => setErrorMessage("Error al iniciar sesión con Google")}
          width={300}
          text="signin_with"
          shape="pill"
        />

        <Input
          id="email"
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          required
        />

        <div className="password-input-container">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            required
          />

          {/* Eye icon to toggle password visibility */}
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <p
          className="forgot-password"
          onClick={() => navigate("/forgot-password")}
        >
          ¿Olvidaste tu contraseña?
        </p>
        <button
          id="login-btn"
          disabled={!isFormValid}
          className={isFormValid ? "allow" : "disabled"}
        >
          INICIAR SESIÓN
        </button>
        <p className="msjreg">
          ¿Todavía no estás registrado?{" "}
          <a className="link_signUp" href="/SignUp">
            Registrate
          </a>
        </p>
      </FormContainer>
    </div>
  );
}
