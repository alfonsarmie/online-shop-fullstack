import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "/src/assets/img/logo.png";
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

interface LoginFormProps {
  setUser: (user: User | null) => void;
}


const API_URL = import.meta.env.VITE_API_URL;


export default function LoginForm({ setUser }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const isFormValid = email.trim() !== "" && password.trim() !== "";
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); 
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/google-login`,
        { email, password }
      );

      const userData = response.data.userFound; // Returned user data
      const token = response.data.token; // JWT token

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      setUser(userData); // Update user state in App.jsx

      setMessage("Inicio de sesión exitoso");
      setErrorMessage("");

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
      
      let errorMsg = "Error al iniciar sesión";
      
      if (error.response && error.response.data) {
        const backendMsg = error.response.data.message || error.response.data.msg;
        
        if (backendMsg) {
          errorMsg = backendMsg;
        }
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        errorMsg = "Error de conexión. Verifica tu internet e intenta nuevamente";
      } else if (error.response?.status === 500) {
        errorMsg = "Error del servidor. Por favor intenta nuevamente";
      }
      
      setErrorMessage(errorMsg);
      setTimeout(() => {
        setErrorMessage("");
      }, 5000); 
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/google-login`,
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
      console.error("Google login failed:", error.response?.data || error.message);
      
      let errorMsg = "Error al iniciar sesión con Google";
      
      if (error.response && error.response.data) {
        const backendMsg = error.response.data.message || error.response.data.msg;
        
        if (backendMsg) {
          errorMsg = backendMsg;
        }
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        errorMsg = "Error de conexión. Verifica tu internet e intenta nuevamente";
      }
      
      setErrorMessage(errorMsg);
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };

  return (
    <div className="form-page">
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
    </div>
  );
}
