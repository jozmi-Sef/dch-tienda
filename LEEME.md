# DCH Maquinarias · Tienda (prototipo HTML)

Abre `site/index.html` en el navegador. No necesita servidor ni instalación (las fuentes se cargan de Google Fonts, así que se ve mejor con internet).

## Qué trae
- 95 páginas: Home, tienda (todos / nuevos / segunda mano / 13 categorías), 67 fichas de producto, segunda mano, marcas, mantenimiento, alquiler, nosotros, contacto, ayuda, cuenta, carrito, checkout y confirmación.
- Carrito lateral, búsqueda con sugerencias, favoritos, filtros y orden, checkout con estilo Shopify.
- Todo funciona en el navegador (los datos del carrito y favoritos se guardan en `localStorage`).

## Carpetas
- `site/` el sitio listo para abrir.
- `source/` lo que genera el sitio. Para regenerarlo: `cd source` y `node build.js`.
  - `data.js` catálogo, categorías y precios.
  - `pages.js` textos y estructura de cada página.
  - `lib.js` cabecera, pie, tarjetas e iconos.
  - `assets/styles.css` y `assets/app.js` estilos y comportamiento.
  - `mock.js` genera las maquetas de dibujo.

## Qué hay que reemplazar o confirmar
1. **Precios.** Son de ejemplo (la web antigua no publica precios). Se editan en `source/data.js`.
2. **Segunda mano.** Las 10 unidades, sus horas de uso y estados (A o B) son ejemplos. Lo que se revisa en cada equipo también es un ejemplo.
3. **Maquetas.** `site/img/mock/*.svg` son dibujos de referencia (equipo, mostrador, despacho, taller, tienda). Cada una lleva la etiqueta "MAQUETA" y se reemplaza por una foto real con el mismo nombre.
4. **Envíos y plazos.** "Lima 24 h, provincias 48–72 h" y los costos S/ 18 y S/ 35 del checkout son de ejemplo.
5. **Libro de reclamaciones.** Es obligatorio en tiendas online del Perú. Hay un espacio reservado en `ayuda.html`.
6. **Foto sin producto.** "Rotomartillo SDS Plus 32 mm" usaba en su web antigua una foto del equipo. Quedó con "Foto pendiente". La foto está en `site/img/ref/`.

## Paso a Shopify
| Prototipo | Shopify |
|---|---|
| `index.html` | `templates/index.json` con secciones |
| `colecciones/*.html` | `templates/collection.json` (filtros nativos de Search & Discovery) |
| `productos/*.html` | `templates/product.json` |
| `carrito.html` y cajón | `templates/cart.json` y carrito lateral |
| `checkout.html` | Checkout de Shopify (se personaliza con Checkout Branding) |
| `data.js` condición, horas, estado | metacampos de producto (`custom.condicion`, `custom.horas_uso`, `custom.estado`) |
| Especificaciones | metacampo `custom.especificaciones` |

## Pasarela de pago
El checkout ya tiene el orden y el estilo de Shopify. En Shopify se conecta la pasarela real (Niubiz, Izipay, Culqi o Mercado Pago). Yape y Plin se activan como método de pago manual o mediante la pasarela elegida.
