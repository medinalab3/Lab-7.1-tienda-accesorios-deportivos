PROYECTO: Creación de un sitio web — Tienda online "Arena Sport"
          (accesorios deportivos)
CURSO: NCBTO - 2026-5CC - WADE 1000L - 3663ONL (Front-End Technologies and
       User Interface (UI) and Laboratory)
UNIVERSIDAD: Northbridge University
ESTUDIANTE: Gerardo J. Medina (GJ)
NUMERO DE ESTUDIANTE: 2507056253

DESCRIPCIÓN
-----------
Escenario elegido: Tienda online. Arena Sport es una tienda ficticia de
accesorios deportivos (balones, fitness, protección e hidratación/bolsos).
El sitio tiene una página de inicio y 12 páginas subordinadas, hechas con
HTML5 semántico, CSS propio + Bootstrap 5 y JavaScript sin librerías.
Todos los datos, precios y contactos son ficticios.

PÁGINAS (13 en total)
---------------------
 1. index.html        Inicio: carrusel, beneficios, categorías, destacados.
 2. catalogo.html     Catálogo completo con búsqueda, filtro y orden.
 3. balones.html      Categoría Balones.
 4. fitness.html      Categoría Fitness.
 5. proteccion.html   Categoría Protección.
 6. hidratacion.html  Categoría Hidratación y bolsos.
 7. ofertas.html      Productos en oferta y tabla de ahorros.
 8. producto.html     Detalle de un producto (se elige con ?id=p01 ... p20).
 9. carrito.html      Carrito con cantidades, IVU y envío.
10. envios.html       Envíos y devoluciones.
11. nosotros.html     Historia, valores y autor del sitio.
12. preguntas.html    Preguntas frecuentes (acordeón de Bootstrap).
13. contacto.html     Formulario de contacto validado con JavaScript.

CUMPLIMIENTO DE LOS REQUISITOS
------------------------------
HTML (módulos 3 y 4)
 - Estructura header / main / footer en todas las páginas.
 - Elementos semánticos: nav, section, article, aside, figure,
   figcaption, address, time, table con caption.
 - Página de inicio + 12 subordinadas (mínimo pedido: 10).
 - Cada archivo HTML empieza con un comentario que explica la estructura
   HTML5 usada.

CSS (módulos 4 y 5)
 - css/style.css con variables (:root), selectores de elemento, clase e
   ID, modelo de caja, transiciones y tipografía propia (Oswald e Inter).
 - Bootstrap 5.3.3 por CDN (grid, navbar, cards, modal, toast,
   acordeón, formularios). Mi CSS se carga después para sobrescribirlo.
 - Identidad: fondo azul noche, acento naranja y verde lima, un color
   por categoría.
 - Responsivo: móvil, tablet y escritorio con la cuadrícula de Bootstrap
   y media queries propias (575, 767, 991 y 1400 px).

JavaScript (módulo 6)
 - Carrusel de imágenes en la página de inicio, hecho a mano (js/carrusel.js):
   avance automático, flechas, puntos, pausa al pasar el mouse, botón de
   pausa, teclado (flechas), deslizar en pantallas táctiles.
 - Resaltado de productos al pasar el mouse (clase .resaltado + atenuado
   de las demás tarjetas) y detalles en un modal al hacer clic.
 - Validación del formulario de contacto y del boletín en tiempo real
   (js/formulario.js): mensajes que dicen qué corregir, clases
   is-valid / is-invalid, contador de caracteres y foco al primer error.
 - Extras: carrito con localStorage, filtros y búsqueda en el catálogo,
   página de detalle dinámica.

BUENAS PRÁCTICAS IMPLEMENTADAS (módulo 7)
-----------------------------------------
 1. Código organizado: una carpeta por tipo (css/, js/, imagenes/) y un
    archivo JS por responsabilidad (datos, carrito, productos, carrusel,
    formulario, app).
 2. Comentarios: cada archivo tiene un encabezado que explica su función
    y los bloques importantes están comentados.
 3. HTML semántico y accesible: landmarks (header, main, nav, aside,
    footer), un solo <h1> por página con jerarquía de títulos, atributo
    alt en las imágenes, <label> en cada campo, enlace "Saltar al
    contenido", atributos aria-* y foco visible para teclado.
 4. Nombres claros y consistentes en español (ej. .tarjeta-categoria,
    agregarYAvisar) y minúsculas con guiones en los archivos.
 5. CSS mantenible: variables en :root para colores y fuentes, índice
    de secciones y un solo lugar para cambiar la identidad.
 6. JavaScript limpio: 'use strict', funciones pequeñas, IIFE para no
    contaminar el espacio global, un único objeto Arena, delegación de
    eventos y textContent en lugar de innerHTML para texto del usuario.
 7. Datos separados de la lógica: js/datos.js es la única fuente de los
    productos.
 8. Rendimiento: imágenes SVG livianas, loading="lazy" y width/height
    para evitar saltos de diseño, scripts al final del <body>.
 9. Responsivo y respetuoso: viewport, diseño móvil primero y soporte
    de prefers-reduced-motion.
10. Validación y seguridad básica: validación en el cliente con mensajes
    claros (la validación real siempre debe repetirse en el servidor).
11. Control de versiones con Git/GitHub.

ARCHIVOS INCLUIDOS
------------------
- 13 archivos .html (listados arriba)
- css/style.css
- js/datos.js, carrito.js, productos.js, carrusel.js, formulario.js, app.js
- imagenes/logo.svg
- imagenes/slides/   (4 imágenes del carrusel)
- imagenes/productos/ (20 imágenes de productos)
- README.txt

NOTA SOBRE LAS IMÁGENES
-----------------------
Las imágenes son ilustraciones vectoriales (SVG) creadas para el
proyecto.

ENLACE DEL REPOSITORIO DE GITHUB
---------------------------------
https://github.com/medinalab3/Lab-7.1-tienda-accesorios-deportivos

CÓMO VISUALIZAR EL PROYECTO
---------------------------
1. Abrir la carpeta en Visual Studio Code.
2. Abrir index.html con la extensión Live Server (clic derecho >
   Open with Live Server) o directamente en el navegador. Se necesita
   conexión a internet porque Bootstrap y las fuentes vienen de CDN.
3. Navegar con el menú superior. Probar: el carrusel, pasar el mouse
   sobre un producto, hacer clic para ver el modal, añadir al carrito,
   filtrar el catálogo y llenar el formulario de contacto con datos
   incorrectos para ver la validación.
4. Para ver el diseño responsivo: F12 > icono de dispositivo móvil, o
   reducir el ancho de la ventana.
