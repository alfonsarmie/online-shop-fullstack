import React, { useState, useRef } from "react";
import "../styles/productGallery.css";

interface ProductGalleryProps {
  img1: string;
  img2: string;
}

const ProductGallery = ({ img1, img2 }: ProductGalleryProps) => {
  const images = [img1, img2];
  const [currentImage, setCurrentImage] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImage(index);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
    
    setIsDragging(false);
  };

  const handleTouchCancel = () => {
    setIsDragging(false);
  };

  return (
    <div className="product-gallery">

      <div className="thumbnails">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Miniatura ${index + 1}`}
            onClick={() => goToImage(index)}
            className={currentImage === index ? "active" : ""}
          />
        ))}
      </div>

      <div 
        className="main-image"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
      >
        <div 
          ref={sliderRef}
          className="image-slider"
          style={{
            transform: `translateX(-${currentImage * 100}%)`
          }}

        >
          {images.map((img, index) => (
            <img 
              key={index}
              src={img} 
              alt={`Imagen ${index + 1}`}
              draggable={false}
            />
          ))}
        </div>
        
        <div className="carousel-controls">
          <button className="carousel-btn prev" onClick={prevImage}>
            ‹
          </button>
          <button className="carousel-btn next" onClick={nextImage}>
            ›
          </button>
        </div>

        <div className="carousel-indicators">
          {images.map((_, index) => (
            <span
              key={index}
              className={`indicator ${currentImage === index ? "active" : ""}`}
              onClick={() => goToImage(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;