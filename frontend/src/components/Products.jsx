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
import { useCart } from './CartContext.jsx';

function Products() {

  const { addToCart } = useCart();

  const products = [
    {
      name: "Camiseta titular",
      price: 22000,
      img: camTitular
    },
    {
      name: "Camiseta alternativa",
      price: 24000,
      img: camAlternativa
    },
    {
      name: "Pantalón de entrenamiento",
      price: 30000,
      img: panEntrenamiento
    },
    {
      name: "Gorra",
      price: 15000,
      img: gorra
    },
    {
      name: "Medias",
      price: 35000,
      img: medias
    }
  ];

  return (
    <>
    
      <div className="filtro">
        <div className="filtro-dropdown">
          <button className="btnFlechaAbajo">
            <FontAwesomeIcon icon={faFilter} /> Filtrar por <FontAwesomeIcon icon={faCaretDown} />
          </button>
          <ul className="filters">
            <li><Link to="#">Precio: menor a mayor</Link></li>
            <li><Link to="#">Precio: mayor a menor</Link></li>
            <li><Link to="#">A - Z</Link></li>
          </ul>
        </div>
      </div>

      <div className="contenedorProd">
        {products.map(product => (
          <Product 
            key={product.id}
            {...product}
            onAddToCart={() => addToCart(product)}
          />
        ))}
      </div>
    </>
  );
}

export default Products;



