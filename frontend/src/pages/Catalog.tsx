import React, { useState, useEffect } from "react";
import "../styles/catalog.css";
import Product from "../components/Product";
import { useCart } from "../components/CartContext";
import ProductFilter from "../components/ProductFilter";
import { FrontendProduct, ProductWithSize } from "../types/product";
import WhatsAppButton from "../components/WhatsAppButton";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { productService } from "../services/productService";

const normalizeText = (value?: string | null) =>
  value
    ? value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
    : "";

// Define filter types
type FilterType = "price_asc" | "price_desc" | "name_asc" | "";

// Page for displaying product catalog with filtering and sorting
const Catalog = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<FrontendProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<FrontendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("");

  // Obtener parámetro de categoría de la URL
  const { category } = useParams<{ category?: string }>();
  const [searchParams] = useSearchParams();
  const searchQuery = (searchParams.get("search") || "").trim();
  const normalizedSearchQuery = normalizeText(searchQuery);
  const hasSearch = normalizedSearchQuery.length > 0;

  // Cargar productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const effectiveSearch = searchQuery.length > 0 ? searchQuery : undefined;
        const productsData = await productService.getAllProducts(effectiveSearch);
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  // Filtrar productos cuando cambian los parámetros o los productos
  useEffect(() => {
    if (products.length === 0) {
      setFilteredProducts([]);
      return;
    }

    let filtered = [...products];


    if (category) {
      const normalizedCategory = normalizeText(category);

      filtered = filtered.filter(
        (product) => normalizeText(product.category) === normalizedCategory
      );
    }

    if (hasSearch) {
      filtered = filtered.filter((product) => {
        const normalizedName = normalizeText(product.name);
        const normalizedDescription = normalizeText(product.description);

        return (
          normalizedName.includes(normalizedSearchQuery) ||
          normalizedDescription.includes(normalizedSearchQuery)
        );
      });
    }

    setFilteredProducts(filtered);
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
    if (hasSearch) {
      const baseTitle = `Resultados para "${searchQuery}"`;

      if (category) {
        const formattedCategory =
          category.charAt(0).toUpperCase() + category.slice(1);
        return `${baseTitle} en ${formattedCategory}`;
      }

      return baseTitle;
    }

    if (category) {
      const formattedCategory =
        category.charAt(0).toUpperCase() + category.slice(1);
      return formattedCategory;
    }

    return "Todos los productos";
  };

  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  return (
      <div className="catalogo-productos">
        {/* Category Header */}
      <div className="categoria-header">
        <div className="breadcrumb">
          <Link to="/"><span className="no-active">Inicio</span></Link>
          {category ? (
            <>
              <span> / </span>
              <Link to={`/catalog/${category}`}><span className="active"> {category}</span></Link>
              {hasSearch && (
                <>
                  <span> / </span>
                  <span className="active"> Busqueda</span>
                </>
              )}
            </>
          ) : hasSearch ? (
            <>
              <span> / </span>
              <span className="active"> Busqueda</span>
            </>
          ) : (
            <>
              <span> / </span>
              <span className="active"> Catalogo</span>
            </>
          )}
        </div>
        <h1>{getHeaderTitle()}</h1>
        <p>Explora nuestra indumentaria</p>
      </div>

      {/* Filters and Sorting */}
      <div className="filtros-ordenamiento">
        <div className="resultados-count">
          <span>
            {filteredProducts.length} resultado
            {filteredProducts.length !== 1 ? "s" : ""}
            {hasSearch
              ? ` para "${searchQuery}"`
              : category
                ? ' en esta categoria'
                : ' disponibles'}
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
            <p>
              {hasSearch
                ? `No encontramos productos que coincidan con "${searchQuery}".`
                : category
                  ? 'No se encontraron productos para esta categoria.'
                  : 'No hay productos disponibles en este momento.'}
            </p>
          </div>
        )}
      </div>

      <WhatsAppButton />
      </div>
  );
};

export default Catalog;
