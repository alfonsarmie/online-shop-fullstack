import buzoHalo from '../assets/img/buzo-halo-frente.png';
import buzoHalo2 from '../assets/img/buzo-halo-espalda.png';
import pantVestaEsc from '../assets/img/PANTALON-VESTA-ESCUDO.png'
import pantVestaEsp from '../assets/img/PANTALON-VESTA-ESP.png'
import pantVestaLogo from '../assets/img/PANTALON-VESTA-LOGO.png'
import pantZonda from '../assets/img/PANTALON-ZONDA-NEGRO-FRENTE.png';
import pantZonda2 from '../assets/img/PANTALON-ZONDA-NEGRO-ESP.png';
import remeraUrban from '../assets/img/REMERA-URBAN-BLANCA-FRENTE.png'
import remeraUrban2 from '../assets/img/REMERA-URBAN-BLANCA-ESP.png'
import remeraRiley from '../assets/img/REMERA-RILEY-FRENTE-NEGRO-VERDE.png'
import remeraRiley2 from '../assets/img/REMERA-RILEY-ESP-NEGRO-VERDE.png'

const products = [
    {
        id: 1,
        name: "Buzo halo",
        price: 22000,
        img: buzoHalo,
        img2: buzoHalo2,
        description: "Buzo deportivo con capucha, ideal para entrenamientos y uso casual. Fabricado en algodón suave, ofrece comodidad y abrigo en días frescos. Su diseño moderno y detalles del equipo lo convierten en una prenda imprescindible para fanáticos.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 15
    },
    {
        id: 2,
        name: "Pantalón vesta",
        price: 24000,
        img: pantVestaEsc,
        img2: pantVestaEsp,
        img3: pantVestaLogo,
        description: "Pantalón de entrenamiento con corte ajustado y tela elástica. Proporciona libertad de movimiento y transpirabilidad, perfecto para actividades deportivas o para vestir de manera urbana.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 3,
        name: "Remera urban",
        price: 24000,
        img: remeraUrban,
        img2: remeraUrban2,
        description: "Remera de algodón con diseño urbano y detalles exclusivos. Ideal para uso diario, combina comodidad y estilo con los colores representativos del equipo.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 4,
        name: "Pantalón zonda",
        price: 24000,
        img: pantZonda,
        img2: pantZonda2,
        description: "Pantalón deportivo confeccionado en tela resistente y ligera. Su ajuste ergonómico y bolsillos funcionales lo hacen perfecto para entrenar o salir.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 5,
        name: "Remera riley",
        price: 24000,
        img: remeraRiley,
        img2: remeraRiley2,
        description: "Remera oficial de poliéster, pensada para máxima comodidad y rendimiento. Su diseño clásico y transpirable la convierte en la opción ideal para cualquier ocasión.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 6,
        name: "Short neo",
        price: 22000,
        img: buzoHalo,
        description: "Short deportivo con tecnología de secado rápido. Ligero y cómodo, es perfecto para entrenamientos intensos y actividades al aire libre.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 7,
        name: "Campera cardif",
        price: 24000,
        img: pantVestaEsc,
        description: "Campera impermeable con cierre frontal y bolsillos laterales. Ideal para protegerte del frío y la lluvia, manteniendo el estilo deportivo.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 8,
        name: "Pantalón unity",
        price: 30000,
        img: pantVestaEsc,
        description: "Pantalón largo de entrenamiento, confeccionado en tela flexible y transpirable. Su diseño moderno y ajuste perfecto lo hacen ideal para cualquier actividad.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 9,
        name: "Campera cardif",
        price: 15000,
        img: pantVestaEsc,
        description: "Campera ligera con detalles del equipo, pensada para uso diario. Su material resistente y diseño cómodo la convierten en una prenda versátil.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 10,
        name: "Pantalón lumber",
        price: 10000,
        img: pantVestaEsc,
        description: "Pantalón casual de algodón, ideal para relajarse o salir. Su corte clásico y suavidad garantizan comodidad durante todo el día.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 11,
        name: "Remera city",
        price: 22000,
        img: buzoHalo,
        description: "Remera deportiva con tecnología anti-transpirante. Perfecta para entrenar o vestir con estilo, destaca por su diseño y confort.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 12,
        name: "Remera dinamo",
        price: 24000,
        img: pantVestaEsc,
        description: "Remera oficial con estampado exclusivo y tela suave. Ideal para fanáticos que buscan comodidad y representar al equipo.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 13,
        name: "Short dinamo",
        price: 30000,
        img: pantVestaEsc,
        description: "Short de entrenamiento con ajuste elástico y tela liviana. Brinda frescura y libertad de movimiento en cada actividad.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 14,
        name: "Remera riley",
        price: 15000,
        img: pantVestaEsc,
        description: "Remera básica con detalles del equipo, confeccionada en algodón suave. Perfecta para uso diario y para mostrar tu pasión deportiva.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 15,
        name: "Remera riley",
        price: 10000,
        img: pantVestaEsc,
        description: "Remera ligera y cómoda, ideal para entrenar o vestir casual. Su diseño sencillo y materiales de calidad aseguran durabilidad.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 16,
        name: "Musculosa soccer",
        price: 22000,
        img: buzoHalo,
        description: "Musculosa deportiva con corte ergonómico y tela transpirable. Perfecta para entrenamientos intensos y días calurosos.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 17,
        name: "Top glow",
        price: 24000,
        img: pantVestaEsc,
        description: "Top deportivo con soporte y ajuste cómodo. Ideal para actividades físicas, ofrece libertad de movimiento y estilo moderno.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 18,
        name: "Calza corta spike",
        price: 30000,
        img: pantVestaEsc,
        description: "Calza corta de compresión, diseñada para mejorar el rendimiento deportivo. Su tela elástica y transpirable brinda soporte y comodidad.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    }
];

export default products;