import { Link } from 'react-router-dom';
import '../index.css';
import '../styles/styles.css';
import '../styles/products.css';
import Product from './Product.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faFilter } from '@fortawesome/free-solid-svg-icons';
import camTitular from '../assets/img/camTitular.png';
import camAlternativa from '../assets/img/camSuplente.png';
import panEntrenamiento from '../assets/img/pantalonTitular.png';
import gorra from '../assets/img/gorra.png';
import medias from '../assets/img/mediaTitular.png';

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
      <Product nombre="Camiseta titular" precio={22000} img={camTitular} />
      <Product nombre="Camiseta alternativa" precio={24000} img={camAlternativa} />
      <Product nombre="Pantalón de entrenamiento" precio={30000} img={panEntrenamiento} />
      <Product nombre="Gorra" precio={15000} img={gorra} />
      <Product nombre="Medias" precio={35000} img={medias} />

    </div>
    </>
  );
}

export default Products;



