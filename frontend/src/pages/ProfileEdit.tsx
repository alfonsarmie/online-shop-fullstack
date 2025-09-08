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
    const [profile, setProfile] = useState<Profile>({
    name: '',
    email: '',
    phone: '',
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

  // Handlers for password changes
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // Handlers for form submissions
  const handleProfileSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert('Perfil actualizado');
  };

  // Handler for password form submission
  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert('Las contraseñas no coinciden');
      return;
    }
    alert('Contraseña actualizada');
  };

  return (
    <div className="profile-edit-container">
      <h2>Editar Perfil</h2>
      
      <div className="profile-edit-columns">
        <div className="profile-column">
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <h3>Información Personal</h3>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Ingresa tu nombre"
              value={profile.name}
              onChange={handleProfileChange}
              required
            />
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Ingresa tu email"
              value={profile.email}
              onChange={handleProfileChange}
              required
            />
            <Input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Ingresa tu teléfono"
              value={profile.phone}
              onChange={handleProfileChange}
              required
            />
            
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