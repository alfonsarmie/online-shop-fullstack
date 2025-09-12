import { Link } from "react-router-dom";
import "../styles/product.css";
import { useState } from "react";
import { Product, ProductWithSize } from "../types/product";

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

  const mainImage = img || "";
  const secondaryImage = img2 || "";
  const idProduct = parseInt(id, 10);

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSizeSelector(true);
  };

  const handleSizeSelection = (size: string) => {
    setSelectedSize(size);
    onAddToCart({
      id: idProduct.toString(),
      name,
      price,
      img: mainImage,
      img2: secondaryImage,
      description,
      sizes: ["S", "M", "L", "XL"], // Temporal o obtener del backend
      stock,
      size,
      quantity: 1,
    });
    setTimeout(() => setShowSizeSelector(false), 300);
  };

  return (
    <div className="cajaProducto reveal">
      <Link to={`/product/${idProduct}`} className="product-link">
        <img src={mainImage} className="imgProd" alt={name} />
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

export default ProductComponent; // Cambia el export también
