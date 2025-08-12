import { Link } from 'react-router-dom';
import '../styles/dinamicsImgContainer.css';
import buzoHalo from '../assets/img/buzo-halo-model.jpg';
import hinchadaImg from '../assets/img/hinchada.png';
import camSupModelo from '../assets/img/camSupModelo.png';
import pantModelo from '../assets/img/pantModelo.png';
import mediasModelo from '../assets/img/mediasModelo.png'; 
import gorraModelo from '../assets/img/gorraModelo.png';

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
            <img src={buzoHalo} alt="Buzo halo" />
            <div className="hover-overlay">
              <button className="buy-button">COMPRAR AHORA</button>
            </div>
          </Link>
          <Link to="/product/3" className="gallery-item">
            <img src={pantModelo} alt="Pantalón modelo" />
            <div className="hover-overlay">
              <button className="buy-button">COMPRAR AHORA</button>
            </div>
          </Link>
          <Link to="/product/5" className="gallery-item">
            <img src={mediasModelo} alt="Medias modelo" />
            <div className="hover-overlay">
              <button className="buy-button">COMPRAR AHORA</button>
            </div>
          </Link>
          <Link to="/product/4" className="gallery-item">
            <img src={gorraModelo} alt="Gorra modelo" />
            <div className="hover-overlay">
              <button className="buy-button">COMPRAR AHORA</button>
            </div>
          </Link>
          <Link to="/product/2" className="gallery-item">
            <img src={camSupModelo} alt="Camiseta suplente modelo" />
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