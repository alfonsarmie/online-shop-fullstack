import { Link } from 'react-router-dom';
import '../styles/dinamicsImgContainer.css';
import hinchadaImg from '../assets/img/hinchada.png';
import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { FrontendProduct } from '../types/product';

// Component to display dynamic image container with banner and product gallery
function DinamicsImgContainer() {
  const [featuredProducts, setFeaturedProducts] = useState<FrontendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        // Obtener todos los productos
        const allProducts = await productService.getAllProducts();
        
        // Seleccionar productos destacados (puedes cambiar la lógica según necesites)
        // Por ejemplo: los primeros 5 productos, o productos con alguna propiedad especial
        const featured = allProducts.slice(0, 5);
        
        setFeaturedProducts(featured);
        setError(null);
      } catch (err) {
        console.error('Error loading featured products:', err);
        setError('Error al cargar productos destacados');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Efecto para animación reveal
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
      revealElements.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', revealOnScroll);
    // Ejecutar una vez al cargar
    revealOnScroll();
    
    return () => window.removeEventListener('scroll', revealOnScroll);
  }, [featuredProducts]); // Se ejecuta cuando featuredProducts cambia

  if (loading) {
    return (
      <div className="img-dinamicas-container">
        <div className="loading-container">
          <div className="loading">Cargando productos destacados...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="img-dinamicas-container">
        <div className="error-container">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="img-dinamicas-container">
      <div className="banner-section reveal">
        <img src={hinchadaImg} alt="Hinchada del Rosario Rowing Club" className="background-img" />
        <h3>Explotá tu pasión <br />por Rowing</h3>
      </div>

      <section className="gallery-section reveal">
        <div className="gallery-container">
          {featuredProducts.map(product => (
            <Link to={`/product/${product.id}`} className="gallery-item" key={product.id}>
              <img src={product.img} alt={product.name} onError={(e) => {
                // Manejar error de carga de imagen
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-image.jpg';
              }} />
              <div className="hover-overlay">
                <button className="buy-button">COMPRAR AHORA</button>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default DinamicsImgContainer;