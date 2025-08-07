import { Link } from 'react-router-dom';
import '../styles/dinamicsImgContainer.css';
import '../index.css';
import camTitModelo from '../assets/img/camTitModelo.png';
import hinchadaImg from '../assets/img/hinchada.png';
import camSupModelo from '../assets/img/camSupModelo.png';
import pantModelo from '../assets/img/pantModelo.png';
import mediasModelo from '../assets/img/mediasModelo.png'; 
import gorraModelo from '../assets/img/gorraModelo.png';

function DinamicsImgContainer() {
  return (
    <div className="img-dinamicas-container">
        <div className="reveal">
            <img src={hinchadaImg} alt="Hinchada del Rosario Rowing Club" />
            <h3>Explotá tu pasión <br />por Rowing</h3>
        </div>

        <section className="img-dinamicas reveal">
            <img src={camTitModelo} alt="Camiseta titular modelo" />
            <img src={pantModelo} alt="Pantalón modelo" />
            <img src={mediasModelo} alt="Medias modelo" />
            <img src={gorraModelo} alt="Gorra modelo" />
            <img src={camSupModelo} alt="Camiseta suplente modelo" />
        </section>
    </div>
  );
}

export default DinamicsImgContainer;
