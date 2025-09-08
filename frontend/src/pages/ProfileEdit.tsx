import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import PasswordConfirm from '../components/PasswordConfirm';
import '../styles/profileEdit.css';
import WhatsAppButton from '../components/WhatsAppButton';

// Interface for profile data
interface Profile {
  name: string;
  surname?: string;
  email: string;
  phone?: string;
  dni?: string;
}

// Interface for password data
interface Passwords {
  actual: string;
  new: string;
  confirm: string;
}

// Interface for password strength
interface PasswordStrength {
  strength: number;
  label: string;
  color: string;
  width: string;
}

// Interface for component props
interface ProfileEditProps {
  user: {
    name: string;
    surname?: string;
    email: string;
    phone?: string;
    dni?: string;
  } | null;
  setUser: (user: any) => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ user, setUser }) => {
  // Estado para los datos del perfil
  const [profile, setProfile] = useState<Profile>({
    name: '',
    email: '',
    phone: '',
    surname: '',
    dni: ''
  });

  // Estado original del perfil para comparar cambios
  const [originalProfile, setOriginalProfile] = useState<Profile>({
    name: '',
    email: '',
    phone: '',
    surname: '',
    dni: ''
  });

  // Cargar datos del usuario cuando el componente se monta o el user cambia
  useEffect(() => {
    if (user) {
      const userProfile = {
        name: user.name || '',
        surname: user.surname || '',
        email: user.email || '',
        phone: user.phone || '',
        dni: user.dni || ''
      };
      setProfile(userProfile);
      setOriginalProfile(userProfile);
    }
  }, [user]);

  // Estado para la edición de campos
  const [editMode, setEditMode] = useState({
    name: false,
    surname: false,
    email: false,
    phone: false,
    dni: false
  });

  // State for password fields
  const [passwords, setPasswords] = useState<Passwords>({
    actual: '',
    new: '',
    confirm: '',
  });

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    strength: 0,
    label: '',
    color: '',
    width: '0%'
  });

  const [requirements, setRequirements] = useState([
    { text: 'Debe tener al menos 6 caracteres', valid: false },
    { text: 'Debe contener al menos una mayúscula', valid: false },
    { text: 'Debe contener al menos un número', valid: false }
  ]);

  // Verificar si hay cambios en el perfil
  const hasProfileChanges = () => {
    return (
      profile.name !== originalProfile.name ||
      profile.surname !== originalProfile.surname ||
      profile.email !== originalProfile.email ||
      profile.phone !== originalProfile.phone ||
      profile.dni !== originalProfile.dni
    );
  };

  // Verificar si se puede actualizar la contraseña
  const canUpdatePassword = () => {
    return (
      passwords.actual.trim() !== '' &&
      passwords.new.trim() !== '' &&
      passwords.confirm.trim() !== '' &&
      passwords.new === passwords.confirm &&
      requirements.every(req => req.valid)
    );
  };

  // Handlers for input changes
  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handler para activar/desactivar el modo de edición
  const toggleEditMode = (fieldName: keyof Profile) => {
    setEditMode({ ...editMode, [fieldName]: !editMode[fieldName] });
  };

  // Handler para evitar que el click en el input cierre el modo edición
  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  // Handlers for password changes
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });

    // Calcular fuerza de la contraseña solo para el campo "new"
    if (name === 'new') {
      const newReqs = [
        { text: 'Debe tener al menos 6 caracteres', valid: value.length >= 6 },
        { text: 'Debe contener al menos una mayúscula', valid: /[A-Z]/.test(value) },
        { text: 'Debe contener al menos un número', valid: /[0-9]/.test(value) }
      ];
      setRequirements(newReqs);

      const strength = newReqs.filter(r => r.valid).length;
      const strengthMap = [
        { width: '0%', label: '', color: '' },
        { width: '33%', label: 'Débil', color: 'red' },
        { width: '66%', label: 'Media', color: 'orange' },
        { width: '100%', label: 'Fuerte', color: 'green' }
      ];
      setPasswordStrength({ strength, ...strengthMap[strength] });
    }
  };

  // Handler for profile form submission
  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!hasProfileChanges()) {
      alert('No hay cambios para guardar');
      return;
    }

    try {
      // Aquí iría la llamada a tu API para actualizar el perfil
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setOriginalProfile(profile); // Actualizar el estado original
        alert('Perfil actualizado correctamente');
        setEditMode({ name: false, surname: false, email: false, phone: false, dni: false });
      } else {
        alert('Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el perfil');
    }
  };

  // Handler for password form submission
  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!canUpdatePassword()) {
      alert('Por favor, completa todos los campos correctamente');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwords.actual,
          newPassword: passwords.new
        })
      });

      if (response.ok) {
        alert('Contraseña actualizada correctamente');
        setPasswords({ actual: '', new: '', confirm: '' });
        setPasswordStrength({ strength: 0, label: '', color: '', width: '0%' });
      } else {
        alert('Error al cambiar la contraseña');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cambiar la contraseña');
    }
  };

  if (!user) {
    return (
      <div className="profile-edit-container">
        <h2>Editar Perfil</h2>
        <p>Por favor, inicia sesión para acceder a esta página.</p>
      </div>
    );
  }

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
                    onClick={handleInputClick}
                    required
                  />
                ) : (
                  <p>{profile.name || 'No especificado'}</p>
                )}
              </div>
            </div>

            <div className="profile-field" onClick={() => toggleEditMode('surname')}>
              <label>Apellido</label>
              <div className="profile-input-container">
                {editMode.surname ? (
                  <Input
                    type="text"
                    name="surname"
                    placeholder="Ingresa tu apellido"
                    value={profile.surname || ''}
                    onChange={handleProfileChange}
                    onClick={handleInputClick}
                  />
                ) : (
                  <p>{profile.surname || 'No especificado'}</p>
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
                    onClick={handleInputClick}
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
                    value={profile.phone || ''}
                    onChange={handleProfileChange}
                    onClick={handleInputClick}
                  />
                ) : (
                  <p>{profile.phone || 'No especificado'}</p>
                )}
              </div>
            </div>

            <div className="profile-field" onClick={() => toggleEditMode('dni')}>
              <label>DNI</label>
              <div className="profile-input-container">
                {editMode.dni ? (
                  <Input
                    type="text"
                    name="dni"
                    placeholder="Ingresa tu DNI"
                    value={profile.dni || ''}
                    onChange={handleProfileChange}
                    onClick={handleInputClick}
                  />
                ) : (
                  <p>{profile.dni || 'No especificado'}</p>
                )}
              </div>
            </div>
            
            <button 
              type="submit" 
              className={hasProfileChanges() ? 'allow' : 'disabled'}
              disabled={!hasProfileChanges()}
            >
              Actualizar datos
            </button>
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
              strength={passwordStrength}
            />

            {/* Requisitos de la contraseña */}
            <ul className="password-requirements">
              {requirements.map((req, idx) => (
                <li key={idx} className={req.valid ? "valid" : "invalid"}>
                  {req.text}
                </li>
              ))}
            </ul>
            
            <PasswordConfirm
              name="confirm"
              value={passwords.confirm}
              onChange={handlePasswordChange}
              match={passwords.new === passwords.confirm ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
              color={passwords.new === passwords.confirm ? 'green' : 'red'}
            />
            
            <button 
              type="submit" 
              className={canUpdatePassword() ? 'allow' : 'disabled'}
              disabled={!canUpdatePassword()}
            >
              Actualizar contraseña
            </button>
          </form>
        </div>
      </div>
      
      <WhatsAppButton />
    </div>
  );
};

export default ProfileEdit;