import '../styles/input.css';
import { ChangeEvent, ReactNode, MouseEvent } from 'react';

interface InputProps {
  type: string;
  id?: string;
  name?: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  children?: ReactNode;
  onClick?: (e: MouseEvent<HTMLInputElement>) => void; 
}

function Input({ 
  type, 
  id, 
  name, 
  placeholder, 
  value, 
  onChange, 
  required, 
  children, 
  onClick 
}: InputProps) {
    const inputId = id || name;
    
    return (
        <div className="form__group field">
            <input
                type={type}
                className="form__field"
                id={inputId}
                name={name || id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                onClick={onClick} 
            />

            <label htmlFor={inputId} className="form__label">
                {placeholder}{required && <span className='required'>*</span>}
            </label>
            {children}
        </div>
    );
}

export default Input;