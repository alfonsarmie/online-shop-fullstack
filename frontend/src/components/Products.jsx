import { Link } from 'react-router-dom';
import '../index.css';
import '../styles/styles.css';
import '../styles/products.css';
import Product from './Product.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faFilter } from '@fortawesome/free-solid-svg-icons';

function Products() {
  return (
    <>
    
      <div className="filtro">
        <div className="filtro-dropdown">
          <button className="btnFlechaAbajo">
            <FontAwesomeIcon icon={faFilter} /> Filtrar por <FontAwesomeIcon icon={faCaretDown} />
          </button>
          <ul className="filters">
            <Link to="#"><a href="#">Precio: menor a mayor</a></Link>
            <li><Link to="#"><a href="#">Precio: menor a mayor</a></Link></li>
            <li><Link to="#"><a href="#">Precio: mayor a menor</a></Link></li>
            <li><Link to="#"><a href="#">A - Z</a></Link></li>
          </ul>
        </div>
      </div>
    <div className="contenedorProd">
      <Product />
      <Product />
      <Product />
      <Product />
      <Product />

    </div>
    </>
  );
}

export default Products;



