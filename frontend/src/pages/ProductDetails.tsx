import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";
import "../styles/productDetails.css";
import ProductGallery from "../components/ProductGallery";
import { FrontendProduct, ProductWithSize, Size } from "../types/product";
import { productService } from "../services/productService";
import ErrorMessage from "../components/ErrorMessage";

function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<FrontendProduct | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("ID de producto no válido");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await productService.getProductById(id);

        const productData = response?.product || response;

        if (!productData) {
          setError("Producto no encontrado");
          setLoading(false);
          return;
        }

        if (!productData.idProduct) {
          setError("Datos del producto incompletos");
          setLoading(false);
          return;
        }

        const frontendProduct: FrontendProduct = {
          id: productData.idProduct.toString(),
          name: productData.name || "Nombre no disponible",
          price:
            productData.prices && productData.prices.length > 0
              ? productData.prices[0].value
              : 0,
          img:
            productData.images && productData.images.length > 0
              ? productData.images[0].url
              : "/placeholder-image.jpg",
          img2:
            productData.images && productData.images.length > 1
              ? productData.images[1].url
              : "/placeholder-image.jpg",
          description: productData.description || "Descripción no disponible",
          sizes: productData.sizes
            ? productData.sizes.map((size: any) => ({
                idSize: size.idSize || size.id,
                name: size.name || size.sizeDesc || "Talle",
                sizeDesc: size.sizeDesc || size.name || "",
                stock: (size.stock ?? (size.ProductSize?.stock ?? 0)),
              }))
            : [],
          category: productData.category?.name,
        };

        setProduct(frontendProduct);
        setError(null);
      } catch (err) {
        console.error("Error loading product:", err);
        setError("Error al cargar el producto.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setErrorMessage("Por favor, selecciona un talle.");
      setTimeout(() => setErrorMessage(""), 1500);
      return;
    }

    if (!product) return;

    addToCart({
      idProduct: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      img2: product.img2,
      description: product.description,
      sizes: product.sizes,
      stock: product.stock,
      size: selectedSize.name,
      sizeId: selectedSize.idSize,
      quantity: 1,
    } as ProductWithSize);
  };

  if (loading) return <div className="loading">Cargando producto...</div>;

  if (!product)
    return (
      <div className="not-found">
        <h2>Producto no encontrado</h2>
        <button onClick={() => navigate(-1)} className="btn-back">
          Volver atrás
        </button>
        <Link to="/" className="btn-back">
          Volver a inicio
        </Link>
      </div>
    );

  return (
    <div className="page-with-nav-spacing">
      <div className="product-details-container">
        <ErrorMessage
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
        <div className="product-gallery">
          <ProductGallery img1={product.img} img2={product.img2} />
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="product-stock">
            {selectedSize?.stock && selectedSize.stock > 0 ? "En stock" : "Sin stock"}
          </p>
          <p className="price">${product.price.toLocaleString("es-AR")}</p>
          <p className="description">{product.description}</p>

          <div className="size-selector">
            <h3>Talle:</h3>
            <div className="size-options">
              {product.sizes && product.sizes.length > 0 ? (
                product.sizes.map((size) => (
                  <button
                    key={size.idSize}
                    className={
                      selectedSize?.idSize === size.idSize ? "selected" : ""
                    }
                    onClick={() => setSelectedSize(size)}
                  >
                    {size.name}
                  </button>
                ))
              ) : (
                <p>No hay talles disponibles</p>
              )}
            </div>
          </div>

          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={!selectedSize || !(selectedSize.stock && selectedSize.stock > 0)}
          >
            {selectedSize && selectedSize.stock && selectedSize.stock > 0 ? "AÑADIR AL CARRITO" : "SIN STOCK"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
