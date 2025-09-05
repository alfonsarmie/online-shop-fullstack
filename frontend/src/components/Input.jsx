import '../styles/input.css';

// Reusable input component with floating label design
function Input({ type, id, placeholder, value, onChange, required, children }) {
    return (
        <div className="form__group field">
            {/* Main input field */}
            <input
                type={type}
                className="form__field"
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
            />

            {/* Floating label that moves up when input is focused */}
            <label htmlFor={id} className="form__label">
                {placeholder}
            </label>
            {/* Optional children elements */}
            {children}
        </div>
    );
}

export default Input;