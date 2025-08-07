import { Link } from 'react-router-dom';
import '../styles/nav.css';
import '../index.css';
import logo from '../assets/img/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCartShopping, faBars } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
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
                <li><Link to="#productos">Productos</Link></li>
            </ul>
        </div>

        <div className="btnsRight">  
            <Link to="/login" className="btnLogIn">
              <FontAwesomeIcon icon={faUser} />
            </Link>
            <Link to="#" id="openCart" className="cart-icon">
              <FontAwesomeIcon icon={faCartShopping} />
            </Link>
        </div>
    </nav>
  );
}

export default Navbar;
