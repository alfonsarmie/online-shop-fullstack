import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
import '../styles/products.css';
import Product from './Product.jsx';
import { useCart } from './CartContext.jsx';
import ProductFilter from './ProductFilter.jsx';
import products from '../data/products.js';

function Products() {
  // Access cart context for adding products
  const { addToCart } = useCart();
  // State for active filter
  const [activeFilter, setActiveFilter] = useState(null);

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
    <>
      {/* Product filter component */}   
      <ProductFilter 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      {/* Products grid container */}
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