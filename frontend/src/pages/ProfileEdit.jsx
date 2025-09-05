import React, { useState } from 'react';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import PasswordConfirm from '../components/PasswordConfirm';
import '../styles/profileEdit.css';


const ProfileEdit = () => {
    const [profile, setProfile] = useState({
    nombre: '',
    email: '',
    telefono: '',
    imagen: null,
  });

  const [preview, setPreview] = useState(null);
  const [passwords, setPasswords] = useState({
    actual: '',
    nueva: '',
    confirmar: '',
  });

  const handleProfileChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };


  const handlePasswordChange = e => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = e => {
    e.preventDefault();
    alert('Perfil actualizado');
  };

  const handlePasswordSubmit = e => {
    e.preventDefault();
    if (passwords.nueva !== passwords.confirmar) {
      alert('Las contraseñas no coinciden');
      return;
    }
    alert('Contraseña actualizada');
  };

  return (
    <div className="profile-edit-container">
      <h2>Editar Perfil</h2>
      <form onSubmit={handleProfileSubmit}>

        <Input
          label="Nombre"
          name="nombre"
          value={profile.nombre}
          onChange={handleProfileChange}
          placeholder={'Ingresa tu nombre'}
        />
        <Input
          label="Email"
          name="email"
          value={profile.email}
          onChange={handleProfileChange}
          placeholder={'Ingresa tu email'}
        />
        <Input
          label="Teléfono"
          name="telefono"
          value={profile.telefono}
          placeholder={'Ingresa tu teléfono'}
          onChange={handleProfileChange}
        />
        <button type="submit">Guardar cambios</button>
      </form>

      <h2>Cambiar Contraseña</h2>
      <form onSubmit={handlePasswordSubmit}>
        <PasswordInput
          label="Contraseña actual"
          name="actual"
          value={passwords.actual}
          onChange={handlePasswordChange}
          placeholder={'Ingresa tu contraseña actual'}
        />
        <PasswordInput
          label="Nueva contraseña"
          name="nueva"
          value={passwords.nueva}
          onChange={handlePasswordChange}
          placeholder={'Ingresa tu nueva contraseña'}
        />
        <PasswordConfirm
          label="Confirmar nueva contraseña"
          name="confirmar"
          value={passwords.confirmar}
          onChange={handlePasswordChange}
          placeholder={'Confirma tu nueva contraseña'}
        />
        <button type="submit">Actualizar contraseña</button>
      </form>
    </div>
  );
};

export default ProfileEdit;