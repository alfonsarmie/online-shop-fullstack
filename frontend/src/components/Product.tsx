import { Link } from "react-router-dom";
import "../styles/product.css";
import { useState } from "react";
import { ProductWithSize, Size } from "../types/product";

interface ProductProps {
  id: string;
  name: string;
  price: number;
  img: string;
  img2: string;
  description: string;
  sizes: Size[]; 
  stock?: number; // opcional, ya no se usa para habilitar
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
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [showSizeSelector, setShowSizeSelector] = useState(false);

  const mainImage = img || "/placeholder-image.jpg";
  const secondaryImage = img2 || "/placeholder-image.jpg";

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); 
    setShowSizeSelector(true);
  };

  const handleSizeSelection = (size: Size) => {
    setSelectedSize(size);
    
    const productToAdd = {
      idProduct: id,
      name,
      price,
      img: mainImage,
      img2: secondaryImage,
      description,
      sizes: sizes || [],
      stock,
      size: size.name,
      sizeId: size.idSize,
      quantity: 1,
    };
    
    onAddToCart(productToAdd as ProductWithSize);
    setShowSizeSelector(false);
  };

  return (
    <div className="cajaProducto">
      <Link to={`/product/${id}`} className="product-link">
        <img
          src={mainImage}
          className="imgProd"
          alt={name}
          onError={(e) => {
            e.currentTarget.src = "/placeholder-image.jpg";
          }}
        />
        <p className="nombre">{name}</p>
        <p className="precio">{new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(price)} ARS</p>
      </Link>

      <button className="btnAddToCart" onClick={handleAddToCartClick}>
        Añadir al carrito
      </button>

      {showSizeSelector && (
        <div 
          className="size-selector-backdrop"
          onClick={() => setShowSizeSelector(false)}
        />
      )}

      <div
        className={`size-selector-popup ${showSizeSelector ? "visible" : ""}`}
      >
        <p>Selecciona un talle:</p>
        <div className="size-options">
          {sizes.map((size) => (
            <button
              key={size.idSize}
              className={`size-option ${selectedSize?.idSize === size.idSize ? "selected" : ""}`}
              onClick={() => handleSizeSelection(size)}
            >
              {size.name}
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
