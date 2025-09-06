import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { User } from '../types/user';
import '../styles/delivery.css';
import '../styles/nav.css';
import '../styles/footer.css';

// icon imports
import { 
  FaStore, 
  FaPhone, 
  FaWhatsapp, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock,
  FaRocket,
  FaMoneyBillWave,
  FaTshirt,
  FaBuilding,
  FaCheckCircle,
  FaQuoteLeft,
  FaInfoCircle,
  FaParking,
  FaAccessibleIcon
} from 'react-icons/fa';

// Delivery page component
const Delivery = ({ user, setUser }: { user: User | null, setUser: (user: User | null) => void }) => {

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

      <div className="delivery-bg">
        <div className="delivery-container">
          <header className="delivery-header">
            <h1 className="delivery-title">Formas de Entrega</h1>
            <p className="delivery-subtitle fade-in">
              Retira tu pedido en nuestro club o contactanos para más opciones
            </p>
          </header>

          <section className="delivery-content">
<div className="delivery-card fade-in">
  <div className="delivery-icon">
    <FaStore />
  </div>
  <h2 className="delivery-card-title">Retiro en el Club</h2>
  
  <div className="delivery-info">
    <div className="info-item">
      <FaMapMarkerAlt className="info-icon" />
      <div>
        <h4>Ubicación</h4>
        <p>Av. Carlos Colombres 1798, S2005NXW Rosario, Santa Fe</p>
      </div>
    </div>
    <div className="info-item">
      <FaClock className="info-icon" />
      <div>
        <h4>Horarios de Retiro</h4>
        <p>Lunes a Viernes: 9:00 - 18:00 hs</p>
        <p>Sábados: 9:00 - 13:00 hs</p>
        <p>Domingos: Cerrado</p>
      </div>
    </div>

    {/* Información adicional */}
    <div className="info-item">
      <FaParking className="info-icon" />
      <div>
        <h4>Estacionamiento</h4>
        <p>Disponible para socios • Gratuito</p>
      </div>
    </div>
    <div className="info-item">
      <FaAccessibleIcon className="info-icon" />
      <div>
        <h4>Accesibilidad</h4>
        <p>Acceso para sillas de ruedas • Baños adaptados</p>
      </div>
    </div>
  </div>

  <div className="process-section">
    <h4>Proceso de Retiro</h4>
    <ul className="process-steps">
      <li><FaCheckCircle className="step-icon" /> Realiza tu pedido online</li>
      <li><FaCheckCircle className="step-icon" /> Recibirás un email de confirmación</li>
      <li><FaCheckCircle className="step-icon" /> Te avisaremos cuando esté listo para retirar</li>
      <li><FaCheckCircle className="step-icon" /> Presenta tu DNI y número de pedido</li>
    </ul>
  </div>

  {/* Nota importante */}
  <div className="important-note">
    <FaInfoCircle className="note-icon" />
    <p>Los pedidos se guardan por 15 días hábiles. Pasado este tiempo, se procederá al reembolso.</p>
  </div>
</div>

            <div className="benefits-section fade-in">
              <h3 className="benefits-title">Ventajas del Retiro en Club</h3>
              <div className="benefits-grid">
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <FaRocket />
                  </div>
                  <h4>Entrega Inmediata</h4>
                  <p>Retira tu pedido el mismo día si lo realizas antes de las 12:00 hs</p>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <FaMoneyBillWave />
                  </div>
                  <h4>Sin Costo de Envío</h4>
                  <p>Ahorra el costo de envío retirando personalmente</p>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <FaTshirt />
                  </div>
                  <h4>Probate las Prendas</h4>
                  <p>Posibilidad de probarte las prendas antes de llevarlas</p>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <FaBuilding />
                  </div>
                  <h4>Conoce el Club</h4>
                  <p>Aprovecha para conocer nuestras instalaciones</p>
                </div>
              </div>
            </div>
          </section>

          <section className="contact-section fade-in">
            <h2 className="contact-title">¿Necesitas Ayuda?</h2>
            <p className="contact-subtitle">Estamos aquí para ayudarte. Contactanos por cualquiera de estos medios:</p>
            
            <div className="contact-methods">
              <div className="contact-card">
                <FaWhatsapp className="contact-icon whatsapp" />
                <h3>WhatsApp</h3>
                <p>+54 341 123-4567</p>
                <p>Lunes a Viernes: 8:00 - 20:00 hs</p>
                <a href="https://wa.me/543411234567" className="contact-btn">Escribinos por WhatsApp</a>
              </div>

              <div className="contact-card">
                <FaPhone className="contact-icon phone" />
                <h3>Teléfono</h3>
                <p>0341 123-4567</p>
                <p>Lunes a Sábados: 9:00 - 18:00 hs</p>
                <a href="tel:03411234567" className="contact-btn">Llamar ahora</a>
              </div>

              <div className="contact-card">
                <FaEnvelope className="contact-icon email" />
                <h3>Email</h3>
                <p>ventas@rosariorowingclub.com</p>
                <p>Respondemos en menos de 24 horas</p>
                <a href="mailto:ventas@rosariorowingclub.com" className="contact-btn">Enviar email</a>
              </div>
            </div>
          </section>

          <section className="map-section fade-in">
            <h2 className="map-title">¿Dónde Estamos?</h2>
            <div className="map-container">
              <div className="map-iframe">
                <iframe
                  src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d163162.4429052535!2d-60.859000319125656!3d-32.91704982270766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b65afb8a58f92d%3A0x6e49b25ee0ccb877!2sRosario%20Rowing%20Club!5e0!3m2!1ses!2sar!4v1757192554590!5m2!1ses!2sar'
                  width="100%"
                  height="400"
                  style={{ border: 0, borderRadius: '12px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación Rosario Rowing Club"
                ></iframe>
              </div>
              <div className="map-info">
                <h3>Rosario Rowing Club</h3>
                <p>📍 Av. Carlos Colombres 1798, S2005NXW Rosario, Santa Fe</p>
                <p>🚗 Estacionamiento gratuito para socios</p>
                <p>🚍 Líneas de colectivo: 102, 115, 120, 131</p>
                <p>🚲 Estacionamiento para bicicletas disponible</p>
              </div>
            </div>
          </section>

          <section className="faq-section fade-in">
            <h2 className="faq-title">Preguntas Frecuentes</h2>
            <div className="faq-grid">
              <div className="faq-item">
                <h4>¿Cuánto tiempo tarda en estar listo mi pedido?</h4>
                <p>Los pedidos realizados antes de las 12:00 hs están listos para retiro el mismo día. Después de las 12:00 hs, estarán disponibles al día siguiente.</p>
              </div>
              <div className="faq-item">
                <h4>¿Puede retirar otra persona mi pedido?</h4>
                <p>Sí, pero debe presentar una autorización firmada por el titular del pedido, copia del DNI del titular y su propio DNI.</p>
              </div>
              <div className="faq-item">
                <h4>¿Qué pasa si no retiro mi pedido?</h4>
                <p>Guardamos los pedidos por 15 días hábiles. Pasado ese tiempo, se cancela el pedido y se reembolsa el importe.</p>
              </div>
              <div className="faq-item">
                <h4>¿Hacen envíos a domicilio?</h4>
                <p>Actualmente solo ofrecemos retiro en el club. Estamos evaluando implementar envíos a domicilio en el futuro.</p>
              </div>
            </div>
          </section>

        </div>
      </div>

    </>
  );
};

export default Delivery;