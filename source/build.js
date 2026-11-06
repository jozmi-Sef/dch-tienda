/**
 * Genera el sitio estático en ../site
 * Uso:  node build.js
 */
const fs = require('fs');
const path = require('path');
const L = require('./lib.js');
const P = require('./pages.js');

const SITE_DIR = path.join(__dirname, '..', 'site');

function write(file, page, root) {
  const target = path.join(SITE_DIR, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, L.layout({ root, ...page }));
}

/* Recursos compartidos */
fs.mkdirSync(path.join(SITE_DIR, 'css'), { recursive: true });
fs.mkdirSync(path.join(SITE_DIR, 'js'), { recursive: true });
fs.copyFileSync(path.join(__dirname, 'assets', 'styles.css'), path.join(SITE_DIR, 'css', 'styles.css'));
fs.copyFileSync(path.join(__dirname, 'assets', 'app.js'), path.join(SITE_DIR, 'js', 'app.js'));
fs.writeFileSync(path.join(SITE_DIR, 'js', 'catalog.js'), `window.DCH_CATALOG = ${JSON.stringify(L.clientCatalog())};\n`);

/* Páginas de la raíz */
const rootPages = {
  'index.html': P.home(),
  'segunda-mano.html': P.usedLanding(),
  'marcas.html': P.brandsPage(),
  'mantenimiento.html': P.maintenance(),
  'alquiler.html': P.rental(),
  'nosotros.html': P.about(),
  'contacto.html': P.contact(),
  'cuenta.html': P.account(),
  'ayuda.html': P.help(),
  'carrito.html': P.cartPage(),
  'checkout.html': P.checkout(),
  'gracias.html': P.thanks(),
};
let count = 0;
for (const [file, page] of Object.entries(rootPages)) {
  write(file, page, '');
  count += 1;
}

/* Colecciones */
for (const [file, page] of P.collectionsAll()) {
  write(file, page, '../');
  count += 1;
}

/* Productos */
for (const item of L.PRODUCTS) {
  write(`productos/${item.handle}.html`, P.product(item), '../');
  count += 1;
}

console.log(`Sitio generado: ${count} páginas en ${SITE_DIR}`);
