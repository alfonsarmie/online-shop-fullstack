import { Link } from 'react-router-dom';
import '../styles/footer.css';
import '../index.css';
import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';


const Footer = () => {
  const footerLogoRef = useRef(null);

  useEffect(() => {
    const footerLogo = footerLogoRef.current;

    if (footerLogo) {
      // Ocultamos el logo inicialmente
      footerLogo.style.opacity = '0';
      footerLogo.style.transform = 'scale(0.3)';

      const logoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              footerLogo.classList.add('bounce-in');
              logoObserver.unobserve(footerLogo);
            }
          });
        },
        {
          threshold: 0.3,
        }
      );

      logoObserver.observe(footerLogo);

      // Cleanup
      return () => {
        logoObserver.disconnect();
      };
    }
  }, []);

  return (
    <footer>
        <div className="footerContainer">
            <div className="footerLogo">
            <img ref={footerLogoRef} src="../assets/img/logo.png" alt="Logo del sitio" />
            </div>

            <ul className="footerLinks">
            <li><Link to="index.html">Inicio</Link></li>
            <li><Link to="#productos">Productos</Link></li>
            </ul>

            <div className="footerSocial">
            <Link to="https://www.facebook.com/rosariorowingcluboficial?locale=es_LA"><FontAwesomeIcon icon={faFacebook} /></Link>
            <Link to="https://www.instagram.com/rosariorowingclub/"><FontAwesomeIcon icon={faInstagram} /></Link>
            <Link to="https://x.com/rowing_rrc"><FontAwesomeIcon icon={faTwitter} /></Link>
            </div>

            <p>&copy; 2025 Mi Sitio Web. Todos los derechos reservados.</p>
        </div>
    </footer>
  );
};

export default Footer;


