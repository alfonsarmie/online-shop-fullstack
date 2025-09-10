/**
 * Admin Navigation Bar
 * Purpose: top navigation for all `/admin/*` pages.
 * Reuses public navbar styles for visual consistency and exposes admin links.
 */
import { Link } from 'react-router-dom';
import '../styles/nav.css';
import '../index.css';
import logo from '../assets/img/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import { User } from '../types/user';
import { useState, useEffect } from 'react';
import UserSidebar from './UserSideBar';
import SuccessMessage from './SuccessMessage';

// Navbar props interface
// Props contract: current user (or null) and a setter to update auth state
interface NavbarProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

function NavBarAdmin({ user, setUser }: NavbarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Efecto para limpiar automáticamente el mensaje después de 3 segundos
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000); // 3 segundos

      // Limpiar el timer si el componente se desmonta o el mensaje cambia
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Removed custom home click; logo link handles navigation

  // Toggle options menu
  const openOptions = () => {
    const optionsMenu = document.getElementById('optionsMenu');
    if (optionsMenu) {
      optionsMenu.classList.toggle('show');
    }
  };

  // Open user sidebar
  const openUserSidebar = () => {
    setIsSidebarOpen(true);
  };

  // Close user sidebar
  const closeUserSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div>
      {/* SuccessMessage a nivel superior */}
      <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />
      
      <nav>
        <div className="nav-toggle" id="navToggle">
          <FontAwesomeIcon icon={faBars} />
        </div>

        <div className="nav-left">
          <Link to="/admindashboard"> {/* debería renderizarse el dashboard */}
            <img src={logo} alt="logo" />
          </Link>
        </div>

        <div className="nav-links" id="navLinks">
          <ul>
            <li><Link to="/admindashboard">ESTADÍSTICAS</Link></li>
            <li><Link to="/adminorders">PEDIDOS</Link></li>
            <li><Link to="/adminproducts">PRODUCTOS</Link></li>
          </ul>
        </div>

        <div className="btnsRight">

          {/* conditional rendering */}
          {user ? (
            <>
              {/* Button to open user sidebar */}
              <button onClick={openUserSidebar} className="userOptions">
                <span className="user-name">Hola, {user.name}!</span>
              </button>

              {/* User Sidebar is only displayed if user exists */}
              <UserSidebar
                isOpen={isSidebarOpen}
                onClose={closeUserSidebar}
                user={user}
                setUser={setUser}
                setSuccessMessage={setSuccessMessage}
              />
            </>
          ) : (
            <Link to="/login" className="btnLogIn">
              <FontAwesomeIcon icon={faUser} />
            </Link>
          )}

        </div>
      </nav>
    </div>
  );
}

export default NavBarAdmin;
