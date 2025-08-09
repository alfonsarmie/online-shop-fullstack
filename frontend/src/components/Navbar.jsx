import { Link } from 'react-router-dom';
import '../styles/nav.css';
import '../index.css';
import logo from '../assets/img/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCartShopping, faBars } from '@fortawesome/free-solid-svg-icons';
import { useCart } from './CartContext';

function Navbar() {

  const { openCart, cartCount } = useCart();

  return (
    <nav>       
      <div className="nav-toggle" id="navToggle">
        <FontAwesomeIcon icon={faBars} />
      </div>

      <div className="nav-left">
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
      </div>

      <div className="nav-links" id="navLinks">
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/products">Remeras</Link></li>
          <li><Link to="/products">Pantalones</Link></li>
          <li><Link to="/products">Camperas</Link></li>
          <li><Link to="/products">Accesorios</Link></li>
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
  );
}

export default Navbar;