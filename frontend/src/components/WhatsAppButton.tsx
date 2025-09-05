import wspBtn from '../assets/img/whatsapp.png';
import '../styles/whatsappButton.css';

// Floating WhatsApp button for instant customer contact
function WhatsAppButton() {
    return (
        <a href="https://api.whatsapp.com/send?phone=5492478471801&text=Hola%20RRC,%20me%20gustaría%20más%20información."
           target="_blank" rel="noopener noreferrer" className='btnWsp'>

           {/* WhatsApp icon image */}
           <img src={wspBtn} alt="Contactar por WhatsApp" />
        </a>
    );
}

export default WhatsAppButton;