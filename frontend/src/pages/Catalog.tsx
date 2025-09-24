import React, { useState, useEffect } from "react";
import "../styles/catalog.css";
import Product from "../components/Product";
import { useCart } from "../components/CartContext";
import ProductFilter from "../components/ProductFilter";
import { ProductWithSize } from "../types/product";
import WhatsAppButton from "../components/WhatsAppButton";
import { Link, useParams } from "react-router-dom";
import { productService } from "../services/productService";

// Define filter types
type FilterType = "price_asc" | "price_desc" | "name_asc" | "";

// Page for displaying product catalog with filtering and sorting
const Catalog = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("");

  // Obtener parámetro de categoría de la URL
  const { category } = useParams<{ category?: string }>();

  // Cargar productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData = await productService.getAllProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtrar productos cuando cambian los parámetros o los productos
  useEffect(() => {
    if (products.length > 0) {
      let filtered = [...products];

      // Filtrar por categoría si está presente
      if (category) {
        // Mapeo de categorías en plural a singular
        const categoryMap: { [key: string]: string } = {
          remeras: "remera",
          buzos: "buzo",
          pantalones: "pantalón",
          camperas: "campera",
          tops: "top",
          shorts: "short",
        };

        // Obtener la categoría en singular
        const singularCategory = categoryMap[category] || category;

        filtered = filtered.filter(
          (product) =>
            product.category?.toLowerCase() === singularCategory.toLowerCase()
        );
      }

      setFilteredProducts(filtered);
    }
  }, [products, category]);

  // useEffect para animaciones de scroll
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    });

    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [filteredProducts]);

  // Función para obtener productos ordenados
  const getSortedProducts = () => {
    if (!activeFilter) return filteredProducts;

    const productsCopy = [...filteredProducts];

    switch (activeFilter) {
      case "price_asc":
        return productsCopy.sort((a, b) => a.price - b.price);
      case "price_desc":
        return productsCopy.sort((a, b) => b.price - a.price);
      case "name_asc":
        return productsCopy.sort((a, b) =>
          a.name.localeCompare(b.name, "es", { sensitivity: "base" })
        );
      default:
        return filteredProducts;
    }
  };

  const sortedProducts = getSortedProducts();

  // Función para obtener el título de la página
  const getHeaderTitle = () => {
    if (category) {
      // Capitalizar primera letra
      const formattedCategory =
        category.charAt(0).toUpperCase() + category.slice(1);
      return formattedCategory;
    } else {
      return "Todos los productos";
    }
  };

  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  return (
    <div className="catalogo-productos">
      {/* Category Header */}
      <div className="categoria-header">
        <div className="breadcrumb">
          <Link to="/"><span className="no-active">Inicio</span></Link> /
          <Link to={`/catalog/${category}`}><span className="active"> {category}</span></Link>
        </div>
        <h1>{getHeaderTitle()}</h1>
        <p>Explorá nuestra indumentaria</p>
      </div>

      {/* Filters and Sorting */}
      <div className="filtros-ordenamiento">
        <div className="resultados-count">
          <span>
            {filteredProducts.length} producto
            {filteredProducts.length !== 1 ? "s" : ""}
          </span>
        </div>

        <ProductFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      {/* Product Grid */}
      <div className="products-grid">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <Product
              key={product.id}
              {...product}
              onAddToCart={(productWithSize: ProductWithSize) =>
                addToCart(productWithSize)
              }
            />
          ))
        ) : (
          <div className="no-products">
            <p>No se encontraron productos para esta categoría.</p>
          </div>
        )}
      </div>

      <WhatsAppButton />
    </div>
  );
};

export default Catalog;
