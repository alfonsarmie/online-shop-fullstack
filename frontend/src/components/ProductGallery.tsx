import React, { useState } from "react";
import "../styles/productGallery.css";

// Props interface for ProductGallery component
interface ProductGalleryProps {
  img1: string;
  img2: string;
}

const ProductGallery = ({ img1, img2 }: ProductGalleryProps) => {
  const images = [
    img1,
    img2,
  ]; // Product images array

  // State for currently selected image
  const [currentImage, setCurrentImage] = useState(images[0]);

  return (
    <div className="product-gallery">
        {/* Thumbnails for image selection */}
      <div className="thumbnails">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Foto ${index + 1}`}
            onClick={() => setCurrentImage(img)}
            className={currentImage === img ? "active" : ""}
          />
        ))}
      </div>

      {/* Main product image display */}
      <div className="main-image">
        <img src={currentImage} alt="Foto principal" />
      </div>
    </div>
  );
};

export default ProductGallery;