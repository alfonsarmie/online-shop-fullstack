import '../styles/input.css';

function Input({ type, id, placeholder, value, onChange, required }) {
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
        </div>
    );
}

export default Input;