// UserSidebar.tsx (corregido)
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/userSidebar.css';
import { User } from '../types/user'; // Importar el tipo User

// Interface for the component props
interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null; // Usar el tipo User importado
  setUser: (user: User | null) => void; // Corregir el tipo
  setSuccessMessage: (message: string) => void;
}

// User Side Panel Component
const UserSidebar: React.FC<UserSidebarProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  setUser, 
  setSuccessMessage 
}) => {
  const navigate = useNavigate();

  // Function to log out the user
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    onClose();
    setSuccessMessage('Cierre de sesión exitoso');
    navigate('/');
  };

  // Function to edit profile
  const handleEditProfile = () => {
    navigate('/profile-edit');
    onClose();
  };

  return (
    <>
      {/* Overlay to close the panel when clicking outside */}
      <div className={`user-sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>

      {/* Side panel */}
      <div className={`user-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header panel */}
        <div className="user-sidebar-header">
          <h2>Mi Cuenta</h2>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        {/* User information */}
        <div className="user-info">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
            {user?.surname?.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <h3>{user?.name} {user?.surname}</h3>
            <p>{user?.email}</p>
            {user?.role && <span className="user-role">{user.role}</span>}
          </div>
        </div>

        {/* Additional user information */}
        <div className="additional-info">
          {user?.phone && (
            <div className="info-item">
              <strong>Teléfono:</strong>
              <span>{user.phone}</span>
            </div>
          )}
          {user?.dni && (
            <div className="info-item">
              <strong>DNI:</strong>
              <span>{user.dni}</span>
            </div>
          )}
        </div>

        {/* User options */}
        <div className="user-options">
          {/* Edit profile link (hidden for receptionists) */}
          {user?.role !== 'receptionist' && (
            <Link 
              to="/profile-edit" 
              className="option-link edit-profile"
              onClick={onClose}
            >
              Editar Perfil
            </Link>
          )}

          {/* Log out link */}
          <a 
            href="#" 
            className="option-link logout"
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
          >
            Cerrar Sesión
          </a>
        </div>
      </div>
    </>
  );
};

export default UserSidebar;
