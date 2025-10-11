# Guia de Estilos - Rowing Club Ecommerce

## 1. Introduccion
### 1.1 Proposito y alcance
Esta guia formaliza los lineamientos visuales y tecnicos del ecosistema digital Rowing Club Ecommerce, asegurando consistencia en el sitio de comercio, el panel administrativo y cualquier pieza de comunicacion asociada. Sirve como referencia para equipos de diseno, desarrollo, marketing y operaciones que intervienen en la evolucion del producto digital.

### 1.2 Descripcion del proyecto
Rowing Club Ecommerce es la plataforma oficial del club de remo para la comercializacion de indumentaria tecnica, equipamiento nautico, membresias, reservas de clases y experiencias en agua. El sistema abarca la tienda publica, flujos de alta de socios, gestion de eventos y herramientas internas de seguimiento.

## 2. Identidad visual
### 2.1 Paleta de colores
La paleta adopta los verdes institucionales del club y los complementa con acentos deportivos y neutros operativos.

| Nombre          | Valor hex |                        Uso recomendado                                    |
| --------------- | --------- | ------------------------------------------------------------------------- |
| Verde Emblema   | #1E7335 | Acciones principales, botones primarios, identificadores de marca         |
| Verde Impulso   | #22A341 | Estados hover, confirmaciones visuales, resaltado de datos positivos      |
| Verde Fondeo    | #0C3F19 | Encabezados sobre fotografia, fondos solidos hero, overlays fuertes       |
| Verde Canal     | #4CAF50 | Gradientes dinamicos, lineas de progreso, chips informativos              |
| Amarillo Regata | #E6B800 | Estados pendientes, banners de eventos, badges promocionales              |
| Naranja Proa    | #F39C12 | Advertencias suaves, pasos activos en flujos guiados, tooltips de alerta  |
| Azul Canaleta   | #3498DB | Enlaces contextuales, botones secundarios informativos, mensajes de apoyo |
| Rojo Alerta     | #C0392B | Mensajes de error, confirmaciones destructivas, alertas criticas          |
| Gris Carbon     | #121212 | Fondos oscuros del panel, modales en modo nocturno, tipografia inversa    |
| Gris Muelle     | #6F7B8C | Bordes, iconos secundarios, texto auxiliar y placeholders                 |
| Gris Niebla     | #F4F6FA | Fondos neutros, tarjetas, estados deshabilitados y contenedores vacios    |

### 2.2 Tipografia
- Familia primaria: Montserrat. Se utiliza en titulos, botones y elementos de navegacion por su geometria limpia y caracter deportivo.
  - h1: 48 px, peso 700, interlineado 120 %, secciones hero y mensajes institucionales.
  - h2: 34 px, peso 600, interlineado 130 %, encabezados internos y bloques de contenido.
  - h3: 26 px, peso 600, interlineado 130 %, subsecciones y tarjetas destacadas.
- Familia secundaria: Source Sans 3. Se aplica a cuerpos de texto, descripciones de producto, microcopys y tooltips.
  - Parrafo base: 16 px, peso 400, interlineado 150 %.
  - Parrafo reducido: 14 px, peso 400, interlineado 150 %, datos complementarios y tablas.
- Tipografia tecnica: Roboto Mono, 14 a 16 px, peso 400, destinada a codigos de reserva, numeros de pedido y datos bancarios.

### 2.3 Logotipo y branding
- Zona de resguardo: conservar un margen libre equivalente al ancho de una pala de remo del isotipo alrededor del logotipo.
- Tamanos minimos: 140 px en interfaces web y 96 px en piezas responsivas.
- Versiones aprobadas: aplicacion en Verde Emblema sobre fondos claros, en blanco sobre fondos oscuros o monocroma Gris Carbon. No se permite modificar proporciones, colores o incorporar efectos ajenos a la marca.
- Integracion con fotografia: ubicar el logotipo sobre areas limpias de la imagen; cuando sea necesario, utilizar overlays con Gris Niebla al 80 % de opacidad para preservar legibilidad.

## 3. Componentes de interfaz
### 3.1 Botones
- Primario (btn--primary): fondo Verde Emblema (#1E7335), texto blanco, radio 8 px, sombra suave y transicion de 0.2 s. Hover en Verde Impulso (#22A341) y foco con halo de 2 px en el mismo tono.
- Secundario (btn--secondary): fondo transparente con borde de 1 px en Verde Emblema y texto homonimo; hover con relleno sutil en Verde Impulso al 12 % y foco con contorno interior.
- Terciario (btn--tertiary): solo texto con icono alineado, color Azul Canaleta (#3498DB), sin fondo y subrayado al hover.
- Estado deshabilitado: fondo Gris Niebla, texto Gris Muelle, cursor not-allowed y supresion de sombras.

### 3.2 Inputs y formularios
- Altura estandar: 48 px, padding horizontal 16 px, bordes de 1 px en Gris Muelle al 60 %.
- Hover: realce del borde a Gris Muelle pleno; foco con borde Verde Emblema y halo degradado (Verde Emblema a Verde Canal) de 2 px.
- Mensajes de error: texto 12 px en Rojo Alerta, acompanado de icono opcional con aria-live="polite" para comunicar actualizaciones.
- Formularios complejos: estructurar con BEM (booking-form__group, booking-form__label) y agrupar campos relacionados con separacion vertical de 24 px.

### 3.3 Tarjetas de producto
- Dimensiones de referencia: 360 x 440 px en escritorio, adaptables mediante layout fluido.
- Composicion: imagen de embarcacion o indumentaria, titulo Montserrat 22 px, descripcion Source Sans 3 14 px y CTA primario en el pie.
- Diferenciadores: utilizar badges Amarillo Regata para destacar categorias, precios en Montserrat 20 px 600 y etiquetas de beneficio en Verde Impulso.
- Interaccion: elevacion mediante sombra y desplazamiento vertical -4 px al hover, con transicion de 0.2 s.
- Convencion BEM sugerida: gear-card, gear-card__media, gear-card__title, gear-card__meta, gear-card__cta.

### 3.4 Barra de navegacion y pie de pagina
- Navegacion superior: altura 76 px, fondo blanco, borde inferior de 1 px Gris Muelle, incluye logotipo, menu principal, buscador y accesos a carrito y perfil.
- Comportamiento responsive: en tablet el menu se contrae en icono hamburguesa; en mobile se despliega panel lateral con transicion de 0.3 s, conservando botones primarios en Verde Emblema.
- Footer: tres zonas (informacion institucional, enlaces rapidos, contacto y redes) sobre fondo Gris Carbon con tipografia blanca y enlaces que cambian a Verde Impulso al hover.

## 4. Reglas de maquetado
### 4.1 Sistema de rejilla
- Contenedor maximo: 1240 px centrado con padding lateral de 24 px.
- Rejilla base: 12 columnas (ancho 80 px, gutter 24 px) en escritorio; 8 columnas en tablet y 4 columnas en mobile.
- Secciones hero: ocupan las 12 columnas con imagen lateral en escritorio y apilan contenido en mobile, respetando el uso de Verde Fondeo para overlays.

### 4.2 Espaciados y alineaciones
- Escala modulada en multiplos de 4 px: 4, 8, 12, 16, 24, 32, 40, 56, 72.
- Margenes superiores de seccion: 72 px en escritorio, 48 px en tablet, 32 px en mobile.
- Alineacion: emplear Flexbox para centrar verticalmente contenidos en cabeceras y tarjetas; mantener texto alineado a la izquierda salvo testimonios o contenidos destacados.

### 4.3 Uso de Flexbox y Grid
- Flexbox: ideal para agrupar botones, iconos con texto y cabeceras de modulos.
- CSS Grid: recomendado para listados de equipamiento y calendario de entrenamientos. Configuracion sugerida grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)).
- Breakpoints clave: 1200 px (desktop amplio), 992 px (desktop medio), 768 px (tablet), 575 px (mobile).

## 5. Buenas practicas
### 5.1 Convenciones de nombres
- Utilizar metodologia BEM con prefijos contextuales: nav-main__item--active, booking-form__field, gear-card__cta.
- Utilidades globales con prefijo u- (u-flex-center, u-hidden-desktop) y tokens compartidos con prefijo token- (token-shadow-elevated).

### 5.2 Responsividad
- Definir media queries en orden ascendente para minimizar sobreescrituras y centralizar los breakpoints descritos en la seccion 4.3.
- Priorizar acciones principales en mobile; botones como "Reservar" y "Sumarse al club" deben permanecer visibles sin scroll horizontal.
- Optimizar imagenes de embarcaciones y eventos para evitar tiempos de carga elevados en conexiones moviles.

### 5.3 Accesibilidad
- Garantizar contraste minimo 4.5:1 entre texto y fondo; Verde Emblema sobre blanco alcanza 7.8:1.
- Incluir estados :focus-visible diferenciados en enlaces, tarjetas y botones, utilizando halos en Verde Impulso o Azul Canaleta segun el contexto.
- Asociar etiquetas y descripciones a elementos de formulario, especialmente en modulos de reserva que incluyen informacion sanitaria.
- Proveer alternativas textuales a imagenes de actividades y marcar iconos decorativos con aria-hidden="true".

## 6. Sistema de diseno (tokens base)
Los siguientes tokens constituyen la base visual del sistema: definen colores, tipografia, sombras, radios y espaciados que se reutilizan en todo el ecosistema Rowing Club Ecommerce.

```css
:root {
  --color-primary: #1E7335;
  --color-primary-hover: #22A341;
  --color-primary-dark: #0C3F19;
  --color-success: #22A341;
  --color-gradient-accent: #4CAF50;
  --color-warning: #E6B800;
  --color-alert: #F39C12;
  --color-info: #3498DB;
  --color-danger: #C0392B;
  --color-neutral-dark: #121212;
  --color-neutral: #6F7B8C;
  --color-neutral-light: #F4F6FA;
  --font-headings: ''Montserrat'', ''Segoe UI'', sans-serif;
  --font-body: ''Source Sans 3'', ''Segoe UI'', sans-serif;
  --font-mono: ''Roboto Mono'', ''SFMono-Regular'', monospace;
  --shadow-elevated: 0 12px 32px rgba(12, 63, 25, 0.16);
  --radius-sm: 4px;
  --radius-md: 8px;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 40px;
  --spacing-xxl: 72px;
}
```

## 7. Ejemplos de codigo
Estos fragmentos ilustran la aplicacion de los tokens en componentes recurrentes del sitio.

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-headings);
  font-weight: 600;
  line-height: 1.2;
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-xl);
  gap: var(--spacing-xs);
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.btn--primary {
  background-color: var(--color-primary);
  color: #FFFFFF;
  box-shadow: 0 10px 24px rgba(30, 115, 53, 0.24);
}

.btn--primary:hover,
.btn--primary:focus-visible {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
}

.btn--secondary {
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  background-color: transparent;
}

.btn--secondary:hover,
.btn--secondary:focus-visible {
  background-color: rgba(34, 163, 65, 0.12);
}

.input-field {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid rgba(111, 123, 140, 0.6);
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input-field:focus-visible {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(30, 115, 53, 0.25);
  outline: none;
}

.gear-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  background-color: #FFFFFF;
  box-shadow: var(--shadow-elevated);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.gear-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 36px rgba(12, 63, 25, 0.22);
}

.nav-bar {
  position: sticky;
  top: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 76px;
  padding: 0 var(--spacing-xl);
  background-color: #FFFFFF;
  border-bottom: 1px solid rgba(111, 123, 140, 0.35);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

@media (max-width: 991px) {
  .layout {
    padding: 0 var(--spacing-md);
  }

  .nav-bar {
    padding: 0 var(--spacing-md);
  }
}

@media (max-width: 575px) {
  .btn {
    width: 100%;
  }

  .nav-bar {
    flex-wrap: wrap;
    height: auto;
    gap: var(--spacing-sm);
  }
}
```

Se recomienda auditar de forma trimestral la implementacion de estos lineamientos para mantener la coherencia visual y la experiencia premium asociada a Rowing Club.





