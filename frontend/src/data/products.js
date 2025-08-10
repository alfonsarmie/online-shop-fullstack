import camTitular from '../assets/img/camTitular.png';
import camAlternativa from '../assets/img/camSuplente.png';

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
  }
  // ... otros productos
];

export default products;