import { useState, useEffect } from 'react';
import '../index.css';
import '../styles/products.css';
import ProductComponent from './Product';
import { useCart } from './CartContext';
import ProductFilter from './ProductFilter';
import { ProductWithSize, Product, FrontendProduct } from '../types/product';
import { productService } from '../services/productService';

type FilterType = 'price_asc' | 'price_desc' | 'name_asc' | '';

function Products() {
  const { addToCart } = useCart();
  const [activeFilter, setActiveFilter] = useState<FilterType>('');
  const [products, setProducts] = useState<FrontendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos desde el backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData = await productService.getAllProducts();
        setProducts(productsData);
        setError(null);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Error al cargar los productos. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <>
      <ProductFilter 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      <div className="contenedorProd">
        {sortedProducts.map(product => (
          <ProductComponent 
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            img={product.img}
            img2={product.img2}
            description={product.description}
            sizes={product.sizes}
            stock={product.stock}
            onAddToCart={(productWithSize: ProductWithSize) => addToCart(productWithSize)}
          />
        ))}
      </div>
    </>
  );
}

export default Products;