import wspBtn from '/src/assets/img/whatsapp.png';
import '../styles/whatsappButton.css';

function WhatsAppButton() {
    return (
        <a href="https://api.whatsapp.com/send?phone=5493415213939&text=Hola%20RRC,%20me%20gustaría%20más%20información."
           target="_blank" rel="noopener noreferrer" className='btnWsp'>

           <img src={wspBtn} alt="Contactar por WhatsApp" />
        </a>
    );
}

export default WhatsAppButton;