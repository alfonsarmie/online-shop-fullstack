import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import products from '../data/products';
import '../styles/productDetails.css';
import ProductGallery from '../components/ProductGallery';
import { Product } from '../types/product';
import { ProductWithSize } from '../types/product';

// Page for displaying detailed product information
function ProductDetails() {
  const { id } = useParams<{ id: string }>(); 
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch product details based on ID
  useEffect(() => {
    const foundProduct = products.find(p => p.id === parseInt(id!));
    setProduct(foundProduct || null);
    setLoading(false);
  }, [id]);

  // Handler for adding product to cart
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Por favor selecciona un talle");
      return;
    }

    if (!product) return;

    // Add product with selected size to cart
    addToCart({
      ...product,
      id: product.id.toString(), // Convertir number a string
      size: selectedSize,
      quantity: 1
    } as ProductWithSize);
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