import { Link } from 'react-router-dom';
import '../styles/product.css';
import { useState } from 'react';

function Product({ id, name, price, img, onAddToCart }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    setShowSizeSelector(true);
  };

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
    onAddToCart({ 
      id, 
      name, 
      price, 
      img, 
      size, // Asegúrate de enviar el talle
      quantity: 1 
    });
    setTimeout(() => setShowSizeSelector(false), 300);
  };

  return (
    <div className="cajaProducto reveal">
      <Link to={`/product/${id}`} className="product-link">
        <img src={img} className="imgProd" alt={name} />
        <p className='nombre'>{name}</p>
        <p className="precio">${price} ARS</p>
      </Link>
      
      <button 
        className='btnAddToCart' 
        onClick={handleAddToCartClick}
      >
        Añadir al carrito
      </button>

      <div className={`size-selector-popup ${showSizeSelector ? 'visible' : ''}`}>
        <p>Selecciona un talle:</p>
        <div className="size-options">
          {sizes.map(size => (
            <button
              key={size}
              className={`size-option ${selectedSize === size ? 'selected' : ''}`}
              onClick={() => handleSizeSelection(size)}
            >
              {size}
            </button>
          ))}
        </div>
        <button 
          className="btnCancel"
          onClick={() => setShowSizeSelector(false)}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default Product;