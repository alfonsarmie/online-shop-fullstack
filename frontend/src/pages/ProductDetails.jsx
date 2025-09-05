import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import products from '../data/products';
import '../styles/productDetails.css';
import ProductGallery from '../components/ProductGallery';

// Page for displaying detailed product information
function ProductDetails() {
  const { id } = useParams(); 
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch product details based on ID
  useEffect(() => {
    const foundProduct = products.find(p => p.id === parseInt(id));
    setProduct(foundProduct);
    setLoading(false);
  }, [id]);

  // Handler for adding product to cart
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Por favor selecciona un talle");
      return;
    }

    // Add product with selected size to cart
    addToCart({
      ...product,
      size: selectedSize,
      quantity: 1
    });
  };

  // Loading and error states
  if (loading) return <div className="loading">Cargando producto...</div>;
  if (!product) return (
    <div className="not-found">
      <h2>Producto no encontrado</h2>
      <Link to="/" className="btn-back">Volver a inicio</Link>
    </div>
  );

  return (
    <div className="product-details-container">
      <div className="product-gallery">
        <ProductGallery img1={product.img} img2={product.img2} />
      </div>

      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="stock">{product.stock ? 'En stock' : 'Sin stock'}</p>
        <p className="price">${product.price.toLocaleString('es-AR')}</p>
        <p className="description">{product.description}</p>

        <div className="size-selector">
          <h3>Talle:</h3>
          <div className="size-options">
            {product.sizes.map(size => (
              <button
                key={size}
                className={selectedSize === size ? 'selected' : ''}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={!product.stock}
        >
          {product.stock ? 'AÑADIR AL CARRITO' : 'SIN STOCK'}
        </button>
      </div>
    </div>
  );
}

export default ProductDetails;