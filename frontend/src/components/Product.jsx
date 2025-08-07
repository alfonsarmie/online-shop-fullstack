import { Link } from 'react-router-dom';
import '../index.css';
import '../styles/styles.css';
import '../styles/product.css';
import camTitular from '../assets/img/camTitular.png';

function Product() {
  return (
    <>
        <div className="cajaProducto reveal">
          <Link to="producto.html">
            <img src={camTitular} className="imgProd" alt="Camiseta titular"/>
            <p>Camiseta titular</p>
            <p className="precio">$22.000 ARS</p>
          </Link>
        </div>
    </>
  );

}

export default Product;
