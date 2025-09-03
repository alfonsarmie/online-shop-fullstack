export default function PasswordConfirm({ value, onChange, match, color }) {
    return (
        <div className="form__group field">
            <input
                type="password"
                id="confirmPassword"
                className="form__field"
                placeholder="Confirmar Contraseña"
                value={value}
                onChange={onChange}
                required
            />
            <label htmlFor="confirmPassword" className="form__label">
                Confirmar Contraseña
            </label>
            <div style={{ marginTop: 5, fontWeight: 'bold', color, fontFamily: 'Afacad' }}>
                {match}
            </div>
        </div>
    );
}
