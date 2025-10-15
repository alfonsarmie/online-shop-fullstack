import Input from "./Input";
import { ChangeEvent, useState, MouseEvent } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface Strength {
  width: string;
  color: string;
  label: string;
}

interface PasswordInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  strength?: Strength;
  placeholder?: string;
  name: string;
  onClick?: (e: MouseEvent<HTMLInputElement>) => void;
}

export default function PasswordInput({
  value,
  onChange,
  strength,
  placeholder,
  name,
  onClick
}: PasswordInputProps) {
  const hasStrength = strength !== undefined;
  const safeStrength = strength ?? { width: "0%", color: "#ccc", label: "" };
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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
        onClick={onClick}
        required
      />

      {hasStrength && (
        <>
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
        </>
      )}

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
