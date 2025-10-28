import { Link } from 'react-router-dom';
import '../styles/dinamicsImgContainer.css';
import futsal from '../assets/img/futsal.jpg';
import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { FrontendProduct } from '../types/product';

function DinamicsImgContainer() {
  const [featuredProducts, setFeaturedProducts] = useState<FrontendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeSlide, setActiveSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [carouselProgress, setCarouselProgress] = useState(0);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await productService.getAllProducts();
        

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

  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
      setIsMobile(isTouchDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile || featuredProducts.length === 0) return;
    
    const intervalDuration = 4000; 
    const progressInterval = 100; 
    
    let progressValue = 0;
    const progressTimer = setInterval(() => {
      progressValue += (progressInterval / intervalDuration) * 100;
      setCarouselProgress(progressValue);
      
      if (progressValue >= 100) {
        progressValue = 0;
        setCarouselProgress(0);
        setActiveSlide(prev => (prev + 1) % featuredProducts.length);
      }
    }, progressInterval);
    
    return () => clearInterval(progressTimer);
  }, [isMobile, featuredProducts.length, activeSlide]);

  const goToSlide = (index: number) => {
    setActiveSlide(index);
    setCarouselProgress(0);
  };

  const getSlideClass = (index: number) => {
    if (!isMobile) return '';
    
    if (index === activeSlide) return 'active';
    if (index === (activeSlide - 1 + featuredProducts.length) % featuredProducts.length) return 'prev';
    return 'next';
  };

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
    revealOnScroll();
    
    return () => window.removeEventListener('scroll', revealOnScroll);
  }, [featuredProducts]); 

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
        <img src={futsal} alt="Hinchada del Rosario Rowing Club" className="background-img" />
        <h3>Explotá tu pasión <br />por Rowing</h3>
      </div>

      <section className="gallery-section reveal">
        <div className="gallery-container">
          {featuredProducts.map((product, index) => (
            <Link 
              to={`/product/${product.id}`} 
              className={`gallery-item ${getSlideClass(index)}`} 
              key={product.id}
            >
              <img src={product.img} alt={product.name} onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-image.jpg';
              }} />
              <div className="hover-overlay">
                <button className="buy-button">COMPRAR AHORA</button>
              </div>
            </Link>
          ))}
          
          {isMobile && featuredProducts.length > 0 && (
            <>
              <div className="carousel-dots">
                {featuredProducts.map((_, index) => (
                  <div 
                    key={index}
                    className={`carousel-dot ${index === activeSlide ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
              
              <div 
                className="carousel-progress" 
                style={{width: `${carouselProgress}%`}}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default DinamicsImgContainer;