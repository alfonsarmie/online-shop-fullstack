import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/img/logo.png';
import FormContainer from '../components/FormContainer';
import PasswordInput from '../components/PasswordInput';
import PasswordConfirm from '../components/PasswordConfirm';
import SuccessMessage from '../components/SuccessMessage';
import ErrorMessage from '../components/ErrorMessage';
import { submitNewPassword } from '../services/authService';
import '../styles/password-reset.css';

type Requirement = { text: string; valid: boolean };
type StrengthLevel = { strength: number; width: string; label: string; color: string };

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [requirements, setRequirements] = useState<Requirement[]>([
    { text: 'Debe tener al menos 6 caracteres', valid: false },
    { text: 'Debe contener al menos una mayúscula', valid: false },
    { text: 'Debe contener al menos un número', valid: false },
  ]);
  const [passwordStrength, setPasswordStrength] = useState<StrengthLevel>({
    strength: 0,
    width: '0%',
    label: '',
    color: '#d0d0d0',
  });
  const [matchMessage, setMatchMessage] = useState('');
  const [matchColor, setMatchColor] = useState('');

  const strengthLevels: StrengthLevel[] = useMemo(
    () => [
      { strength: 0, width: '0%', label: '', color: '#d0d0d0' },
      { strength: 1, width: '33%', label: 'Débil', color: '#d9534f' },
      { strength: 2, width: '66%', label: 'Media', color: '#f0ad4e' },
      { strength: 3, width: '100%', label: 'Fuerte', color: '#5cb85c' },
    ],
    []
  );

  const validatePassword = () => /^(?=.*[A-Z])(?=.*\d).{6,200}$/.test(newPassword);

  useEffect(() => {
    const updatedRequirements: Requirement[] = [
      { text: 'Debe tener al menos 6 caracteres', valid: newPassword.length >= 6 },
      { text: 'Debe contener al menos una mayúscula', valid: /[A-Z]/.test(newPassword) },
      { text: 'Debe contener al menos un número', valid: /\d/.test(newPassword) },
    ];
    setRequirements(updatedRequirements);

    const completed = updatedRequirements.filter((req) => req.valid).length;
    setPasswordStrength(strengthLevels[completed]);

    if (!confirmPassword) {
      setMatchMessage('');
      setMatchColor('');
    } else if (newPassword === confirmPassword) {
      setMatchMessage('Las contraseñas coinciden');
      setMatchColor('#5cb85c');
    } else {
      setMatchMessage('Las contraseñas no coinciden');
      setMatchColor('#d9534f');
    }
  }, [newPassword, confirmPassword, strengthLevels]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      setErrorMessage('Token de restablecimiento no valido.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    if (!validatePassword()) {
      setErrorMessage('La contraseña no cumple los requisitos.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await submitNewPassword(token, newPassword);
      setSuccessMessage('Tu contraseña se actualizó correctamente. Ya puedes iniciar sesión.');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => navigate('/login'), 2500);
    } catch (error) {
      let message = 'No pudimos actualizar tu contraseña. Intenta nuevamente.';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message ?? message;
      }
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    Boolean(newPassword.trim() && confirmPassword.trim()) &&
    requirements.every((req) => req.valid) &&
    newPassword === confirmPassword &&
    !isSubmitting;

  return (
    <div className="form-page">
      <div className="password-reset-container">
        <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />
        <ErrorMessage message={errorMessage} onClose={() => setErrorMessage('')} />
        <FormContainer
          logo={logo}
          title="Crear nueva contraseña"
          onSubmit={handleSubmit}
        >
          <p className="password-reset-description">
            Escribe una contraseña segura y luego confírmala para terminar el proceso.
          </p>
          <ul className="password-requirements">
            {requirements.map((req) => (
              <li key={req.text} className={req.valid ? 'valid' : 'invalid'}>
                {req.text}
              </li>
            ))}
          </ul>
          <PasswordInput
            name="new-password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            strength={passwordStrength}
          />
          <PasswordConfirm
            name="confirm-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            match={matchMessage}
            color={matchColor}
          />
          <button
            type="submit"
            className="password-reset-submit"
            disabled={!isFormValid}
          >
            {isSubmitting ? 'actualizando...' : 'Guardar contraseña'}
          </button>
        </FormContainer>
      </div>
    </div>
  );
}


