import { useState } from 'react';
import logo from '../assets/img/logo.png';
import FormContainer from '../components/FormContainer.jsx';
import Input from '../components/Input.jsx';
import '../styles/input.css';
import '../styles/login.css';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const isFormValid = email.trim() !== '' && password.trim() !== '';

    return (
        <FormContainer logo={logo} title="Introduce tus datos para iniciar sesión">
            <Input id="email" type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input id="password" type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button id="login-btn" disabled={!isFormValid} className={isFormValid ? "allow" : "disabled"}>INICIAR SESIÓN</button>
            <p className="msjreg">¿Todavía no estás registrado? <a className="link_signUp" href="/SignUp">Registrate</a></p>
        </FormContainer>
    );
}
