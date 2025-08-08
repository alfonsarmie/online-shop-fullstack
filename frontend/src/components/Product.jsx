import { Link } from 'react-router-dom';
import '../index.css';
import '../styles/styles.css';
import '../styles/product.css';

function Product({ name, price, img, onAddToCart }) {
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart();
  };

  return (
    <div className="cajaProducto reveal">
      <div>
        <img src={img} className="imgProd" alt={name}/>
        <p className='nombre'>{name}</p>
        <p className="precio">${price} ARS</p>
      </div>
      <button className='btnAddToCart' onClick={handleAddToCart}>
        Añadir al carrito
      </button>
    </div>
  );
}

export default Product;
