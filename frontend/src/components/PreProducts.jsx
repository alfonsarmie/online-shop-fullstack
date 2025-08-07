import { Link } from 'react-router-dom';
import '../index.css';
import '../styles/styles.css';
import '../styles/preProducts.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faBagShopping, faCreditCard } from '@fortawesome/free-solid-svg-icons';

function PreProducts() {
  return (
    <div className="preProductos">
        <ul className="texto2">
            <li> <FontAwesomeIcon icon={faLock} /><span> Sitio seguro</span></li>
            <li> <FontAwesomeIcon icon={faBagShopping} /><span> Retiros en el club</span></li>
            <li> <FontAwesomeIcon icon={faCreditCard} /><span> Hasta 3 cuotas sin interés</span></li>
            <li> <FontAwesomeIcon icon={faLock} /><span> Sitio seguro</span></li>
            <li> <FontAwesomeIcon icon={faBagShopping} /><span> Retiros en el club</span></li>
            <li> <FontAwesomeIcon icon={faCreditCard} /><span> Hasta 3 cuotas sin interés</span></li>
        </ul>
        <ul className="texto2">
            <li> <FontAwesomeIcon icon={faLock} /><span> Sitio seguro</span></li>
            <li> <FontAwesomeIcon icon={faBagShopping} /><span> Retiros en el club</span></li>
            <li> <FontAwesomeIcon icon={faCreditCard} /><span> Hasta 3 cuotas sin interés</span></li>
            <li> <FontAwesomeIcon icon={faLock} /><span> Sitio seguro</span></li>
            <li> <FontAwesomeIcon icon={faBagShopping} /><span> Retiros en el club</span></li>
            <li> <FontAwesomeIcon icon={faCreditCard} /><span> Hasta 3 cuotas sin interés</span></li>
        </ul>
    </div>
  );
}

export default PreProducts;






