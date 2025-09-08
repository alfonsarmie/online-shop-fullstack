import React, { useState, ChangeEvent, FormEvent } from 'react';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import PasswordConfirm from '../components/PasswordConfirm';
import '../styles/profileEdit.css';
import WhatsAppButton from '../components/WhatsAppButton';

// Interface for profile data
interface Profile {
  name: string;
  email: string;
  phone: string;
}

// Interface for password data
interface Passwords {
  actual: string;
  new: string;
  confirm: string;
}

const ProfileEdit = () => {
    // Simulación de datos de usuario. Reemplazar con la lógica de tu API.
    const [profile, setProfile] = useState<Profile>({
    name: 'Nombre de Usuario',
    email: 'usuario@ejemplo.com',
    phone: '+1234567890',
  });

  // Estado para la edición de campos
  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    phone: false,
  });

  // State for password fields
  const [passwords, setPasswords] = useState<Passwords>({
    actual: '',
    new: '',
    confirm: '',
  });

  // Handlers for input changes
  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handler para activar/desactivar el modo de edición
  const toggleEditMode = (fieldName: keyof Profile) => {
    setEditMode({ ...editMode, [fieldName]: !editMode[fieldName] });
  };

  // Handlers for password changes
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // Handlers for form submissions
  const handleProfileSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert('Perfil actualizado');
    // Después de la actualización exitosa, desactiva el modo de edición
    setEditMode({ name: false, email: false, phone: false });
  };

  // Handler for password form submission
  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert('Las contraseñas no coinciden');
      return;
    }
    alert('Contraseña actualizada');
    // Limpia los campos después de la actualización
    setPasswords({ actual: '', new: '', confirm: '' });
  };

  return (
    <div className="profile-edit-container">
      <h2>Editar Perfil</h2>
      
      <div className="profile-edit-columns">
        <div className="profile-column">
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <h3>Información Personal</h3>
            
            <div className="profile-field" onClick={() => toggleEditMode('name')}>
              <label>Nombre</label>
              <div className="profile-input-container">
                {editMode.name ? (
                  <Input
                    type="text"
                    name="name"
                    placeholder="Ingresa tu nombre"
                    value={profile.name}
                    onChange={handleProfileChange}
                    required
                  />
                ) : (
                  <p>{profile.name || 'No especificado'}</p>
                )}
              </div>
            </div>

            <div className="profile-field" onClick={() => toggleEditMode('email')}>
              <label>Correo Electrónico</label>
              <div className="profile-input-container">
                {editMode.email ? (
                  <Input
                    type="email"
                    name="email"
                    placeholder="Ingresa tu correo"
                    value={profile.email}
                    onChange={handleProfileChange}
                    required
                  />
                ) : (
                  <p>{profile.email || 'No especificado'}</p>
                )}
              </div>
            </div>

            <div className="profile-field" onClick={() => toggleEditMode('phone')}>
              <label>Teléfono</label>
              <div className="profile-input-container">
                {editMode.phone ? (
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="Ingresa tu teléfono"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    required
                  />
                ) : (
                  <p>{profile.phone || 'No especificado'}</p>
                )}
              </div>
            </div>
            
            <button type="submit">Actualizar datos</button>
          </form>
        </div>

        <div className="password-column">
          <form onSubmit={handlePasswordSubmit} className="password-form">
            <h3>Cambiar Contraseña</h3>
            <PasswordInput
              name="actual"
              value={passwords.actual}
              onChange={handlePasswordChange}
              placeholder="Ingresa tu contraseña actual"
            />
            <PasswordInput
              name="new"
              value={passwords.new}
              onChange={handlePasswordChange}
              placeholder="Ingresa tu nueva contraseña"
            />
            <PasswordConfirm
              name="confirm"
              value={passwords.confirm}
              onChange={handlePasswordChange}
              match={passwords.new === passwords.confirm ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
              color={passwords.new === passwords.confirm ? 'green' : 'red'}
            />
            <button type="submit">Actualizar contraseña</button>
          </form>
        </div>
      </div>
      
      <WhatsAppButton />
    </div>
  );
};

export default ProfileEdit;