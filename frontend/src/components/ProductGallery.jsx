import React, { useState } from "react";
import "../styles/productGallery.css";

const ProductGallery = ({ img1, img2 }) => {
  const images = [
    img1,
    img2,
  ];

  const [currentImage, setCurrentImage] = useState(images[0]);

  return (
    <div className="product-gallery">
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

      <div className="main-image">
        <img src={currentImage} alt="Foto principal" />
      </div>
    </div>
  );
};

export default ProductGallery;
