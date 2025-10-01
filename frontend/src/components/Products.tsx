import { useState, useEffect } from "react";
import "../index.css";
import "../styles/products.css";
import ProductComponent from "./Product";
import { useCart } from "./CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import ProductFilter from "./ProductFilter";
import { ProductWithSize, FrontendProduct } from "../types/product";
import { productService } from "../services/productService";
import LoadingSpinner from "./LoadingSpinner";

type FilterType = "price_asc" | "price_desc" | "name_asc" | "";

function Products() {
  const { addToCart } = useCart();
  const [activeFilter, setActiveFilter] = useState<FilterType>("");
  const [products, setProducts] = useState<FrontendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar productos desde el backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData = await productService.getAllProducts();

        console.log("Productos desde backend:", productsData);

        // Log de las URLs de imágenes
        productsData.forEach((product, index) => {
          console.log(`Producto ${index}:`, {
            name: product.name,
            img: product.img,
            img2: product.img2,
          });
        });

        if (Array.isArray(productsData) && productsData.length > 0) {
          // Ya deberían estar en formato FrontendProduct
          const processedProducts: FrontendProduct[] = productsData.map(
            (product) => ({
              id: product.id,
              name: product.name,
              price: product.price,
              img: product.img || "/placeholder-image.jpg",
              img2: product.img2 || "/placeholder-image.jpg",
              description: product.description,
              stock: product.stock,
              sizes: product.sizes || [],
              category: product.category,
            })
          );

          setProducts(processedProducts);
        } else {
          setProducts([]);
        }
        setError(null);
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Error al cargar los productos. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getSortedProducts = (list: FrontendProduct[]) => {
    if (!activeFilter) return list;

    const productsCopy = [...list];

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
        return list;
    }
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredProducts = normalizedSearch
    ? products.filter((product) => {
        const searchableText = [
          product.name,
          product.description,
          product.category,
        ]
          .filter((value): value is string => typeof value === "string")
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedSearch);
      })
    : products;

  const sortedProducts = getSortedProducts(filteredProducts);

  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <>
      <div className="products-toolbar">
        <ProductFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <form
          className={`products-search${searchTerm ? " has-value" : ""}`}
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} className="products-search__icon" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
          />
          {searchTerm && (
            <button
              type="button"
              className="products-search__clear"
              onClick={() => setSearchTerm("")}
              aria-label="Limpiar busqueda"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
        </form>
      </div>
      <div className="contenedorProd">
        {sortedProducts.map((product) => (
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
            onAddToCart={(productWithSize: ProductWithSize) =>
              addToCart(productWithSize)
            }
          />
        ))}
      </div>
    </>
  );
}

export default Products;

