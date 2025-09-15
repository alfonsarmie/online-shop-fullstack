import { Link } from "react-router-dom";
import "../styles/product.css";
import { useState } from "react";
import { ProductWithSize, FrontendProduct } from "../types/product";

// Props interface for Product component
interface ProductProps {
  id: string;
  name: string;
  price: number;
  img: string;
  img2: string;
  description: string;
  sizes: string[];
  stock: number;
  onAddToCart: (product: ProductWithSize) => void;
}

function ProductComponent({
  id,
  name,
  price,
  img,
  img2,
  description,
  sizes,
  stock,
  onAddToCart,
}: ProductProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeSelector, setShowSizeSelector] = useState(false);

  // Asegurar que las URLs de imágenes sean válidas
  const mainImage = img || "/placeholder-image.jpg";
  const secondaryImage = img2 || "/placeholder-image.jpg";

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevenir que el enlace se active
    setShowSizeSelector(true);
  };

  const handleSizeSelection = (size: string) => {
    setSelectedSize(size);
    onAddToCart({
      id: id, // Ya es string
      name,
      price,
      img: mainImage,
      img2: secondaryImage,
      description,
      sizes: sizes || [],
      stock,
      size,
      quantity: 1,
    } as ProductWithSize);
    setTimeout(() => setShowSizeSelector(false), 300);
  };

  return (
    <div className="cajaProducto">
      <Link to={`/product/${id}`} className="product-link">
        <img
          src={mainImage}
          className="imgProd"
          alt={name}
          onError={(e) => {
            // Fallback para imágenes rotas
            e.currentTarget.src = "/placeholder-image.jpg";
          }}
        />
        <p className="nombre">{name}</p>
        <p className="precio">${price} ARS</p>
      </Link>

      <button className="btnAddToCart" onClick={handleAddToCartClick}>
        Añadir al carrito
      </button>

      <div
        className={`size-selector-popup ${showSizeSelector ? "visible" : ""}`}
      >
        <p>Selecciona un talle:</p>
        <div className="size-options">
          {sizes.map((size) => (
            <button
              key={size}
              className={`size-option ${selectedSize === size ? "selected" : ""}`}
              onClick={() => handleSizeSelection(size)}
            >
              {size}
            </button>
          ))}
        </div>
        <button
          className="btnCancel"
          onClick={() => setShowSizeSelector(false)}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default ProductComponent;
