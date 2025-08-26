import Input from './input.jsx';

export default function PasswordInput({ value, onChange, strength }) {
    return (
        <Input
            type="password"
            id="password"
            placeholder="Contraseña"
            value={value}
            onChange={onChange}
            required
        >
            <div className="strength-bar">
                <div
                    className="strength-fill"
                    style={{ width: strength.width, backgroundColor: strength.color }}
                ></div>
            </div>
            <div id="strength-text" style={{ color: strength.color }}>
                {strength.label}
            </div>
        </Input>
    );
}
