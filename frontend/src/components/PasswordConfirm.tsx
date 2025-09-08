import { ChangeEvent, useState, MouseEvent } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importar iconos de ojo

// Props interface for PasswordConfirm component
interface PasswordConfirmProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  match: string;
  color: string;
  name: string;
  onClick?: (e: MouseEvent<HTMLInputElement>) => void; // ← Agregar esta línea
}

// Password confirmation input with match validation
export default function PasswordConfirm({ 
  value, 
  onChange, 
  match, 
  color, 
  name, 
  onClick // ← Agregar esta prop
}: PasswordConfirmProps) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="form__group field password-confirm-container">
            {/* Password confirmation input field */}
            <input
                type={showPassword ? "text" : "password"}
                id={name}
                name={name}
                className="form__field"
                placeholder="Confirmar Contraseña"
                value={value}
                onChange={onChange}
                onClick={onClick} // ← Pasar la prop
                required
            />
            {/* Floating label for confirmation field */}
            <label htmlFor={name} className="form__label">
                Confirmar Contraseña <span className='required'>*</span>
            </label>

            {/* Eye icon to toggle password visibility */}
            <button 
                type="button" 
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>

            {/* Validation message showing password match status */}
            <div style={{ marginTop: 5, fontWeight: 'bold', color, fontFamily: 'Afacad' }}>
                {match}
            </div>
        </div>
    );
}