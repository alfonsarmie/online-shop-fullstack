import Input from './Input';
import { ChangeEvent, useState, MouseEvent } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importar iconos de ojo

// Interface for strength object
interface Strength {
  width: string;
  color: string;
  label: string;
}

// Props interface for PasswordInput component
interface PasswordInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  strength?: Strength;
  placeholder?: string;
  name: string;
  onClick?: (e: MouseEvent<HTMLInputElement>) => void; // ← Agregar esta línea
}

// Password input component with strength indicator
export default function PasswordInput({ 
  value, 
  onChange, 
  strength, 
  placeholder, 
  name, 
  onClick // ← Agregar esta prop
}: PasswordInputProps) {
    // Default strength values to prevent errors
    const safeStrength = strength || { width: '0%', color: '#ccc', label: '' };
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="password-input-container">
            <Input
                type={showPassword ? "text" : "password"}
                id={name}
                name={name}
                placeholder={placeholder || "Contraseña"}
                value={value}
                onChange={onChange}
                onClick={onClick} // ← Pasar la prop
                required
            >
                {/* Password strength visual indicator bar */}
                <div className="strength-bar">
                    <div
                        className="strength-fill"
                        style={{
                            width: safeStrength.width,
                            backgroundColor: safeStrength.color
                        }}
                    ></div>
                </div>
                {/* Password strength text */}
                <div id="strength-text" style={{ color: safeStrength.color }}>
                    {safeStrength.label}
                </div>
            </Input>
            {/* Eye icon to toggle password visibility */}
            <button 
                type="button" 
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
        </div>
    );
}