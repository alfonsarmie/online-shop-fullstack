import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faFilter } from '@fortawesome/free-solid-svg-icons';
import '../styles/products.css';
import '../styles/productFilters.css';

const ProductFilter = ({ activeFilter, onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterClick = (filterType) => {
    onFilterChange(filterType);
    setShowFilters(false);
  };

  return (
    <div className="filtro">
      <div className="filtro-dropdown">
        <button 
          className={`btnFlechaAbajo ${activeFilter ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FontAwesomeIcon icon={faFilter} /> 
          {activeFilter === 'price_asc' ? 'Precio: menor a mayor' :
           activeFilter === 'price_desc' ? 'Precio: mayor a menor' :
           activeFilter === 'name_asc' ? 'A - Z' : 'Filtrar por'}
          <FontAwesomeIcon icon={faCaretDown} />
        </button>
        
        {showFilters && (
          <ul className="filters">
            <li>
              <Link 
                to="#" 
                onClick={() => handleFilterClick('price_asc')}
                className={activeFilter === 'price_asc' ? 'active' : ''}
              >
                Precio: menor a mayor
              </Link>
            </li>
            <li>
              <Link 
                to="#" 
                onClick={() => handleFilterClick('price_desc')}
                className={activeFilter === 'price_desc' ? 'active' : ''}
              >
                Precio: mayor a menor
              </Link>
            </li>
            <li>
              <Link 
                to="#" 
                onClick={() => handleFilterClick('name_asc')}
                className={activeFilter === 'name_asc' ? 'active' : ''}
              >
                A - Z
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductFilter;