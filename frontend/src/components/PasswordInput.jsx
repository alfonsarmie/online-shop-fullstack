import Input from './input.jsx';

// Password input component with strength indicator
export default function PasswordInput({ value, onChange, strength, placeholder }) {
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