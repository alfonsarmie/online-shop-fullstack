import camTitular from '../assets/img/camTitular.png';
import camAlternativa from '../assets/img/camSuplente.png';
import medias from '../assets/img/mediaTitular.png';
import gorra from '../assets/img/gorra.png';
import pantalon from '../assets/img/pantalonTitular.png';

const products = [
    {
        id: 1,
        name: "Camiseta titular",
        price: 22000,
        img: camTitular,
        description: "Camiseta oficial titular con tecnología de absorción de humedad, confeccionada en materiales de alta calidad que garantizan comodidad y durabilidad. Su diseño clásico representa los colores y el espíritu del equipo, ideal tanto para entrenamientos como para uso diario. Disponible en varias tallas para adaptarse a todos los fanáticos.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 15
    },
    {
        id: 2,
        name: "Camiseta alternativa",
        price: 24000,
        img: camAlternativa,
        description: "Camiseta alternativa con diseño exclusivo, pensada para quienes buscan destacar con un estilo único. Fabricada con telas transpirables y resistentes, ofrece máxima comodidad durante el juego o actividades cotidianas. Su estampado moderno y detalles cuidados la convierten en una prenda imprescindible para los seguidores del equipo.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 3,
        name: "Pantalón de entrenamiento",
        price: 24000,
        img: pantalon,
        description: "Pantalón de entrenamiento cómodo y resistente, ideal para sesiones deportivas intensas. Elaborado con materiales flexibles que permiten libertad de movimiento y cuentan con tecnología de secado rápido. Su diseño ergonómico y ajuste perfecto lo hacen adecuado tanto para entrenar como para vestir de manera casual.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 4,
        name: "Gorra",
        price: 24000,
        img: gorra,
        description: "Gorra oficial con diseño exclusivo y ajuste perfecto, fabricada en materiales ligeros y transpirables que aseguran comodidad durante todo el día. Su visera protege del sol y el logo bordado resalta la identidad del equipo. Es el accesorio ideal para completar tu look deportivo o casual.",
        sizes: ["TALLE ÚNICO"],
        stock: 8
    },
    {
        id: 5,
        name: "Medias",
        price: 24000,
        img: medias,
        description: "Medias oficiales con diseño exclusivo y ajuste perfecto, confeccionadas en tejidos suaves y resistentes que proporcionan soporte y comodidad durante la actividad física. Su diseño anatómico y detalles distintivos las convierten en el complemento ideal para cualquier uniforme deportivo.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    }
];

export default products;