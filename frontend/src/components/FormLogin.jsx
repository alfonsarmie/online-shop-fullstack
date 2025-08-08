import { Link } from 'react-router-dom';
import '../index.css';
import '../styles/styles.css';
import '../styles/login.css';
import logo from '../assets/img/logo.png';
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  return (
    <form className="container">
      <img src={logo} alt="Logo del sitio" />
      <h1>Introduce tus datos para iniciar sesión</h1>

      <div className="form__group field">
        <input
          id="email"
          type="email"
          className="form__field"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="email" className="form__label">
          Correo electrónico
        </label>
      </div>

      <div className="form__group field">
        <input
          id="password"
          type="password"
          className="form__field"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="password" className="form__label">
          Contraseña
        </label>
      </div>

      <button
        id="login-btn"
        disabled={!isFormValid}
        className={isFormValid ? "allow" : "disabled"}
      >
        INICIAR SESIÓN
      </button>

      <p className="msjreg">
        ¿Todavía no estás registrado?{" "}
        <a className=" link_signUp" href="/SignUp">
          Registrate
        </a>
      </p>
    </form>
  );
}

