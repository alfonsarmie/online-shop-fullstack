import Navbar from '../components/Navbar';
import '../styles/aboutUs.css';
import '../styles/nav.css';

// About Us page component
const AboutUs = () => {
  return (
    <>
      <Navbar />

      <div className="aboutUs-bg">
        
        <main className="aboutUs-container">
          <h1 className="aboutUs-title">¿Quiénes Somos?</h1>

          <p className="aboutUs-text">
            Fundado el 30 de junio de 1887 en el entonces “Pueblo de Alberdi” —anexado a la ciudad de Rosario en 1919—, el
            Rosario Rowing Club nació estrechamente ligado a la historia del ferrocarril y la influencia británica. Desde
            entonces, ha sido más que una institución deportiva: es un símbolo de tradición, amistad y amor por el deporte.
          </p>

          <p className="aboutUs-text">
            A lo largo de generaciones, nuestras escuelas deportivas han formado niños y adolescentes, transmitiendo valores
            de trabajo en equipo, esfuerzo y compromiso. Muchos de ellos continúan su vínculo con el club durante toda su
            vida, mientras que otros llevan lo aprendido a nuevos desafíos deportivos, pero siempre con el orgullo de haber
            crecido en casa.
          </p>

          <p className="aboutUs-text">
            Rosario Rowing Club no es solo remo, entrenamientos y competencias. Es reuniones con amigos, asados frente al río,
            cafés en buffet, partidas de burako, caminatas y charlas interminables. Es un espacio donde el deporte y la vida
            social se entrelazan, fortaleciendo un sentido de comunidad único.
          </p>

          <p className="aboutUs-text">
            Esta tienda oficial nace para extender ese sentimiento fuera de las instalaciones del club. Vestir nuestros colores
            no es solo llevar una prenda: es mostrar con orgullo el espíritu y la historia del Rosario Rowing Club. Cada remera,
            buzo o accesorio es una forma de decir “Soy parte de esto”. Porque aquí, compartir los mismos colores es compartir
            una misma pasión.
          </p>
        </main>
      </div>

    
    </>
  );
};

export default AboutUs;
