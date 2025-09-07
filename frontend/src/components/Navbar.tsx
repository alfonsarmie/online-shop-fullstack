import { Link, useNavigate } from 'react-router-dom';
import '../styles/nav.css';
import '../index.css';
import logo from '../assets/img/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCartShopping, faBars } from '@fortawesome/free-solid-svg-icons';
import { useCart } from './CartContext';
import DropdownMenu from './DropdownMenu';
import { User } from '../types/user';
import { useState } from 'react'; 
import UserSidebar from './UserSideBar'; 

// Navbar props interface
interface NavbarProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

function Navbar({ user, setUser }: NavbarProps) {
  const navigate = useNavigate();
  const { openCart, cartCount } = useCart();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state

  // Navigate to home and scroll to top
  const handleHomeClick = () => {
    navigate('/');
    window.scrollTo(0, 0);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/'); // Redirect to home after logout
  };

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
      <nav>
        <div className="nav-toggle" id="navToggle">
          <FontAwesomeIcon icon={faBars} />
        </div>

        <div className="nav-left" onClick={handleHomeClick}>
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>

        <div className="nav-links" id="navLinks">
          <ul>
            <li onClick={handleHomeClick}><Link to="/">INICIO</Link></li>
            <li><DropdownMenu /></li>
            <li><Link to="/about-us">ACERCA DE NOSOTROS</Link></li>
            <li><Link to="/delivery">FORMAS DE ENTREGA</Link></li>
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
              
              {user.role === 'admin' && (
                <Link to="/admin" className="admin-link">Panel Admin</Link>
              )}

{/* User Sidebar is only displayed if user exists */}
              <UserSidebar 
                isOpen={isSidebarOpen}
                onClose={closeUserSidebar}
                user={user}
                setUser={setUser}
              />
            </>
          ) : (
            <Link to="/login" className="btnLogIn">
              <FontAwesomeIcon icon={faUser} />
            </Link>
          )}

          <button onClick={openCart} className="cart-icon cart-btn">
            <FontAwesomeIcon icon={faCartShopping} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;