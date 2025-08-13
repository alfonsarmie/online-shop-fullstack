import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
import '../styles/styles.css';
import '../styles/products.css';
import Product from './Product.jsx';
import { useCart } from './CartContext.jsx';
import ProductFilter from './ProductFilter.jsx';
import products from '../data/products.js';

function Products() {
  const { addToCart } = useCart();
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
          onAddToCart={(productWithSize) => addToCart(productWithSize)}
        />
        ))}
      </div>
    </>
  );
}

export default Products;