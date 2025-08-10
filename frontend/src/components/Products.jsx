import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
import '../styles/styles.css';
import '../styles/products.css';
import Product from './Product.jsx';
import camTitular from '../assets/img/camTitular.png';
import camAlternativa from '../assets/img/camSuplente.png';
import panEntrenamiento from '../assets/img/pantalonTitular.png';
import gorra from '../assets/img/gorra.png';
import medias from '../assets/img/mediaTitular.png';  
import { useCart } from './CartContext.jsx';
import ProductFilter from './ProductFilter.jsx';

function Products() {
  const { addToCart } = useCart();
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);

  const products = [
    {
      id: 1,
      name: "Camiseta titular",
      price: 22000,
      img: camTitular
    },
    {
      id: 2,
      name: "Camiseta alternativa",
      price: 24000,
      img: camAlternativa
    },
    {
      id: 3,
      name: "Pantalón de entrenamiento",
      price: 30000,
      img: panEntrenamiento
    },
    {
      id: 4,
      name: "Gorra",
      price: 15000,
      img: gorra
    },
    {
      id: 5,
      name: "Medias",
      price: 10000,
      img: medias
    }
  ];

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
    <>
      <ProductFilter 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <div className="contenedorProd">
        {sortedProducts.map(product => (
          <Product 
            key={product.id}
            {...product}
            onAddToCart={() => addToCart(product)}
          />
        ))}
      </div>
    </>
  );
}

export default Products;