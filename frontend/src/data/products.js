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
        description: "Camiseta oficial titular con tecnología de absorción de humedad",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 15
    },
    {
        id: 2,
        name: "Camiseta alternativa",
        price: 24000,
        img: camAlternativa,
        description: "Camiseta alternativa con diseño exclusivo",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 3,
        name: "Pantalón de entrenamiento",
        price: 24000,
        img: pantalon,
        description: "Pantalón de entrenamiento cómodo y resistente, ideal para sesiones deportivas",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 4,
        name: "Gorra",
        price: 24000,
        img: gorra,
        description: "Gorra oficial con diseño exclusivo y ajuste perfecto",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 5,
        name: "Medias",
        price: 24000,
        img: medias,
        description: "Medias oficiales con diseño exclusivo y ajuste perfecto",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    }
];

export default products;