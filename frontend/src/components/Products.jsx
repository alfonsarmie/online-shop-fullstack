import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
import '../styles/styles.css';
import '../styles/products.css';
import Product from './Product.jsx';
import buzoHalo from '../assets/img/buzo-halo1.png';
import camAlternativa from '../assets/img/camSuplente.png';
import panEntrenamiento from '../assets/img/pantalonTitular.png';
import gorra from '../assets/img/gorra.png';
import medias from '../assets/img/mediaTitular.png';  
import { useCart } from './CartContext.jsx';
import ProductFilter from './ProductFilter.jsx';

function Products() {
  const { addToCart } = useCart();
  const [activeFilter, setActiveFilter] = useState(null);

  const products = [
    {
      id: 1,
      name: "Buzo halo",
      price: 22000,
      img: buzoHalo
    },
    {
      id: 2,
      name: "Pantalón vesta",
      price: 24000,
      img: camAlternativa
    },
    {
      id: 3,
      name: "Remera urban",
      price: 30000,
      img: panEntrenamiento
    },
    {
      id: 4,
      name: "Pantalón zonda",
      price: 15000,
      img: gorra
    },
    {
      id: 5,
      name: "Remera riley",
      price: 10000,
      img: medias
    },
    {
      id: 6,
      name: "short neo",
      price: 22000,
      img: buzoHalo
    },
    {
      id: 7,
      name: "campera cardif",
      price: 24000,
      img: camAlternativa
    },
    {
      id: 8,
      name: "pantalon unity",
      price: 30000,
      img: panEntrenamiento
    },
    {
      id: 9,
      name: "campera cardif",
      price: 15000,
      img: gorra
    },
    {
      id: 10,
      name: "pantalon lumber",
      price: 10000,
      img: medias
    },
    {
      id: 11,
      name: "remera city",
      price: 22000,
      img: buzoHalo
    },
    {
      id: 12,
      name: "remera dinamo",
      price: 24000,
      img: camAlternativa
    },
    {
      id: 13,
      name: "short dinamo",
      price: 30000,
      img: panEntrenamiento
    },
    {
      id: 14,
      name: "remera riley",
      price: 15000,
      img: gorra
    },
    {
      id: 15,
      name: "Remera riley",
      price: 10000,
      img: medias
    },
    {
      id: 16,
      name: "musculosa soccer",
      price: 22000,
      img: buzoHalo
    },
    {
      id: 17,
      name: "top glow",
      price: 24000,
      img: camAlternativa
    },
    {
      id: 18,
      name: "calza corta spike",
      price: 30000,
      img: panEntrenamiento
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