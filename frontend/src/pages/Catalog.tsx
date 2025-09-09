import React, { useState, useEffect } from 'react';
import '../styles/catalog.css';
import products from '../data/products';
import Product from '../components/Product';
import { useCart } from '../components/CartContext';
import ProductFilter from '../components/ProductFilter';
import { ProductWithSize } from '../types/product';
import WhatsAppButton from '../components/WhatsAppButton';

// Define filter types
type FilterType = 'price_asc' | 'price_desc' | 'name_asc' | '';

// Page for displaying product catalog with filtering and sorting
const Catalog = () => {

    const { addToCart } = useCart();

    // useEffect to handle reveal animations on scroll
    useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    });
    

    reveals.forEach(el => observer.observe(el));

    // Cleanup: disconnect observer on component unmount
    return () => observer.disconnect();
  }, []);

  // State for active filter
  const [activeFilter, setActiveFilter] = useState<FilterType>('');

  // Function to get sorted products based on active filter
  const getSortedProducts = () => {
    if (!activeFilter) return products;
    
    const productsCopy = [...products];
    
    switch(activeFilter) {
      case 'price_asc':
        return productsCopy.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return productsCopy.sort((a, b) => b.price - a.price);
      case 'name_asc':
        return productsCopy.sort((a, b) => 
          a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
        );
      default:
        return products;
    }
  };

  const sortedProducts = getSortedProducts();

  return (
    
    <div className="catalogo-productos">
      {/* Category Header */}
      <div className="categoria-header">
        <div className="breadcrumb">
          <span>Inicio</span> / <span>Hombre</span> / <span className="active">Remeras</span> {/* Replace with real link */}
        </div>
        <h1>Remeras de Hombre</h1>
        <p>Explorá nuestra indumentaria</p>
      </div>

      {/* Filters and Sorting */}
      <div className="filtros-ordenamiento">
        <div className="resultados-count">
          <span>{products.length} products</span>
        </div>

        <ProductFilter 
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
        />

      </div>

    {/* Product Grid */}
        <div className="products-grid">
          {sortedProducts.map(product => (
            <Product 
            key={product.id}
            {...product}
            onAddToCart={(productWithSize: ProductWithSize) => addToCart(productWithSize)}
            />
          ))}
        </div>

        {/* Pagination */}
      <div className="pagination">
        <button className="current-page">1</button>
        <button>2</button>
        <button>3</button>
        <button>Siguiente →</button>
      </div>
      <WhatsAppButton />
    </div>
    
  );
};

export default Catalog;