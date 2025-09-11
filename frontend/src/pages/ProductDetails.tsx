import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import '../styles/productDetails.css';
import ProductGallery from '../components/ProductGallery';
import { Product } from '../types/product';
import { ProductWithSize } from '../types/product';
import { productService } from '../services/productService';

// Page for displaying detailed product information
function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { addToCart } = useCart(); // Obtener la función addToCart del contexto

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const productData = await productService.getProductById(id);
        setProduct(productData);
        setError(null);
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Error al cargar el producto.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
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
      id: product.id, // Ya es string, no necesita conversión
      size: selectedSize,
      quantity: 1
    } as ProductWithSize);
  };

  // Loading and error states
  if (loading) return <div className="loading">Cargando producto...</div>;
  
  if (error) return (
    <div className="error">
      <h2>{error}</h2>
      <Link to="/" className="btn-back">Volver a inicio</Link>
    </div>
  );
  
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
        <p className="product-stock">{product.stock ? 'En stock' : 'Sin stock'}</p>
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
          disabled={!product.stock || !selectedSize}
        >
          {product.stock ? 'AÑADIR AL CARRITO' : 'SIN STOCK'}
        </button>
      </div>
    </div>
  );
}

export default ProductDetails;