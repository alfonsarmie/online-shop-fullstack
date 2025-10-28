import { ChangeEvent, useState, MouseEvent } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

interface PasswordConfirmProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  match: string;
  color: string;
  name: string;
  onClick?: (e: MouseEvent<HTMLInputElement>) => void; 
}

export default function PasswordConfirm({ 
  value, 
  onChange, 
  match, 
  color, 
  name, 
  onClick 
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
                onClick={onClick} 
                required
            />
            <label htmlFor={name} className="form__label">
                Confirmar Contraseña <span className='required'>*</span>
            </label>

            <button 
                type="button" 
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>

            <div style={{ marginTop: 5, fontWeight: 'bold', color, fontFamily: 'Afacad' }}>
                {match}
            </div>
        </div>
    );
}