import { Link } from 'react-router-dom';
import '../styles/nav.css';
import '../index.css';
import logo from '../assets/img/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCartShopping, faBars } from '@fortawesome/free-solid-svg-icons';
import { useCart } from './CartContext';
import DropdownMenu from './DropdownMenu';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
    window.scrollTo(0, 0); // Scroll al top
  };
  const { openCart, cartCount } = useCart();

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
            <li>
              <DropdownMenu />
            </li>
            <li><Link to="/about-us">ACERCA DE NOSOTROS</Link></li>
            <li><Link to="/">FORMAS DE ENTREGA</Link></li>
          </ul>
        </div>

        <div className="btnsRight">
          <Link to="/login" className="btnLogIn">
            <FontAwesomeIcon icon={faUser} />
          </Link>
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
