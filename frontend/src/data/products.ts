//HAY QUE BORRAR ESTO CUANDO ESTÉN LOS PRODUCTOS DE LA DB

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
import remeraRiley3 from '../assets/img/REMERA-RILEY-FRENTE-VERDE-BLANCO.png'
import remeraRiley4 from '../assets/img/REMERA-RILEY-ESP-VERDE-BLANCO.png'
import shortNeo from '../assets/img/SHORT-NEO-FTE.png'
import shortNeo2 from '../assets/img/SHORT-NEO-LAT.png'
import campCardif from '../assets/img/CAMPERA-CARDIF-FRENTE.png'
import campCardif2 from '../assets/img/CAMPERA-CARDIF-ESP.png'
import pantUnity from '../assets/img/PANTALÓN-UNITY-FRENTE.png'
import pantUnity2 from '../assets/img/PANTALÓN-UNITY-ESP.png'
import pantLumber from '../assets/img/PANTALÓN-LUMBER-FRENTE.png';
import pantLumber2 from '../assets/img/PANTALÓN-LUMBER-ESP.png';
import remeraCity from '../assets/img/REMERA-CITY-FRENTE.png';
import remeraCity2 from '../assets/img/REMERA-CITY-ESP.png';
import remeraDinamo from '../assets/img/REMERA-DIMANO-FRENTE.png';
import remeraDinamo2 from '../assets/img/REMERA-DIMANO-ESP.png';
import shortDinamo from '../assets/img/SHORT-DINAMO-FRENTE.png';
import shortDinamo2 from '../assets/img/SHORT-DINAMO-LAT.png';
import musculosaSoccer from '../assets/img/MUSCU-SOCCER-FRENTE.png';
import musculosaSoccer2 from '../assets/img/MUSCU-SOCCER-ESP.png';
import topGlow from '../assets/img/TOP-GLOW-FRENTE.png';
import topGlow2 from '../assets/img/TOP-GLOW-ESP.png';
import calzaSpike from '../assets/img/CALZA-SPIKE-FRENTE.png';
import calzaSpike2 from '../assets/img/CALZA-SPIKE-ESP.png';
import { Product } from '../types/product';

// Array of product objects with details
const products: Product[] = [ // ← Añade el tipo Product[]
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
        name: "Remera riley - negro",
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
        img: shortNeo,
        img2: shortNeo2,
        description: "Short deportivo con tecnología de secado rápido. Ligero y cómodo, es perfecto para entrenamientos intensos y actividades al aire libre.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 7,
        name: "Campera cardif",
        price: 24000,
        img: campCardif,
        img2: campCardif2,
        description: "Campera impermeable con cierre frontal y bolsillos laterales. Ideal para protegerte del frío y la lluvia, manteniendo el estilo deportivo.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 8,
        name: "Pantalón unity",
        price: 30000,
        img: pantUnity,
        img2: pantUnity2,
        description: "Pantalón largo de entrenamiento, confeccionado en tela flexible y transpirable. Su diseño moderno y ajuste perfecto lo hacen ideal para cualquier actividad.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 9,
        name: "Pantalón lumber",
        price: 10000,
        img: pantLumber,
        img2: pantLumber2,
        description: "Pantalón casual de algodón, ideal para relajarse o salir. Su corte clásico y suavidad garantizan comodidad durante todo el día.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 10,
        name: "Remera city",
        price: 22000,
        img: remeraCity,
        img2: remeraCity2,
        description: "Remera deportiva con tecnología anti-transpirante. Perfecta para entrenar o vestir con estilo, destaca por su diseño y confort.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 11,
        name: "Remera dinamo",
        price: 24000,
        img: remeraDinamo,
        img2: remeraDinamo2,
        description: "Remera oficial con estampado exclusivo y tela suave. Ideal para fanáticos que buscan comodidad y representar al equipo.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 12,
        name: "Short dinamo",
        price: 30000,
        img: shortDinamo,
        img2: shortDinamo2,
        description: "Short de entrenamiento con ajuste elástico y tela liviana. Brinda frescura y libertad de movimiento en cada actividad.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 13,
        name: "Musculosa soccer",
        price: 22000,
        img: musculosaSoccer,
        img2: musculosaSoccer2,
        description: "Musculosa deportiva con corte ergonómico y tela transpirable. Perfecta para entrenamientos intensos y días calurosos.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 14,
        name: "Top glow",
        price: 24000,
        img: topGlow,
        img2: topGlow2,
        description: "Top deportivo con soporte y ajuste cómodo. Ideal para actividades físicas, ofrece libertad de movimiento y estilo moderno.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 15,
        name: "Calza corta spike",
        price: 30000,
        img: calzaSpike,
        img2: calzaSpike2,
        description: "Calza corta de compresión, diseñada para mejorar el rendimiento deportivo. Su tela elástica y transpirable brinda soporte y comodidad.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    },
    {
        id: 16,
        name: "Remera riley - verde",
        price: 24000,
        img: remeraRiley3,
        img2: remeraRiley4,
        description: "Remera oficial de poliéster, pensada para máxima comodidad y rendimiento. Su diseño clásico y transpirable la convierte en la opción ideal para cualquier ocasión.",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 8
    }
    
];

export default products;