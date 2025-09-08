import '../styles/input.css';
import { ChangeEvent, ReactNode, MouseEvent } from 'react';

// Props interface for Input component
interface InputProps {
  type: string;
  id?: string;
  name?: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  children?: ReactNode;
  onClick?: (e: MouseEvent<HTMLInputElement>) => void; // ← Agregar esta línea
}

// Reusable input component with floating label design
function Input({ 
  type, 
  id, 
  name, 
  placeholder, 
  value, 
  onChange, 
  required, 
  children, 
  onClick // ← Agregar esta prop
}: InputProps) {
    const inputId = id || name;
    
    return (
        <div className="form__group field">
            {/* Main input field */}
            <input
                type={type}
                className="form__field"
                id={inputId}
                name={name || id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                onClick={onClick} // ← Pasar la prop al input
            />

            {/* Floating label that moves up when input is focused */}
            <label htmlFor={inputId} className="form__label">
                {placeholder}{required && <span className='required'>*</span>}
            </label>
            {/* Optional children elements */}
            {children}
        </div>
    );
}

export default Input;