import '../styles/input.css';

function Input({ type, id, placeholder, value, onChange, required, children }) {
    return (
        <div className="form__group field">
            <input
                type={type}
                className="form__field"
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
            />
            <label htmlFor={id} className="form__label">
                {placeholder}
            </label>
            {children}
        </div>
    );
}

export default Input;