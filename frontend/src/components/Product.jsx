import { Link } from 'react-router-dom';
import '../styles/product.css';

function Product({ id, name, price, img, onAddToCart }) {
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart();
  };

  return (
    <div className="cajaProducto reveal">
      <Link to={`/product/${id}`} className="product-link">
        <img src={img} className="imgProd" alt={name}/>
        <p className='nombre'>{name}</p>
        <p className="precio">${price} ARS</p>
      </Link>
      <button className='btnAddToCart' onClick={handleAddToCart}>
        Añadir al carrito
      </button>
    </div>
  );
}

export default Product;