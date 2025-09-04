import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import FormContainer from '../components/FormContainer.jsx';
import Input from '../components/Input.jsx';
import '../styles/input.css';
import '../styles/login.css';
import axios from 'axios';

export default function LoginForm({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const isFormValid = email.trim() !== '' && password.trim() !== '';
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });

        const userData = response.data.userFound;
        const token = response.data.token;

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        setUser(userData);

        // Redirigir según rol
        if (userData.role === 'admin') {
        navigate('/admin'); // Página del panel admin
        } else {
        navigate('/'); // Página normal para cliente
        }
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
    }
    };

    return (
        <FormContainer logo={logo} title="Introduce tus datos para iniciar sesión" onSubmit={handleSubmit}>
            <Input 
            id="email" 
            type="email" 
            placeholder="Correo electrónico" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} required />

            <Input 
            id="password" 
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} required />
            <button id="login-btn" disabled={!isFormValid} className={isFormValid ? "allow" : "disabled"}>INICIAR SESIÓN</button>
            <p className="msjreg">¿Todavía no estás registrado? <a className="link_signUp" href="/SignUp">Registrate</a></p>
        </FormContainer>
    );
}
