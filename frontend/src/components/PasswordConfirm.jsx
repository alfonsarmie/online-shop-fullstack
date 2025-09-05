
// Password confirmation input with match validation
export default function PasswordConfirm({ value, onChange, match, color }) {
    return (
        <div className="form__group field">
            {/* Password confirmation input field */}
            <input
                type="password"
                id="confirmPassword"
                className="form__field"
                placeholder="Confirmar Contraseña"
                value={value}
                onChange={onChange}
                required
            />
            {/* Floating label for confirmation field */}
            <label htmlFor="confirmPassword" className="form__label">
                Confirmar Contraseña
            </label>

            {/* Validation message showing password match status */}
            <div style={{ marginTop: 5, fontWeight: 'bold', color, fontFamily: 'Afacad' }}>
                {match}
            </div>
        </div>
    );
}
