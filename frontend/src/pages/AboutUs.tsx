import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { User } from '../types/user';
import '../styles/aboutUs.css';
import '../styles/nav.css';
import '../styles/footer.css';
import remo from '../assets/img/travesia1.jpg';
import rio from '../assets/img/rio.jpg';

// icon imports
import { FaHeart, FaHandsHelping, FaHistory } from 'react-icons/fa';

// About Us page component
const AboutUs = () => {
  // State for user authentication
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // fade in animation for sections
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
    });

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((el) => observer.observe(el));

    return () => {
      fadeElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <>
      <Navbar user={user} setUser={setUser} />

      <div className="aboutUs-bg">
        <div className="aboutUs-container">
          <header className="aboutUs-header">
            <h1 className="aboutUs-title">¿Quiénes Somos?</h1>
            <p className="aboutUs-subtitle fade-in">
              Más que un club, una familia. Un legado de pasión, deporte y comunidad desde 1887.
            </p>
          </header>

          <section className="aboutUs-content">
            <div className="aboutUs-text-section fade-in">
              <p className="aboutUs-text">
                <span className="aboutUs-text-intro">Fundado el 30 de junio de 1887</span> en el entonces "Pueblo de Alberdi" —anexado a la ciudad de Rosario en 1919—, el
                Rosario Rowing Club nació estrechamente ligado a la historia del ferrocarril y la influencia británica. Desde
                entonces, ha sido más que una institución deportiva: es un símbolo de tradición, amistad y amor por el deporte.
              </p>
              <p className="aboutUs-text">
                <span className="aboutUs-text-intro">A lo largo de generaciones</span>, nuestras escuelas deportivas han formado niños y adolescentes, transmitiendo valores
                de trabajo en equipo, esfuerzo y compromiso. Muchos de ellos continúan su vínculo con el club durante toda su
                vida, mientras que otros llevan lo aprendido a nuevos desafíos deportivos, pero siempre con el orgullo de haber
                crecido en casa.
              </p>
            </div>
            <div className="aboutUs-image fade-in">
              <img src={rio} alt="Vista del Rosario Rowing Club" />
            </div>
          </section>

          <section className="aboutUs-content reverse">
            <div className="aboutUs-image fade-in">
              <img src={remo} alt="Miembros del club remando" />
            </div>
            <div className="aboutUs-text-section fade-in">
              <p className="aboutUs-text">
                <span className="aboutUs-text-intro">Rosario Rowing Club no es solo remo</span>, entrenamientos y competencias. Es reuniones con amigos, asados frente al río,
                cafés en el buffet, partidas de burako, caminatas y charlas interminables. Es un espacio donde el deporte y la vida
                social se entrelazan, fortaleciendo un sentido de comunidad único.
              </p>
              <p className="aboutUs-text">
                <span className="aboutUs-text-intro">Esta tienda oficial</span> nace para extender ese sentimiento fuera de las instalaciones del club. Vestir nuestros colores
                no es solo llevar una prenda: es mostrar con orgullo el espíritu y la historia del Rosario Rowing Club. Cada remera,
                buzo o accesorio es una forma de decir "Soy parte de esto". Porque aquí, compartir los mismos colores es compartir
                una misma pasión.
              </p>
              <blockquote className="quote fade-in">
                "Más de un siglo de historia, forjando el futuro del deporte y la comunidad."
              </blockquote>
            </div>
          </section>

          <section className="aboutUs-stats fade-in">
            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-number">3000+</span>
                <span className="stat-label">Socios Activos</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">138+</span>
                <span className="stat-label">Años de Historia</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">1000s</span>
                <span className="stat-label">Atletas Formados</span>
              </div>
            </div>
          </section>

          <section className="aboutUs-values">
            <h2 className="values-title fade-in">Nuestros Valores</h2>
            <div className="values-container">
              <div className="value-card fade-in">
                <FaHandsHelping className="value-icon" />
                <h3 className="value-title">Comunidad</h3>
                <p className="value-description">Fomentamos la unión y la camaradería, creando un ambiente de apoyo mutuo.</p>
              </div>
              <div className="value-card fade-in">
                <FaHeart className="value-icon" />
                <h3 className="value-title">Pasión</h3>
                <p className="value-description">Nos mueve el amor por el deporte y la dedicación en cada disciplina.</p>
              </div>
              <div className="value-card fade-in">
                <FaHistory className="value-icon" />
                <h3 className="value-title">Tradición</h3>
                <p className="value-description">Honramos nuestra historia y legado, construyendo el futuro sobre bases sólidas.</p>
              </div>
            </div>
          </section>

        </div>
      </div>

    </>
  );
};

export default AboutUs;