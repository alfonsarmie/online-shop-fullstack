// NavBarReceiver.tsx (actualizado)
/**
 * NavBarReceiver
 * Purpose: Navigation bar for receptionist routes with access to stock management.
 * Notes:
 *  - Similar to NavBarAdmin but with receptionist-specific links
 *  - Maintains consistent styling with the admin interface
 *  - Uses UserSideBar component like other navbars
 */
import { Link, useNavigate } from 'react-router-dom';
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
interface NavbarProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

function NavBarReceiver({ user, setUser }: NavbarProps) {
  const navigate = useNavigate();
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

  // Navigate to home and scroll to top
  const handleHomeClick = () => {
    navigate('/receptionist');
    window.scrollTo(0, 0);
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

        <div className="nav-left" onClick={handleHomeClick}>
          <Link to="/receptionist">
            <img src={logo} alt="logo" />
          </Link>
        </div>

        <div className="nav-links" id="navLinks">
          <ul>
            <li><Link to="/receptionist">GESTIÓN DE STOCK</Link></li>
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

export default NavBarReceiver;