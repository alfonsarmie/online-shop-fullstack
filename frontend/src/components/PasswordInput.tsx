import Input from './Input';
import { ChangeEvent } from 'react';

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
}

// Password input component with strength indicator
export default function PasswordInput({ value, onChange, strength, placeholder }: PasswordInputProps) {
    // Default strength values to prevent errors
    const safeStrength = strength || { width: '0%', color: '#ccc', label: '' };

    return (
        <Input
            type="password"
            id="password"
            placeholder={placeholder || "Contraseña"}
            value={value}
            onChange={onChange}
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
    );
}