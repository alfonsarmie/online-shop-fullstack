import Input from './input.jsx';

export default function PasswordInput({ value, onChange, strength, placeholder }) {
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
            <div className="strength-bar">
                <div
                    className="strength-fill"
                    style={{
                        width: safeStrength.width,
                        backgroundColor: safeStrength.color
                    }}
                ></div>
            </div>
            <div id="strength-text" style={{ color: safeStrength.color }}>
                {safeStrength.label}
            </div>
        </Input>
    );
}