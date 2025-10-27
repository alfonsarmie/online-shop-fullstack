// Screen shown after successful account activation
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import '../styles/account-activated.css';
import ErrorMessage from '../components/ErrorMessage';

export default function AccountActivated() {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isActivating, setIsActivating] = useState(true);
  const [activationSuccess, setActivationSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's an error parameter in the URL (from backend redirect)
    const errorParam = searchParams.get('error');
    if (errorParam) {
      let errorMessage = 'Error al activar la cuenta';
      switch (errorParam) {
        case 'invalid_token':
          errorMessage = 'El enlace de activación es inválido o ha expirado';
          break;
        case 'server_error':
          errorMessage = 'Error del servidor. Por favor intenta nuevamente';
          break;
        default:
          errorMessage = 'Error al activar la cuenta';
      }
      setError(errorMessage);
      setIsActivating(false);
      return;
    }

    // If no error parameter, assume activation was successful
    // (because backend already processed and redirected here)
    if (!errorParam && token) {
      setActivationSuccess(true);
      setIsActivating(false);
    } else if (!token) {
      setError('Token de activación no válido');
      setIsActivating(false);
    }
  }, [token, searchParams]);

  if (isActivating) {
    return (
      <div className="account-activated-page">
        <div className="account-activated-card">
          <img src={logo} alt="Logo de la tienda" className="account-activated-logo" />
          <h1>Activando tu cuenta...</h1>
          <div className="activation-spinner"></div>
          <p>Por favor espera mientras activamos tu cuenta.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="account-activated-page">
        <div className="account-activated-card error">
          <img src={logo} alt="Logo de la tienda" className="account-activated-logo" />
          <h1>Error de activación</h1>
          <ErrorMessage message={error} />
          <div className="account-activated-actions">
            <button
              type="button"
              className="account-activated-primary-button"
              onClick={() => navigate('/signup')}
            >
              Crear nueva cuenta
            </button>
            <button
              type="button"
              className="account-activated-secondary-button"
              onClick={() => navigate('/')}
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-activated-page form-page">
      <div className="account-activated-card success">
        <img src={logo} alt="Logo de la tienda" className="account-activated-logo" />
        <div className="success-icon">✓</div>
        <h1>¡Cuenta activada exitosamente!</h1>
        <p>
          Tu cuenta ha sido activada correctamente. Ya puedes iniciar sesión y disfrutar de todos nuestros productos.
        </p>
        <div className="account-activated-actions">
          <button
            type="button"
            className="account-activated-primary-button"
            onClick={() => navigate('/login')}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            className="account-activated-secondary-button"
            onClick={() => navigate('/')}
          >
            Explorar tienda
          </button>
        </div>
      </div>
    </div>
  );
}