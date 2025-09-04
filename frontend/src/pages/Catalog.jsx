import React, { useState, useEffect } from 'react';
import '../styles/catalog.css';
import products from '../data/products.js';
import Product from '../components/Product';
import { useCart } from '../components/CartContext.jsx';
import ProductFilter from '../components/ProductFilter.jsx';


const Catalog = () => {

    const { addToCart } = useCart();

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

    // Cleanup: desconectar observer al desmontar el componente
    return () => observer.disconnect();
  }, []);

  const [activeFilter, setActiveFilter] = useState(null);

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
      {/* Encabezado de la categoría */}
      <div className="categoria-header">
        <div className="breadcrumb">
          <span>Inicio</span> / <span>Hombre</span> / <span className="active">Remeras</span> {/* reemplazar por el link real */}
        </div>
        <h1>Remeras de Hombre</h1>
        <p>Explorá nuestra indumentaria</p>
      </div>

      {/* Filtros y ordenamiento */}
      <div className="filtros-ordenamiento">
        <div className="resultados-count">
          <span>{products.length} products</span>
        </div>

        <ProductFilter 
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
        />

      </div>

    {/* Grid de products */}
        <div className="products-grid">
          {sortedProducts.map(product => (
            <Product 
            key={product.id}
            {...product}
            onAddToCart={(productWithSize) => addToCart(productWithSize)}
            />
          ))}
        </div>

        {/* Paginación */}
      <div className="paginacion">
        <button className="pagina-actual">1</button>
        <button>2</button>
        <button>3</button>
        <button>Siguiente →</button>
      </div>
    </div>
  );
};

export default Catalog;