/**
 * Piezas compartidas del sitio: datos de la tienda, iconos, tarjetas, cabecera y pie.
 * Todo devuelve HTML como texto; build.js lo ensambla en páginas.
 */
const fs = require('fs');
const path = require('path');
const { CATEGORIES, CATEGORY_GROUPS, PRODUCTS, NEW, USED, BRANDS, slugify } = require('./data.js');

/* ---------- Datos de la tienda ---------- */
const SITE = {
  name: 'DCH Maquinarias',
  short: 'DCH Tools',
  phone: '+51 933 731 327',
  wa: '51933731327',
  email: 'Dchmaquinarias@gmail.com',
  address: 'Jr. Máximo Alvarado 189, Urb. Ciudad de Dios, Zona K, San Juan de Miraflores, Lima',
  hours: 'Lun–Sáb 8:00 am – 6:00 pm',
  sunday: 'Domingo previa coordinación',
  social: {
    ig: 'https://www.instagram.com/dch.tools',
    fb: 'https://www.facebook.com/share/1BkD7L1Xnr/',
    tt: 'https://www.tiktok.com/@dch.tools',
  },
};

const esc = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const money = (value) => `S/ ${Number(value).toLocaleString('en-US')}`;
const waLink = (text) => `https://wa.me/${SITE.wa}?text=${encodeURIComponent(text)}`;

/* ---------- Logos de marca ---------- */
const BRAND_DIR = path.join(__dirname, '..', 'site', 'img', 'brands');

/** Ruta relativa del logo de una marca si existe el archivo; si no, null. */
function brandLogo(brand) {
  const slug = slugify(brand);
  for (const ext of ['svg', 'png', 'webp', 'jpg']) {
    if (fs.existsSync(path.join(BRAND_DIR, `${slug}.${ext}`))) return `img/brands/${slug}.${ext}`;
  }
  return null;
}

/** Medidas de un logo PNG (lee la cabecera del archivo). Devuelve null si no se puede. */
function brandLogoSize(relativePath) {
  if (!relativePath || !relativePath.endsWith('.png')) return null;
  try {
    const buffer = fs.readFileSync(path.join(__dirname, '..', 'site', relativePath));
    return { w: buffer.readUInt32BE(16), h: buffer.readUInt32BE(20) };
  } catch {
    return null;
  }
}

/* ---------- Iconos (trazo, 24 px) ---------- */
const ICONS = {
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
  user: '<circle cx="12" cy="8.5" r="3.7"/><path d="M4.5 20c.6-3.6 3.6-5.6 7.5-5.6s6.9 2 7.5 5.6"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/>',
  cart: '<path d="M3 4h2.4l2 10.2a1.6 1.6 0 0 0 1.6 1.3h8a1.6 1.6 0 0 0 1.6-1.2L20 8H6.2"/><circle cx="9.5" cy="19.2" r="1.3"/><circle cx="17" cy="19.2" r="1.3"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  'chev-down': '<path d="M6 9.5l6 6 6-6"/>',
  'chev-right': '<path d="M9.5 6l6 6-6 6"/>',
  'arrow-right': '<path d="M4 12h15M13 6l6 6-6 6"/>',
  'arrow-left': '<path d="M20 12H5M11 6l-6 6 6 6"/>',
  whatsapp: '<path d="M4 20l1.3-4.1A8.2 8.2 0 1 1 8.2 18.7L4 20z"/><path d="M9.2 8.8c.3 2.6 2.4 4.7 5 5l1.2-1.3-2-1-.9.7a3.6 3.6 0 0 1-1.7-1.7l.7-.9-1-2z"/>',
  truck: '<path d="M3 6.5h11v10H3z"/><path d="M14 9.5h4l3 3.2v3.8h-7z"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>',
  shield: '<path d="M12 3l7 3v5.5c0 4.4-3 7.8-7 9.5-4-1.7-7-5.1-7-9.5V6z"/><path d="M8.8 12l2.2 2.2 4.2-4.4"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.2a7 7 0 1 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.8" r="2.4"/>',
  phone: '<path d="M5 4h3.6l1.9 4.8-2.4 1.5a11 11 0 0 0 5.6 5.6l1.5-2.4L20 15.4V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  bolt: '<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
  box: '<path d="M3.5 8L12 4l8.5 4v8L12 20l-8.5-4z"/><path d="M3.5 8L12 12l8.5-4M12 12v8"/>',
  doc: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>',
  card: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10.5h18M7 15h4"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  return: '<path d="M9 7H4v5M4 12a8 8 0 1 0 2.4-5.7"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>',
  store: '<path d="M4 9l1.5-5h13L20 9v1a3 3 0 0 1-6 0 3 3 0 0 1-4 0 3 3 0 0 1-6 0zM5 12v8h14v-8"/>',
};

const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">${Object.entries(ICONS)
  .map(([name, body]) => `<symbol id="i-${name}" viewBox="0 0 24 24">${body}</symbol>`)
  .join('')}</svg>`;

const ic = (name) => `<svg class="i" aria-hidden="true"><use href="#i-${name}"/></svg>`;

/** Engranaje decorativo (eco del logo). */
function gearSvg() {
  const teeth = 14;
  const outer = 300;
  const inner = 250;
  const points = [];
  for (let i = 0; i < teeth; i += 1) {
    const base = (i / teeth) * Math.PI * 2;
    const step = (Math.PI * 2) / teeth;
    const angles = [base, base + step * 0.22, base + step * 0.34, base + step * 0.62, base + step * 0.74];
    const radii = [inner, inner, outer, outer, inner];
    angles.forEach((angle, index) => points.push(`${(320 + Math.cos(angle) * radii[index]).toFixed(1)},${(320 + Math.sin(angle) * radii[index]).toFixed(1)}`));
  }
  return `<svg class="hero__gear" viewBox="0 0 640 640" aria-hidden="true"><polygon points="${points.join(' ')}" fill="currentColor"/><circle cx="320" cy="320" r="130" fill="#00092e"/></svg>`;
}

/* ---------- Productos listos para renderizar ---------- */
const CAT_ORDER = Object.keys(CATEGORIES);
PRODUCTS.forEach((product, index) => {
  const category = CATEGORIES[product.cat];
  product.index = index;
  product.id = product.handle;
  product.href = `productos/${product.handle}.html`;
  product.img = product.base === 'rotomartillo-sds-plus-32-mm-3-funciones-1500w' ? 'img/pendiente.svg' : `img/p/${product.base}.webp`;
  product.catName = category.name;
  product.catHandle = category.handle;
  product.sku = `DCH-${String(index + 1).padStart(4, '0')}`;
});

const specLine = (product) => {
  if (product.condition === 'usado') return `${product.hours} h de uso · Estado ${product.grade}`;
  return product.specs
    .slice(0, 2)
    .map(([label, value]) => value)
    .join(' · ');
};

function badges(product) {
  const out = [];
  if (product.condition === 'usado') out.push('<span class="badge badge--used">Segunda mano</span>');
  else if (product.compareAt) out.push('<span class="badge badge--sale">Oferta</span>');
  else if (product.best) out.push('<span class="badge badge--best">Más pedido</span>');
  return out.join('');
}

const stockHtml = (product) =>
  product.stock === 'pedido' ? '<p class="stock stock--order">Bajo pedido</p>' : '<p class="stock">En stock Lima</p>';

function card(product, root = '', options = {}) {
  const href = `${root}${product.href}`;
  const quote = waLink(`Hola, deseo cotizar este producto: ${product.title}`);
  return `<article class="card" data-id="${product.id}" data-cat="${product.cat}" data-brand="${esc(product.brand)}" data-cond="${product.condition}" data-price="${product.price}" data-stock="${product.stock}" data-title="${esc(product.title.toLowerCase())}" data-text="${esc(`${product.title} ${product.brand} ${product.catName} ${product.condition === 'usado' ? 'segunda mano usado' : 'nuevo'}`)}" data-index="${product.index}"${options.group ? ` data-group="${options.group}"` : ''}>
    <div class="card__tags">${badges(product)}</div>
    <button type="button" class="fav" data-fav="${product.id}" aria-pressed="false" aria-label="Guardar en favoritos">${ic('heart')}</button>
    <a class="card__media" href="${href}" tabindex="-1" aria-hidden="true"><img src="${root}${product.img}" alt="" width="320" height="320" loading="lazy"></a>
    <div class="card__body">
      <p class="card__meta">${esc(product.brand)} · ${esc(product.catName)}</p>
      <h3 class="card__title"><a href="${href}">${esc(product.title)}</a></h3>
      <p class="card__spec">${esc(specLine(product)) || '&nbsp;'}</p>
      <p class="price num">${money(product.price)}${product.compareAt ? ` <s>${money(product.compareAt)}</s>` : ''}</p>
      ${stockHtml(product)}
      <div class="card__foot">
        <button type="button" class="btn btn--red btn--sm" data-add="${product.id}">Añadir</button>
        <a class="card__wa" href="${quote}" target="_blank" rel="noopener" aria-label="Cotizar ${esc(product.title)} por WhatsApp">${ic('whatsapp')}</a>
      </div>
    </div>
  </article>`;
}

/* ---------- Estructura común ---------- */
function topbar() {
  return `<div class="topbar"><div class="wrap topbar__in">
    <div class="topbar__group"><span class="topbar__item">${ic('truck')}Envíos a todo el Perú</span><span class="topbar__item">${ic('pin')}Lima en 24 horas</span></div>
    <div class="topbar__group topbar__group--aside"><span class="topbar__item">${ic('clock')}${SITE.hours}</span><a class="topbar__item" href="https://wa.me/${SITE.wa}" target="_blank" rel="noopener">${ic('whatsapp')}${SITE.phone}</a></div>
  </div></div>`;
}

function mega(root) {
  const cols = CATEGORY_GROUPS.map(
    (group) => `<div class="mega__col"><h3>${group.name}</h3>${group.keys
      .map((key) => {
        const count = PRODUCTS.filter((product) => product.cat === key).length;
        return `<a href="${root}colecciones/${CATEGORIES[key].handle}.html">${CATEGORIES[key].name}<small>${count}</small></a>`;
      })
      .join('')}</div>`
  ).join('');

  return `<div class="mega" id="mega" hidden><div class="wrap mega__in">${cols}
    <a class="mega__feat" href="${root}segunda-mano.html"><img src="${root}img/mock/taller.svg" alt=""><span class="tag tag--cyan">Segunda mano</span><strong class="h-md">Equipos revisados, con horas de uso a la vista</strong><span class="link-arrow" style="color:#fff">Ver equipos ${ic('arrow-right')}</span></a>
  </div></div>`;
}

function header(root, current = '') {
  const link = (href, label, key, extra = '') => `<li><a class="nav__link" href="${root}${href}"${current === key ? ' aria-current="page"' : ''}>${label}${extra}</a></li>`;
  return `${topbar()}
  <header class="header">
    <div class="wrap masthead">
      <a class="logo-plate" href="${root}index.html" aria-label="${SITE.name}, inicio"><img src="${root}img/logo.png" alt="${SITE.short}: herramientas para construcción" width="104" height="59"></a>
      <div class="search" role="search">
        <form class="search__form" action="${root}colecciones/todos.html" method="get">
          <label class="vh" for="q-main">Buscar herramientas</label>
          <input id="q-main" name="q" type="search" placeholder="Busca rotomartillos, generadores, soldadoras…" autocomplete="off" data-search-input>
          <button class="search__btn" type="submit" aria-label="Buscar">${ic('search')}</button>
        </form>
        <div class="suggest" data-suggest hidden></div>
      </div>
      <div class="actions">
        <button type="button" class="action menu-toggle" data-open="menu" aria-label="Abrir menú">${ic('menu')}</button>
        <a class="action action--text" href="${root}cuenta.html">${ic('user')}<span><small>Hola, inicia sesión</small><strong>Mi cuenta</strong></span></a>
        <a class="action" href="${root}colecciones/todos.html?fav=1" aria-label="Favoritos">${ic('heart')}<span class="dot-count" data-fav-count hidden>0</span></a>
        <button type="button" class="action action--cart" data-open="cart" aria-label="Abrir carrito">${ic('cart')}<span class="dot-count" data-cart-count hidden>0</span><span><small style="color:#ffd5d8">Carrito</small><strong class="num" data-cart-total>S/ 0</strong></span></button>
      </div>
    </div>
    <nav class="navbar" aria-label="Principal"><div class="wrap navbar__in">
      <ul class="nav">
        <li><button type="button" class="nav__link nav__link--shop" data-toggle-target="mega" aria-expanded="false" aria-controls="mega">${ic('menu')}Tienda${ic('chev-down')}</button></li>
        ${link('colecciones/nuevos.html', 'Máquinas nuevas', 'nuevos')}
        ${link('segunda-mano.html', 'Segunda mano', 'usados', ' <span class="nav__tag">Revisadas</span>')}
        ${link('marcas.html', 'Marcas', 'marcas')}
        <li><button type="button" class="nav__link" data-toggle-target="menu-servicios" aria-expanded="false" aria-controls="menu-servicios">Servicios${ic('chev-down')}</button>
          <div class="menu-drop" id="menu-servicios" hidden>
            <a href="${root}mantenimiento.html">Mantenimiento<small>Preventivo y correctivo</small></a>
            <a href="${root}alquiler.html">Alquiler<small>Equipos por días o semanas</small></a>
          </div></li>
        ${link('nosotros.html', 'Nosotros', 'nosotros')}
        ${link('contacto.html', 'Contacto', 'contacto')}
      </ul>
    </div>${mega(root)}</nav>
  </header>`;
}

function mobileNav(root) {
  const groups = CATEGORY_GROUPS.map(
    (group) => `<details><summary>${group.name}${ic('chev-down')}</summary><div class="mnav__sub">${group.keys.map((key) => `<a href="${root}colecciones/${CATEGORIES[key].handle}.html">${CATEGORIES[key].name}</a>`).join('')}</div></details>`
  ).join('');
  return `<aside class="mnav" data-panel="menu" aria-label="Menú">
    <div class="drawer__head"><h2>Menú</h2><button type="button" class="icon-btn" data-close aria-label="Cerrar menú">${ic('close')}</button></div>
    <div class="mnav__body">
      <a href="${root}colecciones/nuevos.html">Máquinas nuevas</a>
      <a href="${root}segunda-mano.html">Segunda mano ${ic('chev-right')}</a>
      ${groups}
      <a href="${root}marcas.html">Marcas</a>
      <a href="${root}mantenimiento.html">Mantenimiento</a>
      <a href="${root}alquiler.html">Alquiler</a>
      <a href="${root}nosotros.html">Nosotros</a>
      <a href="${root}contacto.html">Contacto</a>
      <a href="${root}cuenta.html">Mi cuenta</a>
    </div>
  </aside>`;
}

function cartDrawer(root) {
  return `<aside class="drawer" data-panel="cart" aria-label="Carrito">
    <div class="drawer__head"><h2>Tu carrito</h2><button type="button" class="icon-btn" data-close aria-label="Cerrar carrito">${ic('close')}</button></div>
    <div class="drawer__body" data-drawer-lines></div>
    <div class="drawer__foot" data-drawer-foot hidden>
      <div class="totals"><div><span>Subtotal</span><b class="num" data-cart-total>S/ 0</b></div><div><span>Envío</span><span>Se calcula al pagar</span></div></div>
      <a class="btn btn--red btn--block" href="${root}checkout.html">Finalizar compra ${ic('arrow-right')}</a>
      <a class="btn btn--ghost btn--block" href="${root}carrito.html">Ver carrito</a>
      <a class="btn btn--wa btn--block" data-wa-cart href="#" target="_blank" rel="noopener">${ic('whatsapp')}Cotizar este pedido</a>
    </div>
  </aside>`;
}

function footer(root) {
  const sc = SITE.social;
  return `<footer class="footer">
    <div class="wrap footer__top">
      <div class="footer__brand">
        <img src="${root}img/logo.png" alt="${SITE.short}" width="114" height="64">
        <p>Venta de herramientas y maquinaria para construcción, nuevas y de segunda mano, en Lima y con envíos a todo el Perú.</p>
        <div class="social"><a href="${sc.ig}" target="_blank" rel="noopener" aria-label="Instagram">ig</a><a href="${sc.fb}" target="_blank" rel="noopener" aria-label="Facebook">fb</a><a href="${sc.tt}" target="_blank" rel="noopener" aria-label="TikTok">tt</a></div>
      </div>
      <div><h3>Tienda</h3><ul>
        <li><a href="${root}colecciones/nuevos.html">Máquinas nuevas</a></li><li><a href="${root}segunda-mano.html">Segunda mano</a></li>
        <li><a href="${root}marcas.html">Marcas</a></li><li><a href="${root}colecciones/todos.html">Todo el catálogo</a></li></ul></div>
      <div><h3>Servicios y ayuda</h3><ul>
        <li><a href="${root}mantenimiento.html">Mantenimiento</a></li><li><a href="${root}alquiler.html">Alquiler</a></li>
        <li><a href="${root}ayuda.html">Preguntas frecuentes</a></li><li><a href="${root}ayuda.html#reclamaciones">Libro de reclamaciones</a></li></ul></div>
      <div><h3>Visítanos</h3><address>${SITE.address}<br><br>${SITE.hours}<br>${SITE.sunday}<br><br><a href="https://wa.me/${SITE.wa}" target="_blank" rel="noopener">${SITE.phone}</a><br><a href="mailto:${SITE.email}">${SITE.email}</a></address></div>
    </div>
    <div class="footer__bar"><div class="wrap footer__bar-in">
      <span>© <span data-year>2026</span> ${SITE.name}. Todos los derechos reservados.</span>
      <div class="pay-chips" aria-label="Medios de pago"><span>VISA</span><span>MASTERCARD</span><span>YAPE</span><span>PLIN</span><span>TRANSFERENCIA</span></div>
    </div></div>
  </footer>
  <a class="wa-float" href="${waLink('¡Hola DCH Tools! Quiero cotizar una herramienta.')}" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">${ic('whatsapp')}<span class="wa-float__long">Cotiza por WhatsApp</span><span class="wa-float__short">Cotiza</span></a>`;
}

/* ---------- Plantilla de página ---------- */
const FONTS = 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:wght@400..700&display=swap';

function layout({ root = '', title, description = '', body, current = '', bare = false, scripts = '', bodyClass = '', extraHead = '' }) {
  const full = title === SITE.name ? title : `${title} · ${SITE.name}`;
  return `<!doctype html>
<html lang="es" data-root="${root}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#000c3a">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_PE">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(description)}">
${extraHead}
<link rel="icon" href="${root}img/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="${root}css/styles.css">
</head>
<body class="${['mock-notes', bodyClass].filter(Boolean).join(' ')}">
${sprite}
<a class="skip" href="#main">Saltar al contenido</a>
${bare ? '' : header(root, current)}
<main id="main">
${body}
</main>
${bare ? '' : footer(root)}
${bare ? '' : cartDrawer(root) + mobileNav(root)}
<div class="overlay" data-overlay></div>
<script src="${root}js/catalog.js"></script>
<script src="${root}js/app.js"></script>
${scripts}
</body>
</html>`;
}

/** Catálogo mínimo para el navegador. */
const clientCatalog = () => ({
  wa: SITE.wa,
  categories: Object.fromEntries(Object.entries(CATEGORIES).map(([key, value]) => [key, { name: value.name, handle: value.handle }])),
  products: PRODUCTS.map((product) => ({
    id: product.id,
    title: product.title,
    brand: product.brand,
    cat: product.cat,
    catName: product.catName,
    condition: product.condition,
    grade: product.grade || null,
    price: product.price,
    href: product.href,
    img: product.img,
  })),
});

module.exports = {
  SITE,
  CATEGORIES,
  CATEGORY_GROUPS,
  PRODUCTS,
  NEW,
  USED,
  BRANDS,
  CAT_ORDER,
  slugify,
  brandLogo,
  brandLogoSize,
  esc,
  money,
  waLink,
  ic,
  gearSvg,
  card,
  specLine,
  badges,
  stockHtml,
  layout,
  header,
  footer,
  clientCatalog,
};
