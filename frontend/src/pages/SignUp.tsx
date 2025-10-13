import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import FormContainer from '../components/FormContainer';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import PasswordConfirm from '../components/PasswordConfirm';
import '../styles/input.css';
import '../styles/signUp.css';
import SuccessMessage from '../components/SuccessMessage';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
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
  // Navigate programmatically to confirmation pages
  const navigate = useNavigate();
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
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    // Para el campo DNI, permitir solo números o vacío
    if (id === 'dni') {
      // Solo permitir números o campo vacío
      if (value === '' || /^\d+$/.test(value)) {
        setFormData(prev => ({ ...prev, [id]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  useEffect(() => {
    const { password, confirmPassword, name, surname, email } = formData;

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

    // Validez total del form (DNI es opcional, no se incluye en la validación)
    const valid =
      Boolean(name && surname && email) &&
      newReqs.every(r => r.valid) &&
      password === confirmPassword;

    setIsFormValid(valid);
  }, [formData]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages and start loading
    setSuccessMessage('');
    setErrorMessage('');
    setIsLoading(true);
    
    try {
      // Prepare user data, excluding confirmPassword
      const userData = {
        name: formData.name,
        surname: formData.surname,
        dni: formData.dni || undefined, // Send undefined if empty
        email: formData.email,
        password: formData.password
      };

      // Preserve the email before making the request
      const emailForNotice = formData.email;
      
      // Make the API call
      await axios.post("http://localhost:3000/api/users/create", userData);

      // Only execute this if the API call was successful
      // Clear form
      setFormData({
        name: '',
        surname: '',
        dni: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      // Send the user to the intermediate email verification notice
      navigate('/verify-email', { state: { email: emailForNotice } });

      
    } catch (error: any) {
      // Handle errors - this will only execute if the API call failed
      console.error("Error en el registro:", error.response?.data || error.message);
      
      let errorMsg = "Error en el registro. Inténtalo de nuevo.";
      
      if (error.response && error.response.data) {
        // Try to get the message from the backend response
        let backendMsg = error.response.data.message || error.response.data.msg || error.response.data.error;
        
        // Handle express-validator errors format
        if (!backendMsg && error.response.data.errors && Array.isArray(error.response.data.errors)) {
          // Extract the first error message from express-validator format
          const firstError = error.response.data.errors[0];
          if (firstError && firstError.msg) {
            backendMsg = firstError.msg;
          }
        }
        
        if (backendMsg) {
          switch (backendMsg) {
            case "Ya existe una cuenta con este correo electrónico":
              errorMsg = "Ya existe una cuenta con este correo electrónico. ¿Ya tienes cuenta? Intenta iniciar sesión";
              break;
            case "Invalid DNI value":
              errorMsg = "El DNI ingresado no es válido. Debe contener solo números";
              break;
            case "Invalid role provided":
              errorMsg = "Rol de usuario inválido";
              break;
            case "Admin token required to assign staff roles":
              errorMsg = "No tienes permisos para asignar roles administrativos";
              break;
            case "Only admin users can assign staff roles":
              errorMsg = "Solo los administradores pueden asignar roles especiales";
              break;
            case "Invalid token":
              errorMsg = "Token de autorización inválido";
              break;
            case "Error sending activation email":
              errorMsg = "Tu cuenta fue creada pero hubo un problema enviando el email de activación. Contacta al administrador";
              break;
            case "Email configuration error":
              errorMsg = "Error en la configuración del correo. Contacta al administrador";
              break;
            case "Error creating user":
              errorMsg = "Error al crear la cuenta. Por favor intenta nuevamente";
              break;
            default:
              // Use the backend message directly if it's not in our specific cases
              if (backendMsg.includes("email") || backendMsg.includes("correo")) {
                errorMsg = backendMsg;
              } else if (backendMsg.includes("DNI")) {
                errorMsg = backendMsg;
              } else {
                errorMsg = backendMsg;
              }
          }
        } else {
          // No specific message from backend, use status-based fallbacks
          if (error.response.status === 400) {
            errorMsg = "Datos inválidos. Verifica que todos los campos estén correctos";
          } else if (error.response.status === 500) {
            errorMsg = "Error del servidor. Por favor intenta nuevamente en unos minutos";
          }
        }
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        errorMsg = "Error de conexión. Verifica tu internet e intenta nuevamente";
      }
      
      setErrorMessage(errorMsg);
      setSuccessMessage('');
      
      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    } finally {
      // Always stop loading when done
      setIsLoading(false);
    }
  };

  const closeSuccessMessage = () => {
    setSuccessMessage('');
  };

  const closeErrorMessage = () => {
    setErrorMessage('');
  };

  return (
    <div className="signup-page-container">
      {/* Loading overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <LoadingSpinner />
            <p>Creando tu cuenta...</p>
          </div>
        </div>
      )}
      
      <SuccessMessage message={successMessage} onClose={closeSuccessMessage} />
      <ErrorMessage message={errorMessage} onClose={closeErrorMessage} />
      <FormContainer logo={logo} title="Introduce tus datos para registrarte" onSubmit={handleSubmit}>
        <Input id="name" type="text" placeholder="Nombre" value={formData.name} onChange={handleChange} required />
        <Input id="surname" type="text" placeholder="Apellido" value={formData.surname} onChange={handleChange} required />
        <Input id="email" type="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required />
        
        {/* DNI opcional - tipo number pero sin required */}
        <Input 
          id="dni" 
          type="number" 
          placeholder="DNI (opcional)" 
          value={formData.dni} 
          onChange={handleChange} 
          required={false} 
        />

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

        <button 
          id="submit-btn" 
          disabled={!isFormValid || isLoading} 
          className={isFormValid && !isLoading ? 'allow' : 'disabled'}
        >
          {isLoading ? 'Creando cuenta...' : 'CREAR CUENTA'}
        </button>

        <p className="msjreg">¿Ya tenés cuenta? <a className="msjreg login_link" href="/login">Inicia sesión</a></p>
      </FormContainer>
    </div>
  );
}
