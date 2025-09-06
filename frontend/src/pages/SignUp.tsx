import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import logo from '../assets/img/logo.png';
import FormContainer from '../components/FormContainer';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import PasswordConfirm from '../components/PasswordConfirm';
import '../styles/input.css';
import '../styles/signUp.css';
import axios from 'axios';

interface FormData {
  name: string;
  surname: string;
  dni: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface PasswordStrength {
  strength: number;
  label: string;
  color: string;
  width: string;
}

export default function SignUp() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    surname: '',
    dni: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    strength: 0,
    label: '',
    color: '',
    width: '0%'
  });

  const [requirements, setRequirements] = useState([
    { text: 'Debe tener al menos 6 caracteres', valid: false },
    { text: 'Debe contener al menos una mayúscula', valid: false },
    { text: 'Debe contener al menos un número', valid: false }
  ]);

  const [matchMessage, setMatchMessage] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    const { password, confirmPassword, name, surname, email, dni } = formData;

    // Requisitos de la contraseña
    const newReqs = [
      { text: 'Debe tener al menos 6 caracteres', valid: password.length >= 6 },
      { text: 'Debe contener al menos una mayúscula', valid: /[A-Z]/.test(password) },
      { text: 'Debe contener al menos un número', valid: /[0-9]/.test(password) }
    ];
    setRequirements(newReqs);

    // Fuerza de la contraseña
    const strength = newReqs.filter(r => r.valid).length;
    const strengthMap = [
      { width: '0%', label: '', color: '' },
      { width: '33%', label: 'Débil', color: 'red' },
      { width: '66%', label: 'Media', color: 'orange' },
      { width: '100%', label: 'Fuerte', color: 'green' }
    ];
    setPasswordStrength({ strength, ...strengthMap[strength] });

    // Confirmación
    if (!confirmPassword) {
      setMatchMessage('');
    } else if (password === confirmPassword) {
      setMatchMessage('Las contraseñas coinciden');
    } else {
      setMatchMessage('Las contraseñas no coinciden');
    }

    // Validez total del form
    const valid =
      Boolean(name && surname && email && dni) &&
      newReqs.every(r => r.valid) &&
      password === confirmPassword;

    setIsFormValid(valid);
  }, [formData]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/users/create", {
        name: formData.name,
        surname: formData.surname,
        dni: formData.dni,
        email: formData.email,
        password: formData.password
      });
      console.log("Registro exitoso:", response.data);
    } catch (error: any) {
      if (error.response) {
        console.error("Error en la respuesta:", error.response.data);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  return (
    <FormContainer logo={logo} title="Introduce tus datos para registrarte" onSubmit={handleSubmit}>
      <Input id="name" type="text" placeholder="Nombre" value={formData.name} onChange={handleChange} required />
      <Input id="surname" type="text" placeholder="Apellido" value={formData.surname} onChange={handleChange} required />
      <Input id="email" type="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required />
      <Input id="dni" type="number" placeholder="DNI (opcional)" value={formData.dni} onChange={handleChange} required={false} />

      <PasswordInput
        name="password" 
        value={formData.password}
        onChange={handleChange}
        strength={passwordStrength}
      />

      {/* Requisitos de la contraseña */}
      <ul className="password-requirements">
        {requirements.map((req, idx) => (
          <li key={idx} className={req.valid ? "valid" : "invalid"}>
            {req.text}
          </li>
        ))}
      </ul>

      <PasswordConfirm 
        name="confirmPassword" 
        value={formData.confirmPassword} 
        onChange={handleChange} 
        match={matchMessage} 
        color={formData.password === formData.confirmPassword ? 'green' : 'red'} 
      />

      <button id="submit-btn" disabled={!isFormValid} className={isFormValid ? 'allow' : 'disabled'}>
        CREAR CUENTA
      </button>

      <p className="msjreg">¿Ya tenés cuenta? <a className="msjreg login_link" href="/login">Inicia sesión</a></p>
    </FormContainer>
  );
}
