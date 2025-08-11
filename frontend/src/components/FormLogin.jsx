import { Link } from 'react-router-dom';
import '../index.css';
import '../styles/styles.css';
import '../styles/login.css';
import logo from '../assets/img/logo.png';
import { useState } from "react";
import Input from './input.jsx';

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  return (
    <form className="container">
      <img src={logo} alt="Logo del sitio" />
      <h1>Introduce tus datos para iniciar sesión</h1>

      <div className="form__group field">
        <Input
          id="email"
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form__group field">
        <Input
          id="password"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
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

