import { Link } from 'react-router-dom';
import '../index.css';
import '../styles/preProducts.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faBagShopping, faCreditCard, IconDefinition } from '@fortawesome/free-solid-svg-icons';

// Interface for feature items
interface Feature {
  icon: IconDefinition;
  text: string;
}

function PreProducts() {
  // Features array for promotional scrolling banner
  const features: Feature[] = [
    { icon: faLock, text: 'Sitio seguro' },
    { icon: faBagShopping, text: 'Retiros en el club' },
    { icon: faCreditCard, text: 'Hasta 3 cuotas sin interés' }
  ];

  // Duplicate array for infinite scroll effect
  const duplicatedFeatures = [...features, ...features, ...features];

  return (
    <div className="preProductos">
      {/* Scrolling promotional features banner */}
      <div className="scrolling-container">
        <ul className="features-list">
          {duplicatedFeatures.map((item, index) => (
            <li key={index}>
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PreProducts;