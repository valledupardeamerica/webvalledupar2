# Valledupar de América — sitio web

Sitio estático (HTML/CSS/JS puro, sin frameworks ni build step) para el conjunto vallenato **Valledupar de América**, listo para publicarse en GitHub Pages.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub (por ejemplo `valledupar-de-america`) y sube todos estos archivos a la raíz (o a una carpeta `/docs` si prefieres).
2. En el repositorio: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, elige la rama `main` y la carpeta `/ (root)` (o `/docs`).
3. Espera unos minutos: tu sitio quedará en `https://tu-usuario.github.io/valledupar-de-america/`.
4. Reemplaza `https://tudominio.github.io/valledupar-de-america/` por esa URL real en: `index.html` (etiquetas `canonical` y `og:url`), `robots.txt` y `sitemap.xml`.

## Antes de publicar: reemplaza estos placeholders

- **Contacto real** (sección "Contacto" en `index.html` y en `js/i18n.js`, claves `contact.addr`, `contact.phone`, `contact.mail`): dirección, teléfono/WhatsApp y correo reales.
- **Enlace de WhatsApp** del botón "Escríbenos por WhatsApp" (`https://wa.me/000000000`) — usa tu número real con código de país, sin signos ni espacios.
- **Redes sociales**: los íconos de Instagram/Facebook/TikTok/YouTube tienen `href="#"` — reemplázalos por tus enlaces reales.
- **Fotos de integrantes**: las tarjetas de "Integrantes" usan un ícono ilustrado como marcador de posición. Sustituye el bloque `.member-photo` por una etiqueta `<img>` con la foto real (agrega siempre `alt` descriptivo, y `loading="lazy"` si no es la primera imagen visible).
- **Testimonios**: son de ejemplo (marcados como "ejemplo"). Reemplázalos por reseñas reales de tus primeros eventos.
- **Pistas de música**: los tres reproductores están en modo "próximamente". Cuando tengas grabaciones, conecta el botón de reproducción (`.track-play`) a un archivo de audio real.

## Funcionalidades incluidas

Animaciones de scroll (reveal con IntersectionObserver), microinteracciones y estados hover en botones, navegación móvil con panel deslizante, favicon SVG propio, botón volver arriba, pantalla de carga, transiciones de tema/idioma, animación de entrada del hero, CTA repetido (hero, música, banda final), formulario de contacto con validación en vivo y estados de error/éxito/carga, autosave del formulario en `localStorage`, modo oscuro/claro, selector de idioma ES/EN, botones de redes sociales y de compartir (Web Share API con respaldo a portapapeles), carrusel de testimonios, banner de cookies con consentimiento granular, texto alternativo en imágenes/íconos decorativos marcados como `aria-hidden`, página 404 y página de "gracias" personalizadas, breakpoints responsivos, paleta de comandos (`Ctrl/Cmd+K`), atajo de teclado `t` para cambiar de tema, feedback háptico en móviles compatibles (`navigator.vibrate`), `sitemap.xml`, `robots.txt`, meta título y descripción únicos por página, y páginas de política de privacidad y términos y condiciones.

## Analítica

La analítica está **desactivada por defecto** y solo se activa si la persona acepta el banner de cookies (`js/main.js`, función `applyAnalyticsConsent`). Ahí encontrarás un bloque comentado de ejemplo para conectar un proveedor real (Plausible, GA4, etc.) — descoméntalo y coloca tu propio script una vez que tengas cuenta creada.

## Formulario de contacto

El envío está **simulado** en el frontend (no hay backend). Para recibir los mensajes de verdad, conecta el `<form id="contact-form">` a un servicio como Formspree, un backend propio, o una Cloud Function, y ajusta la función `initContactForm` en `js/main.js` para hacer el `fetch` real en lugar de la simulación con `setTimeout`.

## Imágenes y velocidad

El sitio no incluye fotografías (todo son íconos SVG livianos) para mantenerlo rápido desde el día uno. Cuando agregues fotos reales:
- Expórtalas en formato **WebP** (o AVIF) y comprímelas (por ejemplo con [Squoosh](https://squoosh.app)).
- Usa `loading="lazy"` en toda imagen que no esté en la primera pantalla.
- Define siempre `width`/`height` para evitar saltos de layout, y un `alt` descriptivo.
