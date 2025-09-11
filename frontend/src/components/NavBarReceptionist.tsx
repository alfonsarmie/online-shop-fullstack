// NavBarReceiver.tsx
/**
 * NavBarReceiver
 * Purpose: Navigation bar for receptionist routes with access to stock and pending orders.
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

interface NavbarProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

function NavBarReceiver({ user, setUser }: NavbarProps) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleHomeClick = () => {
    navigate('/receptionist-orders');
    window.scrollTo(0, 0);
  };

  const openUserSidebar = () => setIsSidebarOpen(true);
  const closeUserSidebar = () => setIsSidebarOpen(false);

  return (
    <div>
      <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />
      <nav>
        <div className="nav-toggle" id="navToggle">
          <FontAwesomeIcon icon={faBars} />
        </div>

        <div className="nav-left" onClick={handleHomeClick}>
          <Link to="/receptionist-orders">
            <img src={logo} alt="logo" />
          </Link>
        </div>

        <div className="nav-links" id="navLinks">
          <ul>
            <li><Link to="/receptionist-orders">PEDIDOS PENDIENTES</Link></li>
            <li><Link to="/receptionist-stock">GESTIÓN DE STOCK</Link></li>
          </ul>
        </div>

        <div className="btnsRight">
          {user ? (
            <>
              <button onClick={openUserSidebar} className="userOptions">
                <span className="user-name">Hola, {user.name}!</span>
              </button>
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

