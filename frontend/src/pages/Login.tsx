import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import FormContainer from '../components/FormContainer';
import Input from '../components/Input';
import '../styles/input.css';
import '../styles/login.css';
import axios from 'axios';
import { User } from '../types/user';
import SuccessMessage from '../components/SuccessMessage';

// Props interface for LoginForm component
interface LoginFormProps {
  setUser: (user: User | null) => void;
}

export default function LoginForm({ setUser }: LoginFormProps) {

    // useState to handle form data
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const isFormValid = email.trim() !== '' && password.trim() !== '';
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Handle form submission
    const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
        // Realize login request
        const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });

        const userData = response.data.userFound; // Returned user data
        const token = response.data.token; // JWT token

        // Store user data and token in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        setUser(userData); // Update user state in App.jsx

        setMessage('Inicio de sesión exitoso');
        setErrorMessage('');

        // Redirect based on role after a short delay
        setTimeout(() => {
            if (userData.role === 'admin') {
            navigate('/admin');
            } else {
            navigate('/');
            }
        }, 1500);

    } catch (error: any) {
        console.error('Login failed:', error.response?.data || error.message);
        setErrorMessage('Error al iniciar sesión');
    }
    };

    return (
        <div className='login-container'>
        <SuccessMessage message={message} onClose={() => setMessage('')} />
        <FormContainer logo={logo} title="Introduce tus datos para iniciar sesión" onSubmit={handleSubmit}>
            <Input 
            id="email" 
            type="email" 
            placeholder="Correo electrónico" 
            value={email} 
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required />

            <Input 
            id="password" 
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required />

            {/* Display success or error message */}
            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <button id="login-btn" disabled={!isFormValid} className={isFormValid ? "allow" : "disabled"}>INICIAR SESIÓN</button>
            <p className="msjreg">¿Todavía no estás registrado? <a className="link_signUp" href="/SignUp">Registrate</a></p>

        </FormContainer>
        </div>
    );
}