import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faFilter } from '@fortawesome/free-solid-svg-icons';
import '../styles/products.css';
import '../styles/productFilters.css';

const ProductFilter = ({ activeFilter, onFilterChange }) => {
    // State for filter dropdown visibility
  const [showFilters, setShowFilters] = useState(false);

  // Handle filter selection and close dropdown
  const handleFilterClick = (filterType) => {
    onFilterChange(filterType);
    setShowFilters(false);
  };

  return (
    <div className="filtro">
      <div className="filtro-dropdown">
      {/* Filter dropdown toggle button */}
        <button 
          className={`btnFlechaAbajo ${activeFilter ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FontAwesomeIcon icon={faFilter} className='icon-filter'/> 
          {activeFilter === 'price_asc' ? 'Precio: menor a mayor' :
           activeFilter === 'price_desc' ? 'Precio: mayor a menor' :
           activeFilter === 'name_asc' ? 'A - Z' : 'Filtrar por'}
          <FontAwesomeIcon icon={faCaretDown} className='icon-filter' />
        </button>
        
        {/* Filter options dropdown */}
        {showFilters && (
          <ul className="filters">
            
              <Link 
                to="#" 
                onClick={() => handleFilterClick('price_asc')}
                className={activeFilter === 'price_asc' ? 'active' : ''}
              >
                <li>
                  Precio: menor a mayor
                </li>
              </Link>
              
            <Link 
                to="#" 
                onClick={() => handleFilterClick('price_desc')}
                className={activeFilter === 'price_desc' ? 'active' : ''}
              >
                <li>
                  Precio: mayor a menor
                </li>
              </Link>
  
            <Link 
                to="#" 
                onClick={() => handleFilterClick('name_asc')}
                className={activeFilter === 'name_asc' ? 'active' : ''}
              >
                <li>
                  A - Z
                </li>
              </Link>
            
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductFilter;