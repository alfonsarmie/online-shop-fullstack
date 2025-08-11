import { Link } from 'react-router-dom';
import '../index.css';
import '../styles/styles.css';
import '../styles/signUp.css';
import logo from '../assets/img/logo.png';
import { useState } from "react";
import { useEffect } from 'react';
import Input from './input.jsx';
import '../styles/input.css'

function FormSignUp() {
    const [formData, setFormData] = useState({
    fullName: '',
    lastName: '',
    dni: '',
    email: '',
    password: '',
    confirmPassword: '',
    file: null
  });

  const [passwordStrength, setPasswordStrength] = useState({ strength: 0, label: '', color: '' });
  const [matchMessage, setMatchMessage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

const handleChange = (e) => {
  const { id, value, files } = e.target;

  if (id === 'file-upload') {
    const file = files[0];
    setFormData(prev => ({ ...prev, file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview('');
    }
  } else {
    let key = id;
    if (id === 'confirm-password') key = 'confirmPassword';
    setFormData(prev => ({ ...prev, [key]: value }));
  }
};


  useEffect(() => {
    const { password, confirmPassword, fullName, lastName, email, dni } = formData;
    // Check password strength
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const strengthMap = [
      { width: '0%', label: '', color: '' },
      { width: '25%', label: 'Débil', color: 'red' },
      { width: '50%', label: 'Media', color: 'orange' },
      { width: '75%', label: 'Fuerte', color: 'green' },
      { width: '100%', label: 'Muy fuerte', color: 'darkgreen' }
    ];
    setPasswordStrength({ strength, ...strengthMap[strength] });

    // Check password match
    if (confirmPassword === '') {
      setMatchMessage('');
    } else if (password === confirmPassword) {
      setMatchMessage('Las contraseñas coinciden');
    } else {
      setMatchMessage('Las contraseñas no coinciden');
    }

    // Form validation
    const valid = fullName && lastName && email && dni && password && confirmPassword && password === confirmPassword;
    setIsFormValid(valid);
  }, [formData]);

  return (
    <div>

      <form className="container">
        <img src={logo} alt="Logo del sitio" />
        <h1>Introduce tus datos para registrarte</h1>

        {['Nombre', 'Apellido', 'Correo electrónico', 'DNI (opcional)'].map((field, idx) => (
          <div className="form__group field" key={idx}>
            <Input
              type={field === 'Correo electrónico' ? 'email' : field === 'DNI (opcional)' ? 'number' : 'text'}
              className="form__field"
              id={field}
              placeholder={field}
              value={formData[field]}
              onChange={handleChange}
              required={field !== 'DNI'} // Hacemos que solo sea requerido si NO es DNI
            />
          </div>
        ))}

        <div className="form__group field">
          <Input
            type="password"
            className="form__field"
            id="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div className="strength-bar">
            <div className="strength-fill" style={{ width: passwordStrength.width, backgroundColor: passwordStrength.color }}></div>
          </div>
          <div id="strength-text" style={{ color: passwordStrength.color }}>{passwordStrength.label}</div>
        </div>

        <div className="form__group field">
          <input
            type="password"
            id="confirm-password"
            className="form__field"
            placeholder="Confirmar Contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <label htmlFor="confirm-password" className="form__label">Confirmar Contraseña</label>
          <div id="match-message" style={{ marginTop: 5, fontWeight: 'bold', color: formData.password === formData.confirmPassword ? 'green' : 'red' }}>{matchMessage}</div>
          {imagePreview && <img id="image-preview" src={imagePreview} alt="Vista previa" style={{ maxWidth: 150, marginTop: 10, borderRadius: 8 }} />}
        </div>

        <div className="form__group field img_group">
          <input type="file" id="file-upload" className="form__field img_field" onChange={handleChange} />
          <label htmlFor="file-upload" className="form__label img_label">Imagen de perfil</label>
          <label htmlFor="file-upload" className="upload_label">Seleccionar archivo</label>
          {formData.file && <span style={{ fontSize: '0.9em', color: '#666' }}>Archivo seleccionado: {formData.file.name}</span>}
        </div>

        <button id="submit-btn" disabled={!isFormValid} className={isFormValid ? 'allow' : 'disabled'}>CREAR CUENTA</button>

        <p className="msjreg">¿Ya tenés cuenta? <a className="msjreg login_link" href="/login">Inicia sesión</a></p>
      </form>

    </div>
  );
}
export default FormSignUp; 