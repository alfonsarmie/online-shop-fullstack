import { Link } from 'react-router-dom';
import '../styles/dinamicsImgContainer.css';
import products from '../data/products.js';
import hinchadaImg from '../assets/img/hinchada.png';


function DinamicsImgContainer() {
  return (
    <div className="img-dinamicas-container">
      <div className="banner-section reveal">
        <img src={hinchadaImg} alt="Hinchada del Rosario Rowing Club" className="background-img" />
        <h3>Explotá tu pasión <br />por Rowing</h3>
      </div>

      <section className="gallery-section reveal">
        <div className="gallery-container">
          <Link to="/product/1" className="gallery-item">
            <img src={products[0].img} alt={products[0].name} />
            <div className="hover-overlay">
              <button className="buy-button">COMPRAR AHORA</button>
            </div>
          </Link>
          <Link to="/product/3" className="gallery-item">
            <img src={products[2].img} alt={products[2].name} />
            <div className="hover-overlay">
              <button className="buy-button">COMPRAR AHORA</button>
            </div>
          </Link>
          <Link to="/product/5" className="gallery-item">
            <img src={products[4].img} alt={products[4].name} />
            <div className="hover-overlay">
              <button className="buy-button">COMPRAR AHORA</button>
            </div>
          </Link>
          <Link to="/product/4" className="gallery-item">
            <img src={products[3].img} alt={products[3].name} />
            <div className="hover-overlay">
              <button className="buy-button">COMPRAR AHORA</button>
            </div>
          </Link>
          <Link to="/product/2" className="gallery-item">
            <img src={products[1].img} alt={products[1].name} />
            <div className="hover-overlay">
              <button className="buy-button">COMPRAR AHORA</button>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default DinamicsImgContainer;