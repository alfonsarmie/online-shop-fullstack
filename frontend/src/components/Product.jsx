import { Link } from 'react-router-dom';
import '../index.css';
import '../styles/styles.css';
import '../styles/product.css';

function Product({nombre, precio, img}) {
  return (
    <>
        <div className="cajaProducto reveal">
          <Link to="">
            <img src={img} className="imgProd" alt={nombre}/>
            <p>{nombre}</p>
            <p className="precio">${precio} ARS</p>
          </Link>
          <button className='btnAddToCart'>Añadir al carrito</button>
        </div>
    </>
  );

}

export default Product;
