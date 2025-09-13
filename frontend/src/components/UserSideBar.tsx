// UserSidebar.tsx 
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/userSidebar.css';
import { User } from '../types/user';

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
  setSuccessMessage: (message: string) => void;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  setUser, 
  setSuccessMessage 
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    onClose();
    setSuccessMessage('Cierre de sesión exitoso');
    navigate('/');
  };

  const handleEditProfile = () => {
    navigate('/profile-edit');
    onClose();
  };

  const handleMyOrders = () => {
    navigate('/my-orders');
    onClose();
  };

  const role = (user?.role || '').toLowerCase();

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Mi Cuenta</h2>
          <button className="close-btn-sidebar" onClick={onClose}>✖</button>
        </div>

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

        <div className="additional-info">
          {user?.phone && (
            <div className="info-user">
              <strong>Teléfono:</strong>
              <span>{user.phone}</span>
            </div>
          )}
          {user?.dni && (
            <div className="info-user">
              <strong>DNI:</strong>
              <span>{user.dni}</span>
            </div>
          )}
        </div>

        <div className="sidebar-options">
          {/* Mis Pedidos - Solo clientes (no admin ni recepcionista) */}
          {role !== 'admin' && role !== 'receptionist' && (
            <button 
              className="option-btn my-orders"
              onClick={handleMyOrders}
            >
              Mis Pedidos
            </button>
          )}

          {/* Editar Perfil - Oculto para recepcionistas */}
          {role !== 'receptionist' && (
            <button 
              className="option-btn edit-profile"
              onClick={handleEditProfile}
            >
              Editar Perfil
            </button>
          )}

          {/* Cerrar Sesión */}
          <button 
            className="option-btn logout"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  );
};

export default UserSidebar;
