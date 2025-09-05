import { Link } from 'react-router-dom';
import '../styles/product.css';
import { useState } from 'react';
import { ProductWithSize } from '../types/product';

// Props interface for Product component
interface ProductProps {
  id: number;
  name: string;
  price: number;
  img: string;
  img2: string;
  description: string;
  sizes: string[];
  stock: number;
  onAddToCart: (product: ProductWithSize) => void;
}

function Product({ id, name, price, img, img2, description, sizes, stock, onAddToCart }: ProductProps) {
  // State for selected size and size selector visibility
  const [selectedSize, setSelectedSize] = useState<string | null>(null); 
  const [showSizeSelector, setShowSizeSelector] = useState(false); 

  // Show size selector when add to cart is clicked
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSizeSelector(true);
  };

  // Handle size selection and add product to cart
  const handleSizeSelection = (size: string) => {
    setSelectedSize(size);
    onAddToCart({ 
      id: id.toString(), // Convertir number a string
      name, 
      price, 
      img,
      img2, // ← Añadir img2
      description, // ← Añadir description
      sizes, // ← Añadir sizes
      stock, // ← Añadir stock
      size, // send selected size
      quantity: 1 
    });
    setTimeout(() => setShowSizeSelector(false), 300); // close popup after selection
  };

  return (
    <div className="cajaProducto reveal">
      {/* Product link to details page */}
      <Link to={`/product/${id}`} className="product-link">
        <img src={img} className="imgProd" alt={name} />
        <p className='nombre'>{name}</p>
        <p className="precio">${price} ARS</p>
      </Link>
      
      {/* Add to cart button */}
      <button 
        className='btnAddToCart' 
        onClick={handleAddToCartClick}
      >
        Añadir al carrito
      </button>

      {/* Size selector popup */}
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