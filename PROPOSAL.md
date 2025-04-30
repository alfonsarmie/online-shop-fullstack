# Propuesta TP DSW

## Grupo
### Integrantes
* 53276 - Tarrio Gennero, Nicolás
* 53600 - Re, Joaquin Eduardo
* 52301 - Maseda, Valentino
* 52059 - Sarmiento, Alfonso
* 52657- Fe, Catalina

### Repositorios
* [fullstack app]()


## Tema
### Descripción
La tienda online oficial del club social y deportivo ofrece merchandising exclusivo a través de una plataforma donde los usuarios pueden registrarse, crear perfiles y disfrutar de un sistema de roles que distingue entre clientes regulares, socios, administradores y recepcionistas. El catálogo organiza los productos en categorías definidas, con detalles completos sobre cada artículo, mientras que el proceso de compra incluye un carrito y diversas opciones de pago seguras. La gestión de pedidos mantiene un historial de compras accesible para cada usuario. Los clientes pueden publicar reseñas y calificaciones sobre artículos y pedidos para orientar a otros compradores, y acceder a promociones especiales en fechas significativas para el club. La plataforma también incorpora herramientas analíticas para optimizar inventario, ventas y experiencia del usuario, funcionando no solo como canal comercial sino como extensión digital de los productos del club. 

### Modelo
![imagen del modelo]()

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo


Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Artículos<br>3. CRUD Categoría<br>4. CRUD Descuentos<br>5. CRUD Metodos Pago<br>6. CRUD Descuentos<br>7. CRUD Pedidos<br>|
|CRUD dependiente|1. CRUD Precio {depende de} CRUD Artículos<br>2. CRUD Comentario {depende de} CRUD Artículos<br>3. CRUD Pedido {depende de} CRUD Usuario<br>4. CRUD Devoluciones {depende de} CRUD Pedido<br>5. CRUD Reseña Pedido {depende de} CRUD Pedido<br>6. CRUD Estado Pedido {depende de} CRUD Pedido|
|Listado<br>+<br>detalle| 1. Listado de habitaciones filtrado por tipo de habitación, muestra nro y tipo de habitación => detalle CRUD Habitacion<br> 2. Listado de reservas filtrado por rango de fecha, muestra nro de habitación, fecha inicio y fin estadía, estado y nombre del cliente => detalle muestra datos completos de la reserva y del cliente|
|CUU/Epic|1. Reservar una habitación para la estadía<br>2. Realizar el check-in de una reserva|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tipo Habitacion<br>2. CRUD Servicio<br>3. CRUD Localidad<br>4. CRUD Provincia<br>5. CRUD Habitación<br>6. CRUD Empleado<br>7. CRUD Cliente|
|CUU/Epic|1. Reservar una habitación para la estadía<br>2. Realizar el check-in de una reserva<br>3. Realizar el check-out y facturación de estadía y servicios|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes|
|CUU/Epic|1. Consumir servicios<br>2. Cancelación de reserva|
|Otros|1. Envío de recordatorio de reserva por email|
