import { ChangeEvent } from 'react';

// Props interface for PasswordConfirm component
interface PasswordConfirmProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  match: string;
  color: string;
  name: string; // Añade esta propiedad
}

// Password confirmation input with match validation
export default function PasswordConfirm({ value, onChange, match, color, name }: PasswordConfirmProps) {
    return (
        <div className="form__group field">
            {/* Password confirmation input field */}
            <input
                type="password"
                id={name}
                name={name}
                className="form__field"
                placeholder="Confirmar Contraseña"
                value={value}
                onChange={onChange}
                required
            />
            {/* Floating label for confirmation field */}
            <label htmlFor={name} className="form__label">
                Confirmar Contraseña <span className='required'>*</span>
            </label>

            {/* Validation message showing password match status */}
            <div style={{ marginTop: 5, fontWeight: 'bold', color, fontFamily: 'Afacad' }}>
                {match}
            </div>
        </div>
    );
}