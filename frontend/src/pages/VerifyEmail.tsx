
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import '../styles/verify-email.css';

type LocationState = {
  email?: string;
};

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState | null) ?? null;
  const email = state?.email;

  return (
    <div className="verify-email-page form-page">
      <div className="verify-email-card">
        <img src={logo} alt="Logo de la tienda" className="verify-email-logo" />
        <h1>Revisa tu correo</h1>
        <p>
          Gracias por crear tu cuenta. Te enviamos un correo de confirmacion a{' '}
          {email ? <strong>{email}</strong> : 'tu direccion de email'}. Sigue el enlace para activar tu cuenta.
        </p>
        <p>Si no ves el correo, revisa la carpeta de spam o promociones.</p>
        <div className="verify-email-actions">
          <button
            type="button"
            className="verify-email-login-button"
            onClick={() => navigate('/login')}
          >
            Ir a iniciar sesion
          </button>
          <button
            type="button"
            className="verify-email-support-button"
            onClick={() => navigate('/')}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
