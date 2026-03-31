import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '/src/assets/img/logo.png';
import FormContainer from '../components/FormContainer';
import Input from '../components/Input';
import SuccessMessage from '../components/SuccessMessage';
import ErrorMessage from '../components/ErrorMessage';
import { requestPasswordReset } from '../services/authService';
import '../styles/password-reset.css';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await requestPasswordReset(trimmedEmail);
      setSuccessMessage('Si tu correo está registrado, recibirás un email con las instrucciones para restablecer la contraseña.');
    } catch (error) {
      let message = 'No pudimos enviar el correo. Intenta nuevamente en unos minutos.';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message ?? message;
      }
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = email.trim().length > 0 && !isSubmitting;

  return (
    <div className="form-page">
      <div className="password-reset-container">
        <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />
        <ErrorMessage message={errorMessage} onClose={() => setErrorMessage('')} />
        <FormContainer
          logo={logo}
          title="Recuperar contraseña"
          onSubmit={handleSubmit}
        >
          <p className="password-reset-description">
            Ingresa el correo electrónico con el que te registraste y te enviaremos un enlace para crear una nueva contraseña.
          </p>
          <Input
            type="email"
            id="reset-email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <button
            type="submit"
            className="password-reset-submit"
            disabled={!isFormValid}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar instrucciones'}
          </button>
        </FormContainer>
      </div>
    </div>
  );
}

