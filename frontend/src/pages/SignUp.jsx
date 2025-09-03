import { useState, useEffect } from 'react';
import logo from '../assets/img/logo.png';
import FormContainer from '../components/FormContainer.jsx';
import Input from '../components/Input.jsx';
import PasswordInput from '../components/PasswordInput.jsx';
import PasswordConfirm from '../components/PasswordConfirm.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import '../styles/input.css';
import '../styles/signUp.css';
import axios from 'axios';

export default function SignUp() {
    const [formData, setFormData] = useState({
        fullName: '',
        lastName: '',
        dni: '',
        email: '',
        password: '',
        confirmPassword: '',
        file: null
    });

    const [passwordStrength, setPasswordStrength] = useState({ strength: 0, label: '', color: '', width: '0%' });
    const [matchMessage, setMatchMessage] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    const handleChange = (e) => {
        const { id, value, files } = e.target;
        if (id === 'file-upload') {
            const file = files[0];
            setFormData(prev => ({ ...prev, file }));
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => setImagePreview(e.target.result);
                reader.readAsDataURL(file);
            } else {
                setImagePreview('');
            }
        } else {
            setFormData(prev => ({ ...prev, [id]: value }));
        }
    };

    useEffect(() => {
        const { password, confirmPassword, fullName, lastName, email, dni } = formData;
        let strength = 0;
        if (password.length >= 6) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        const strengthMap = [
            { width: '0%', label: '', color: '' },
            { width: '25%', label: 'Débil', color: 'red' },
            { width: '50%', label: 'Media', color: 'orange' },
            { width: '75%', label: 'Fuerte', color: 'green' },
            { width: '100%', label: 'Muy fuerte', color: 'darkgreen' }
        ];
        setPasswordStrength({ strength, ...strengthMap[strength] });

        if (!confirmPassword) {
            setMatchMessage('');
        } else if (password === confirmPassword) {
            setMatchMessage('Las contraseñas coinciden');
        } else {
            setMatchMessage('Las contraseñas no coinciden');
        }

        const valid = fullName && lastName && email && dni && password && confirmPassword && password === confirmPassword;
        setIsFormValid(valid);
    }, [formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/users/create', {
                fullName: formData.fullName,
                lastName: formData.lastName,
                dni: formData.dni,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                file: formData.file
            });
            console.log('Registro exitoso:', response.data);
        } catch (error) {
            console.error('Error en el registro:', error);
        }
    };

    return (
        <FormContainer logo={logo} title="Introduce tus datos para registrarte" onSubmit={handleSubmit}>
            <Input id="fullName" type="text" placeholder="Nombre" value={formData.fullName} onChange={handleChange} required />
            <Input id="lastName" type="text" placeholder="Apellido" value={formData.lastName} onChange={handleChange} required />
            <Input id="email" type="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required />
            <Input id="dni" type="number" placeholder="DNI (opcional)" value={formData.dni} onChange={handleChange} required={false} />

            <PasswordInput value={formData.password} onChange={handleChange} strength={passwordStrength} />
            <PasswordConfirm value={formData.confirmPassword} onChange={handleChange} match={matchMessage} color={formData.password === formData.confirmPassword ? 'green' : 'red'} />
            <ImageUpload file={formData.file} onChange={handleChange} preview={imagePreview} />

            <button id="submit-btn" disabled={!isFormValid} className={isFormValid ? 'allow' : 'disabled'}>
                CREAR CUENTA
            </button>

            <p className="msjreg">¿Ya tenés cuenta? <a className="msjreg login_link" href="/login">Inicia sesión</a></p>
        </FormContainer>
    );
}
