/**
 * Cuerpo de cada página. Devuelve { title, description, body, current, scripts?, bare? }.
 */
const L = require('./lib.js');
const { SITE, CATEGORIES, CATEGORY_GROUPS, PRODUCTS, NEW, USED, BRANDS, esc, money, waLink, ic, gearSvg, card, specLine, badges } = L;

const byHandle = (handle) => PRODUCTS.find((product) => product.handle === handle);
const cap = (text) => text.charAt(0).toUpperCase() + text.slice(1);

/** Altura del logo en la cinta: los logos casi cuadrados (con símbolo arriba) necesitan más alto. */
const logoHeight = (logo) => {
  const size = L.brandLogoSize(logo);
  return size && size.w / size.h < 1.5 ? 58 : 40;
};

/** Marca para la cinta del Home: logo si existe, nombre en texto si no. */
const brandMark = (brand, root = '') => {
  const logo = L.brandLogo(brand);
  const href = `${root}colecciones/todos.html?marca=${encodeURIComponent(brand)}`;
  return logo
    ? `<a class="brand-logo" href="${href}" aria-label="${esc(brand)}"><img src="${root}${logo}" alt="${esc(brand)}" height="${logoHeight(logo)}" loading="lazy"></a>`
    : `<a href="${href}">${esc(brand)}</a>`;
};

/* ---------- Componentes ---------- */
const photo = (root, name, note, extra = '') =>
  `<div class="photo ${extra}"><img src="${root}img/mock/${name}.svg" alt="${esc(note)}" loading="lazy"><span class="photo__note">MAQUETA · reemplazar por foto real</span></div>`;

const crumbs = (root, items, dark = false) =>
  `<nav class="crumbs${dark ? ' crumbs--dark' : ''}" aria-label="Ruta"><a href="${root}index.html">Inicio</a>${items
    .map(([label, href]) => `${ic('chev-right')}${href ? `<a href="${root}${href}">${esc(label)}</a>` : `<span aria-current="page">${esc(label)}</span>`}`)
    .join('')}</nav>`;

const secHead = ({ tag, title, text, link, tagClass = '' }) =>
  `<div class="sec-head"><div class="sec-head__text">${tag ? `<span class="tag ${tagClass}">${tag}</span>` : ''}<h2 class="h-lg">${title}</h2>${text ? `<p class="lead">${text}</p>` : ''}</div>${link || ''}</div>`;

const steps = (items) => `<ol class="steps">${items.map(([title, text]) => `<li class="step"><h3>${title}</h3><p>${text}</p></li>`).join('')}</ol>`;

const faq = (items) => `<div class="faq">${items.map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join('')}</div>`;

const REVIEWS = [
  ['Jesús Tello', 'Maestro de obra', 'Equipos confiables y buena atención. Pedí unos generadores y llegaron en óptimas condiciones. Recomendado para quienes trabajamos en construcción.'],
  ['David Quiroz', 'Técnico en herramientas', 'Productos de calidad, siempre encuentro lo que necesito. Estoy feliz porque puedo abastecer mi local.'],
  ['Miguel Araujo', 'Maestro de obra', 'Buenos precios y buena atención. Todo llegó conforme a mi destino y en muy buen estado.'],
];

const reviews = () =>
  `<div class="reviews">${REVIEWS.map(
    ([name, role, quote]) => `<figure class="review" style="margin:0"><blockquote>${quote}</blockquote><figcaption><span class="avatar" aria-hidden="true">${name
      .split(' ')
      .map((part) => part[0])
      .join('')}</span><span><strong>${name}</strong><small>${role}</small></span></figcaption></figure>`
  ).join('')}</div>`;

const newsletter = () => `<div class="wrap sec--tight"><div class="news"><div><h2 class="h-lg">Entérate primero de las ofertas.</h2><p style="margin-top:10px">Equipos recién llegados y precios especiales, sin spam.</p></div>
  <form data-demo-form="Listo, te suscribiste." ><label class="vh" for="news-email">Correo</label><input id="news-email" type="email" required placeholder="Tu correo electrónico" autocomplete="email"><button class="btn btn--navy" type="submit">Suscribirme</button></form></div></div>`;

const contactForm = (id = 'f') => `<form class="form" data-demo-form="Recibimos tu mensaje. Te respondemos el mismo día." >
  <div class="fld"><input id="${id}-name" name="nombre" required placeholder=" " autocomplete="name"><label for="${id}-name">Nombre *</label></div>
  <div class="fld-row"><div class="fld"><input id="${id}-tel" name="celular" type="tel" placeholder=" " autocomplete="tel"><label for="${id}-tel">Celular</label></div>
  <div class="fld"><input id="${id}-mail" name="correo" type="email" placeholder=" " autocomplete="email"><label for="${id}-mail">Correo electrónico</label></div></div>
  <div class="fld"><input id="${id}-need" name="necesidad" placeholder=" "><label for="${id}-need">¿Qué necesitas?</label></div>
  <div class="fld"><textarea id="${id}-msg" name="mensaje" placeholder=" "></textarea><label for="${id}-msg">Mensaje adicional</label></div>
  <button class="btn btn--red" type="submit">Solicitar cotización ${ic('arrow-right')}</button>
  <p class="mono" style="color:var(--steel)">Respuesta rápida en horario de atención. Sin compromiso.</p></form>`;

const phero = ({ root, crumbItems, tag, title, text, actions = '', visual = '', split = false }) =>
  `<section class="phero${split ? ' phero--split' : ''}"><div class="wrap phero__in">${split ? `<div style="display:grid;gap:16px;justify-items:start">` : ''}${crumbs(root, crumbItems, true)}${tag ? `<span class="tag">${tag}</span>` : ''}<h1 class="h-xl" style="font-size:clamp(2rem,4.6vw,3.75rem)">${title}</h1>${text ? `<p class="lead">${text}</p>` : ''}${actions ? `<div class="hero__cta">${actions}</div>` : ''}${split ? `</div><div>${visual}</div>` : ''}</div></section>`;

/* ---------- Home ---------- */
function home() {
  const root = '';
  const featured = byHandle('generador-de-luz-3000-w');
  const best = NEW.filter((product) => product.best);
  const offers = NEW.filter((product) => product.compareAt);
  const used = USED.slice(0, 8);

  const catCards = Object.entries(CATEGORIES)
    .map(([key, category]) => {
      const list = PRODUCTS.filter((product) => product.cat === key && product.condition === 'nuevo');
      const sample = list[0];
      return `<a class="cat" href="colecciones/${category.handle}.html"><img src="${sample.img}" alt="" width="320" height="240" loading="lazy"><span class="cat__body"><strong>${category.name}</strong><small>${list.length} ${list.length === 1 ? 'modelo' : 'modelos'}</small></span></a>`;
    })
    .join('');

  const moreCats = `<a class="cat cat--more" href="colecciones/todos.html"><strong>Todo el catálogo</strong><small style="color:#b9c4e6">${NEW.length} modelos nuevos</small>${ic('arrow-right')}</a><a class="cat cat--more cat--used" href="segunda-mano.html"><strong>Segunda mano</strong><small>${USED.length} equipos revisados</small>${ic('arrow-right')}</a>`;

  const rail = (list, group) => list.map((product) => card(product, root, { group })).join('');

  const body = `
<section class="hero">${gearSvg()}
  <div class="wrap hero__in">
    <div class="hero__copy">
      <span class="tag">Máquinas nuevas y de segunda mano</span>
      <h1 class="h-xl">Equipos de obra, <em>listos para trabajar.</em></h1>
      <p class="lead">Compra online herramientas y maquinaria para construcción. Atendemos desde San Juan de Miraflores y enviamos a todo el Perú.</p>
      <div class="hero__cta"><a class="btn btn--red" href="colecciones/todos.html">Ver la tienda ${ic('arrow-right')}</a><a class="btn btn--ghost-light" href="${waLink('¡Hola DCH Tools! Quiero cotizar una herramienta.')}" target="_blank" rel="noopener">${ic('whatsapp')}Cotizar por WhatsApp</a></div>
      <div class="quick"><span>Lo más buscado:</span><a href="colecciones/rotomartillos.html">Rotomartillos</a><a href="colecciones/generadores.html">Generadores</a><a href="colecciones/soldadoras.html">Soldadoras</a><a href="colecciones/herramientas-de-aire.html">Compresoras</a><a href="segunda-mano.html">Segunda mano</a></div>
    </div>
    <div class="hero__visual">
      <span class="tag tag--cyan hero__stat">${NEW.length} modelos en catálogo</span>
      ${photo(root, 'equipo', 'Maqueta de foto del equipo DCH', 'photo--cut')}
      <div class="hero-pick"><a class="hero-pick__media" href="${featured.href}" aria-hidden="true" tabindex="-1"><img src="${featured.img}" alt="" width="64" height="64"></a><div class="hero-pick__body"><small>Destacado · ${featured.sku}</small><a href="${featured.href}"><strong>${esc(featured.title)}</strong></a><b class="num">${money(featured.price)}</b></div><button type="button" class="btn btn--red btn--sm" data-add="${featured.id}">Añadir</button></div>
    </div>
  </div>
</section>

<section class="trust"><div class="wrap trust__in">
  <div class="trust__item">${ic('box')}<div><strong>${NEW.length} modelos en catálogo</strong><span>De ${BRANDS.length} marcas, con stock en Lima</span></div></div>
  <div class="trust__item">${ic('truck')}<div><strong>Envíos a todo el Perú</strong><span>Lima 24 h · Provincias 48–72 h</span></div></div>
  <div class="trust__item">${ic('store')}<div><strong>Desde 2019 en el rubro</strong><span>Maestros de obra, técnicos y ferreterías</span></div></div>
  <div class="trust__item">${ic('doc')}<div><strong>Boleta o factura</strong><span>Para personas y empresas</span></div></div>
</div></section>

<section class="sec"><div class="wrap">
  ${secHead({ tag: 'Elige cómo comprar', title: 'Nuevo o de segunda mano, tú decides.' })}
  <div class="choice">
    <article class="choice__card choice__card--new">
      <div class="choice__imgs"><img src="${byHandle('maquina-de-soldar-inverter-250-amp').img}" alt=""><img src="${byHandle('demoledor-electrico-1300w-20j').img}" alt=""><img src="${byHandle('generador-de-luz-3000-w').img}" alt=""></div>
      <span class="tag">Nuevas</span><h3 class="h-lg">Máquinas nuevas</h3>
      <p class="lead">Powful, Ingco, Dong Cheng, Bomtex y más. Productos originales con respaldo de fabricante en equipos seleccionados.</p>
      <ul><li>${ic('check')}Stock inmediato en Lima</li><li>${ic('check')}Boleta o factura</li><li>${ic('check')}Mantenimiento y repuestos</li></ul>
      <a class="btn btn--red" href="colecciones/nuevos.html" style="justify-self:start">Ver máquinas nuevas ${ic('arrow-right')}</a>
    </article>
    <article class="choice__card choice__card--used">
      <div class="choice__imgs"><img src="${USED[0].img}" alt=""><img src="${USED[1].img}" alt=""><img src="${USED[3].img}" alt=""></div>
      <span class="tag tag--navy">Segunda mano</span><h3 class="h-lg">Equipos revisados, con horas de uso a la vista</h3>
      <p class="lead">Cada equipo se revisa antes de venderse. Ves su estado y sus horas de uso antes de pagar.</p>
      <ul><li>${ic('check')}Estado y horas de uso a la vista</li><li>${ic('check')}Revisión antes de la entrega</li><li>${ic('check')}Precio menor al de un equipo nuevo</li></ul>
      <a class="btn btn--navy" href="segunda-mano.html" style="justify-self:start">Ver segunda mano ${ic('arrow-right')}</a>
    </article>
  </div>
</div></section>

<section class="sec sec--white"><div class="wrap">
  ${secHead({ tag: 'Catálogo', title: 'Compra por categoría', link: `<a class="link-arrow" href="colecciones/todos.html">Ver todo el catálogo ${ic('arrow-right')}</a>` })}
  <div class="cats">${catCards}${moreCats}</div>
</div></section>

<section class="sec" data-rail><div class="wrap">
  ${secHead({ tag: 'Destacados', title: 'Lo que más se lleva', link: `<div class="rail-ctrl"><button type="button" data-rail-dir="-1" aria-label="Anteriores">${ic('arrow-left')}</button><button type="button" data-rail-dir="1" aria-label="Siguientes">${ic('arrow-right')}</button></div>` })}
  <div class="tabs" role="tablist" aria-label="Destacados" style="margin-bottom:20px"><button class="tab" role="tab" data-group="best" aria-selected="true">Más pedidos</button><button class="tab" role="tab" data-group="offers" aria-selected="false">Ofertas</button><button class="tab" role="tab" data-group="used" aria-selected="false">Segunda mano</button></div>
  <div class="rail">${rail(best, 'best')}${rail(offers, 'offers')}${rail(used, 'used')}</div>
</div></section>

<section class="brands" aria-label="Marcas que trabajamos"><div class="brands__track">${[0, 1]
    .map((copy) => `<div class="brands__set"${copy ? ' inert aria-hidden="true"' : ''}>${BRANDS.map((brand) => brandMark(brand)).join('')}</div>`)
    .join('')}</div></section>

<section class="sec"><div class="wrap">
  <div class="human">
    ${photo(root, 'mostrador', 'Maqueta de foto de asesoría en mostrador', 'photo--cut')}
    <div class="human__copy">
      <span class="tag">Detrás del mostrador</span>
      <h2 class="h-lg">Somos una familia del rubro. Te ayudamos a elegir bien.</h2>
      <p class="lead">DCH nació del esfuerzo y las enseñanzas de nuestra familia en el rubro ferretero y de maquinaria. Desde 2019 atendemos a maestros de obra, técnicos, contratistas y ferreterías.</p>
      <ul class="promises">
        <li>${ic('wrench')}<div><strong>Asesoría real</strong><span>Te recomendamos la mejor opción según tu trabajo y tu presupuesto.</span></div></li>
        <li>${ic('doc')}<div><strong>Cotización el mismo día</strong><span>Precio, disponibilidad y condiciones, sin vueltas.</span></div></li>
        <li>${ic('shield')}<div><strong>Soporte después de comprar</strong><span>Mantenimiento y repuestos para tus equipos.</span></div></li>
      </ul>
      <div class="hero__cta"><a class="btn btn--navy" href="nosotros.html">Conoce al equipo</a><a class="btn btn--wa" href="${waLink('¡Hola DCH Tools! Quiero una asesoría.')}" target="_blank" rel="noopener">${ic('whatsapp')}Escríbenos</a></div>
    </div>
  </div>
  <div class="moments">
    <article class="moment">${photo(root, 'despacho', 'Maqueta de foto del despacho')}<h3>Despacho a todo el Perú</h3><p>Preparamos tu pedido y lo enviamos el mismo día hábil.</p></article>
    <article class="moment">${photo(root, 'taller', 'Maqueta de foto del taller')}<h3>Taller de mantenimiento</h3><p>Diagnóstico honesto antes de cualquier reparación.</p></article>
    <article class="moment">${photo(root, 'tienda', 'Maqueta de foto de la tienda')}<h3>Tienda en San Juan de Miraflores</h3><p>Visítanos y llévate tu equipo hoy mismo.</p></article>
  </div>
</div></section>

<section class="sec sec--dark maint" data-scrolly aria-labelledby="maint-title"><div class="wrap maint__in">
  <div class="maint__side">
    <span class="tag">Después de comprar</span>
    <h2 class="h-lg" id="maint-title">Mantenimiento para que tu equipo no pare.</h2>
    <p class="lead">Preventivo y correctivo para alargar la vida útil de tus herramientas y reducir tiempos muertos en obra.</p>
    <div class="ticket" aria-hidden="true"><small>ORDEN DE SERVICIO</small><strong data-scrolly-label>Diagnóstico</strong>
      <div class="ticket__bar"><i class="on"></i><i></i><i></i><i></i></div><span class="mono" data-scrolly-count>Paso 1 de 4</span></div>
    <a class="btn btn--red" href="mantenimiento.html">Cotizar mantenimiento ${ic('arrow-right')}</a>
    <p class="maint__note">¿Solo necesitas un equipo por unos días? <a href="alquiler.html">También alquilamos</a>.</p>
  </div>
  <ol class="maint__steps">
    <li class="mstep is-active" data-n="1" data-title="Diagnóstico"><h3>Diagnóstico</h3><p>Revisamos tu herramienta o maquinaria y te contamos qué tiene.</p></li>
    <li class="mstep" data-n="2" data-title="Cotización antes de reparar"><h3>Cotización antes de reparar</h3><p>Te informamos el trabajo y el costo antes de tocar nada. Tú decides.</p></li>
    <li class="mstep" data-n="3" data-title="Mantenimiento o reparación"><h3>Mantenimiento o reparación</h3><p>Limpieza, calibración, cambio de repuestos y reparación de fallas.</p></li>
    <li class="mstep" data-n="4" data-title="Entrega con garantía"><h3>Entrega con garantía</h3><p>Te devolvemos el equipo con garantía de servicio.</p></li>
  </ol>
</div></section>

<section class="sec"><div class="wrap">
  ${secHead({ tag: 'Comprar es simple', title: 'Del clic a tu obra en cuatro pasos.' })}
  ${steps([['Elige tu equipo', 'Nuevo o de segunda mano, con precio y stock a la vista.'], ['Paga como prefieras', 'Tarjeta, Yape, Plin o transferencia bancaria.'], ['Recibe o recoge', 'Lima en 24 horas, provincias en 48 a 72 horas, o recoge en tienda.'], ['Te acompañamos', 'Garantía, mantenimiento y repuestos cuando los necesites.']])}
</div></section>

<section class="sec sec--white"><div class="wrap">
  ${secHead({ tag: 'Reseñas', title: 'Lo que dicen nuestros clientes' })}
  ${reviews()}
</div></section>

<section class="sec"><div class="wrap">
  ${secHead({ tag: 'Preguntas frecuentes', title: 'Antes de comprar' })}
  ${faq([
    ['¿Las herramientas y maquinaria tienen garantía?', 'Sí, contamos con garantía en productos seleccionados. Las condiciones se informan al momento de la compra.'],
    ['¿Qué formas de pago aceptan?', 'Tarjeta, Yape, Plin y transferencia bancaria. También coordinamos el pago junto con tu cotización por WhatsApp.'],
    ['¿Hacen envíos fuera de Lima?', 'Sí, despachamos a nivel nacional.'],
    ['¿Emiten boleta o factura?', 'Sí, emitimos boleta o factura según corresponda.'],
  ])}
</div></section>
${newsletter()}`;

  const business = {
    '@context': 'https://schema.org',
    '@type': 'HardwareStore',
    name: SITE.name,
    description: 'Venta de herramientas y maquinaria para construcción, nuevas y de segunda mano.',
    telephone: SITE.phone,
    email: SITE.email,
    foundingDate: '2019',
    address: { '@type': 'PostalAddress', streetAddress: 'Jr. Máximo Alvarado 189, Urb. Ciudad de Dios, Zona K', addressLocality: 'San Juan de Miraflores', addressRegion: 'Lima', addressCountry: 'PE' },
    openingHours: 'Mo-Sa 08:00-18:00',
    sameAs: Object.values(SITE.social),
  };

  return {
    title: SITE.name,
    description: 'Herramientas y maquinaria para construcción, nuevas y de segunda mano. Lima y envíos a todo el Perú.',
    body,
    current: 'home',
    extraHead: `<script type="application/ld+json">${JSON.stringify(business)}</script>`,
  };
}

/* ---------- Colecciones ---------- */
function collection({ handle, title, tag, blurb, list, facetCats = true, crumbLabel }) {
  const root = '../';
  const brandCounts = {};
  list.forEach((product) => {
    brandCounts[product.brand] = (brandCounts[product.brand] || 0) + 1;
  });
  const catCounts = {};
  list.forEach((product) => {
    catCounts[product.cat] = (catCounts[product.cat] || 0) + 1;
  });
  const hasBoth = list.some((product) => product.condition === 'nuevo') && list.some((product) => product.condition === 'usado');
  const prices = list.map((product) => product.price);

  const filters = `<aside class="filters" data-filters aria-label="Filtros">
    <div class="filters__head"><h2>Filtros</h2><button type="button" class="link-clear" data-clear>Limpiar</button></div>
    ${hasBoth ? `<details class="fgroup" open><summary>Condición</summary>
      <label class="check"><input type="checkbox" data-filter="cond" data-value="nuevo" value="nuevo">Nuevo<small>${list.filter((p) => p.condition === 'nuevo').length}</small></label>
      <label class="check"><input type="checkbox" data-filter="cond" data-value="usado" value="usado">Segunda mano<small>${list.filter((p) => p.condition === 'usado').length}</small></label></details>` : ''}
    ${facetCats ? `<details class="fgroup" open><summary>Categoría</summary>${Object.keys(catCounts)
      .map((key) => `<label class="check"><input type="checkbox" data-filter="cat" data-value="${key}" value="${key}">${CATEGORIES[key].name}<small>${catCounts[key]}</small></label>`)
      .join('')}</details>` : ''}
    <details class="fgroup" open><summary>Marca</summary>${Object.keys(brandCounts)
      .sort()
      .map((brand) => `<label class="check"><input type="checkbox" data-filter="brand" data-value="${esc(brand)}" value="${esc(brand)}">${esc(brand)}<small>${brandCounts[brand]}</small></label>`)
      .join('')}</details>
    <details class="fgroup" open><summary>Precio (S/)</summary><div class="range"><input type="number" min="0" placeholder="${Math.min(...prices)}" aria-label="Precio mínimo" data-price-min><span>–</span><input type="number" min="0" placeholder="${Math.max(...prices)}" aria-label="Precio máximo" data-price-max></div></details>
    <details class="fgroup" open><summary>Disponibilidad</summary><label class="check"><input type="checkbox" data-filter="stock" data-value="lima">Solo en stock Lima</label></details>
  </aside>`;

  const body = `
<section class="phero"><div class="wrap phero__in">${crumbs(root, [['Tienda', 'colecciones/todos.html'], [crumbLabel || title]], true)}
  ${tag ? `<span class="tag ${tag.cls || ''}">${tag.text}</span>` : ''}<h1 class="h-xl" style="font-size:clamp(2rem,4.6vw,3.75rem)">${title}</h1><p class="lead">${blurb}</p></div></section>
<div class="wrap shop" data-collection>
  ${filters}
  <div>
    <div class="toolbar">
      <p class="toolbar__count"><strong data-count>${list.length}</strong> de ${list.length} productos</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap"><button type="button" class="btn btn--ghost btn--sm filters-toggle" data-filters-toggle>${ic('filter')}Filtros</button>
      <label class="vh" for="sort-${handle}">Ordenar por</label><select id="sort-${handle}" class="select toolbar__sort" data-sort><option value="default">Destacados</option><option value="price-asc">Precio: menor a mayor</option><option value="price-desc">Precio: mayor a menor</option><option value="name-asc">Nombre: A a Z</option></select></div>
    </div>
    <div class="chips" data-chips></div>
    <div class="grid" data-grid>${list.map((product) => card(product, root)).join('')}</div>
    <div class="noresult" data-noresult hidden>${ic('search')}<strong>No hay productos con esos filtros</strong><span>Quita algún filtro o pídenos lo que buscas por WhatsApp.</span><a class="btn btn--wa" href="${waLink('Hola DCH Tools, estoy buscando una herramienta.')}" target="_blank" rel="noopener">${ic('whatsapp')}Preguntar por WhatsApp</a></div>
  </div>
</div>`;
  return { title, description: blurb, body, current: handle === 'nuevos' ? 'nuevos' : '' };
}

function collectionsAll() {
  const pages = [];
  pages.push([
    'colecciones/todos.html',
    collection({ handle: 'todos', title: 'Catálogo', blurb: 'Todas las herramientas y maquinaria, nuevas y de segunda mano.', list: PRODUCTS }),
  ]);
  pages.push([
    'colecciones/nuevos.html',
    collection({ handle: 'nuevos', title: 'Máquinas nuevas', tag: { text: 'Nuevas' }, blurb: 'Equipos nuevos de marcas reconocidas, con stock en Lima.', list: NEW }),
  ]);
  pages.push([
    'colecciones/segunda-mano.html',
    collection({ handle: 'segunda-mano', title: 'Segunda mano', tag: { text: 'Revisadas', cls: 'tag--cyan' }, blurb: 'Equipos usados revisados. Ves su estado y sus horas de uso antes de comprar.', list: USED }),
  ]);
  Object.entries(CATEGORIES).forEach(([key, category]) => {
    pages.push([
      `colecciones/${category.handle}.html`,
      collection({ handle: category.handle, title: category.name, blurb: `${category.blurb}.`, list: PRODUCTS.filter((product) => product.cat === key), facetCats: false }),
    ]);
  });
  return pages;
}

/* ---------- Ficha de producto ---------- */
function product(item) {
  const root = '../';
  const used = item.condition === 'usado';
  const related = PRODUCTS.filter((other) => other.cat === item.cat && other.handle !== item.handle && other.condition === item.condition).slice(0, 4);
  const filler = PRODUCTS.filter((other) => other.cat !== item.cat && other.condition === 'nuevo').slice(0, 4 - related.length);
  const quote = waLink(`Hola, deseo cotizar este producto: ${item.title}\n${item.sku}`);
  const saving = item.compareAt ? Math.round(((item.compareAt - item.price) / item.compareAt) * 100) : 0;
  const facts = item.specs.slice(0, 3);

  const usedPanel = used
    ? `<div class="panel panel--used"><h3>${ic('shield')}Equipo de segunda mano · Estado ${item.grade}</h3>
      <div class="facts"><div class="fact"><strong>${item.hours} h</strong><span>de uso</span></div><div class="fact"><strong>${item.grade}</strong><span>${item.grade === 'A' ? 'Como nuevo' : 'Buen estado'}</span></div><div class="fact"><strong>Revisado</strong><span>antes de entregar</span></div></div>
      <ul class="checklist"><li>${ic('check')}Encendido y funcionamiento</li><li>${ic('check')}Carcasa y cables</li><li>${ic('check')}Accesorios incluidos</li><li>${ic('check')}Limpieza y lubricación</li></ul>
      <p class="mono" style="color:var(--steel)">La foto es referencial del modelo. Te enviamos fotos de esta unidad por WhatsApp.</p></div>`
    : facts.length
      ? `<div class="facts">${facts.map(([label, value]) => `<div class="fact"><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`).join('')}</div>`
      : '';

  const specTable = item.specs.length
    ? `<table class="spec"><tbody>${item.specs.map(([label, value]) => `<tr><th scope="row">${esc(label)}</th><td>${esc(value)}</td></tr>`).join('')}<tr><th scope="row">Marca</th><td>${esc(item.brand)}</td></tr><tr><th scope="row">Código</th><td>${item.sku}</td></tr></tbody></table>`
    : `<table class="spec"><tbody><tr><th scope="row">Marca</th><td>${esc(item.brand)}</td></tr><tr><th scope="row">Código</th><td>${item.sku}</td></tr></tbody></table><p class="mono" style="margin-top:12px;color:var(--steel)">Ficha técnica en preparación. Pídenos los datos de este modelo por WhatsApp.</p>`;

  const body = `<div class="wrap">${crumbs(root, [['Tienda', 'colecciones/todos.html'], [item.catName, `colecciones/${item.catHandle}.html`], [item.title]])}
  <div class="pdp">
    <div class="gallery"><div class="gallery__main"><div class="gallery__tags">${badges(item)}</div><img src="${root}${item.img}" alt="${esc(item.title)}" width="640" height="640"></div>
      <p class="gallery__note">${ic('shield')}${used ? 'Foto referencial del modelo.' : 'Producto original con respaldo del fabricante en equipos seleccionados.'}</p></div>
    <div class="buybox">
      <div class="buybox__brand"><a href="${root}colecciones/todos.html?marca=${encodeURIComponent(item.brand)}">${esc(item.brand)}</a><span>${item.sku}</span><span>${used ? 'Segunda mano' : 'Nuevo'}</span></div>
      <h1 class="h-lg" style="margin-top:-8px">${esc(item.title)}</h1>
      <div>${item.stock === 'pedido' ? '<p class="stock stock--order">Bajo pedido · te confirmamos el plazo</p>' : '<p class="stock">En stock en Lima · entrega inmediata en tienda</p>'}</div>
      <p class="price num">${money(item.price)}${item.compareAt ? ` <s>${money(item.compareAt)}</s> <span class="badge badge--sale">${used ? `Ahorras ${saving}%` : `-${saving}%`}</span>` : ''}</p>
      <p class="buybox__tax">Precio en soles con IGV incluido. Boleta o factura.</p>
      ${usedPanel}
      <div class="buy-row"><div class="qty" role="group" aria-label="Cantidad"><button type="button" data-step="-1" aria-label="Quitar uno">−</button><input type="number" value="1" min="1" max="99" aria-label="Cantidad" data-qty-input><button type="button" data-step="1" aria-label="Agregar uno">+</button></div>
        <button type="button" class="btn btn--red" data-add="${item.id}" data-use-qty>${ic('cart')}Añadir al carrito</button></div>
      <div class="buy-row"><button type="button" class="btn btn--navy" data-add="${item.id}" data-use-qty data-buy-now>Comprar ahora</button>
        <a class="btn btn--wa" href="${quote}" target="_blank" rel="noopener">${ic('whatsapp')}Cotizar por WhatsApp</a>
        <button type="button" class="btn btn--ghost" data-fav="${item.id}" aria-pressed="false" style="flex:0 0 auto;min-width:0">${ic('heart')}Guardar</button></div>
      <div class="panel delivery"><h3>${ic('truck')}Entrega</h3>
        <div class="delivery__row"><label class="vh" for="dep">Departamento</label><select id="dep" class="select" data-delivery><option value="lima">Lima</option><option value="provincias">Otro departamento</option></select></div>
        <p data-delivery-out>Lima: llega en 24 horas hábiles, o recógelo en tienda hoy mismo.</p></div>
    </div>
  </div>
  <section class="sec--tight" style="padding-top:0"><h2 class="h-md" style="margin-bottom:16px">Especificaciones</h2>${specTable}</section>
  <section class="sec--tight"><h2 class="h-md" style="margin-bottom:16px">Envíos, pagos y garantía</h2>${faq([
    ['¿Cuánto demora mi pedido?', 'Lima en 24 horas hábiles y provincias en 48 a 72 horas. También puedes recoger en tienda en San Juan de Miraflores.'],
    ['¿Qué medios de pago aceptan?', 'Tarjeta de crédito o débito, Yape, Plin y transferencia bancaria.'],
    [used ? '¿Qué garantía tiene un equipo de segunda mano?' : '¿Tiene garantía?', used ? 'Los equipos de segunda mano se entregan revisados. Las condiciones de garantía se informan antes de pagar.' : 'Sí, contamos con garantía en productos seleccionados. Las condiciones se informan al momento de la compra.'],
    ['¿Emiten boleta o factura?', 'Sí, emitimos boleta o factura según corresponda.'],
  ])}</section>
  <section class="sec--tight" style="padding-bottom:96px"><h2 class="h-lg" style="margin-bottom:24px">También te puede interesar</h2><div class="grid grid--rail4">${[...related, ...filler].map((other) => card(other, root)).join('')}</div></section>
</div>
<div class="sticky-buy"><div><small class="mono">${item.sku}</small><br><b class="num">${money(item.price)}</b></div><button type="button" class="btn btn--red" data-add="${item.id}">${ic('cart')}Añadir</button></div>`;

  return { title: item.title, description: `${item.title}. ${item.brand}. ${used ? 'Segunda mano revisada' : 'Nuevo'} con entrega en Lima y envíos a todo el Perú.`, body, current: '', bodyClass: 'is-pdp' };
}

/* ---------- Segunda mano ---------- */
function usedLanding() {
  const root = '';
  const body = `
${phero({
    root,
    crumbItems: [['Segunda mano']],
    tag: 'Segunda mano revisada',
    title: 'Equipos usados que sí puedes comprar tranquilo.',
    text: 'Revisamos cada equipo antes de ponerlo a la venta. Antes de pagar ves su estado, sus horas de uso y qué incluye.',
    actions: `<a class="btn btn--red" href="colecciones/segunda-mano.html">Ver todos los equipos ${ic('arrow-right')}</a><a class="btn btn--ghost-light" href="#vende">Vende tu equipo</a>`,
    visual: photo(root, 'taller', 'Maqueta de foto del taller de revisión', 'photo--cut'),
    split: true,
  })}
<section class="sec"><div class="wrap">
  ${secHead({ tag: 'Cómo lo hacemos', title: 'Qué revisamos antes de vender' })}
  ${steps([['Recepción', 'Registramos marca, modelo, horas de uso y accesorios.'], ['Revisión técnica', 'Probamos encendido, motor, carcasa y cables.'], ['Limpieza y ajuste', 'Lubricamos, limpiamos y cambiamos lo que haga falta.'], ['Estado visible', 'Publicamos su estado (A o B) y sus horas de uso.']])}
</div></section>
<section class="sec sec--white"><div class="wrap">
  ${secHead({ tag: 'Disponibles hoy', title: 'Equipos de segunda mano', link: `<a class="link-arrow" href="colecciones/segunda-mano.html">Ver con filtros ${ic('arrow-right')}</a>` })}
  <div class="grid grid--rail4">${USED.slice(0, 8).map((item) => card(item, root)).join('')}</div>
</div></section>
<section class="sec" id="vende"><div class="wrap split">
  <div class="prose"><span class="tag">Vende tu equipo</span><h2 class="h-lg">¿Tienes una máquina que ya no usas?</h2><p class="lead">Cuéntanos marca, modelo, horas de uso y estado. Te respondemos con una propuesta por WhatsApp.</p>
    <ul class="promises"><li>${ic('whatsapp')}<div><strong>Escríbenos con fotos</strong><span>Con una foto y el modelo basta para empezar.</span></div></li><li>${ic('doc')}<div><strong>Propuesta clara</strong><span>Te decimos cuánto podemos pagar y por qué.</span></div></li></ul></div>
  ${contactForm('vende')}
</div></section>
${newsletter()}`;
  return { title: 'Segunda mano', description: 'Herramientas y maquinaria de segunda mano revisadas, con estado y horas de uso a la vista.', body, current: 'usados' };
}

/* ---------- Marcas ---------- */
function brandsPage() {
  const root = '';
  const body = `${phero({ root, crumbItems: [['Marcas']], title: 'Marcas que trabajamos', text: 'Herramientas y maquinaria de marcas reconocidas. Elige una para ver todos sus equipos.' })}
<section class="sec"><div class="wrap"><div class="brand-cards">${BRANDS.map((brand) => {
    const count = PRODUCTS.filter((item) => item.brand === brand && item.condition === 'nuevo').length;
    const logo = L.brandLogo(brand);
    return `<a class="brand-card${logo ? ' brand-card--logo' : ''}" href="colecciones/todos.html?marca=${encodeURIComponent(brand)}">${logo ? `<img src="${logo}" alt="${esc(brand)}" height="44" loading="lazy"><span class="vh">${esc(brand)}</span>` : `<strong>${esc(brand)}</strong>`}<small>${count} ${count === 1 ? 'modelo' : 'modelos'}</small></a>`;
  }).join('')}</div></div></section>`;
  return { title: 'Marcas', description: 'Marcas de herramientas y maquinaria disponibles en DCH.', body, current: 'marcas' };
}

/* ---------- Servicios ---------- */
function service({ slug, tag, title, text, visual, includes, how, benefits, questions, cta, form }) {
  const root = '';
  const body = `${phero({ root, crumbItems: [['Servicios'], [tag]], tag, title, text, actions: `<a class="btn btn--red" href="${waLink(cta)}" target="_blank" rel="noopener">${ic('whatsapp')}Cotizar por WhatsApp</a><a class="btn btn--ghost-light" href="#cotiza">Dejar mis datos</a>`, visual: photo(root, visual, `Maqueta de foto de ${tag.toLowerCase()}`, 'photo--cut'), split: true })}
${includes ? `<section class="sec"><div class="wrap">${secHead({ tag: '¿Qué incluye?', title: includes.title })}<div class="services">${includes.items
    .map(([name, desc], index) => `<article class="service${index === 0 ? ' service--main' : ''}"><h3 class="h-md">${name}</h3><p class="lead">${desc}</p></article>`)
    .join('')}</div></div></section>` : ''}
<section class="sec sec--dark"><div class="wrap">${secHead({ tag: '¿Cómo funciona?', title: how.title })}${steps(how.steps)}</div></section>
<section class="sec"><div class="wrap">${secHead({ tag: 'Beneficios', title: benefits.title })}<ul class="promises" style="grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 40px">${benefits.items
    .map(([icon, name, desc]) => `<li>${ic(icon)}<div><strong>${name}</strong><span>${desc}</span></div></li>`)
    .join('')}</ul></div></section>
<section class="sec sec--white"><div class="wrap">${secHead({ tag: 'Preguntas frecuentes', title: 'Lo que más nos preguntan' })}${faq(questions)}</div></section>
<section class="sec" id="cotiza"><div class="wrap split"><div class="prose"><span class="tag">Cotiza</span><h2 class="h-lg">${form.title}</h2><p class="lead">${form.text}</p></div>${contactForm(slug)}</div></section>`;
  return { title: tag, description: text, body, current: '' };
}

const maintenance = () =>
  service({
    slug: 'mant',
    tag: 'Mantenimiento',
    title: 'Que tus herramientas trabajen tanto como tú.',
    text: 'Mantenimiento preventivo y correctivo para alargar la vida útil de tus equipos y reducir tiempos muertos en obra.',
    visual: 'taller',
    includes: { title: 'Preventivo y correctivo', items: [['Preventivo', 'Limpieza profunda, revisión de componentes y calibración para mantener tus herramientas y maquinaria en óptimo estado.'], ['Correctivo', 'Reparación de fallas y cambio de repuestos para recuperar el correcto funcionamiento.']] },
    how: { title: 'Diagnóstico honesto', steps: [['Diagnóstico del equipo', 'Revisamos tu herramienta o maquinaria.'], ['Cotización antes de reparar', 'Te informamos el trabajo y el costo antes de tocar nada.'], ['Mantenimiento o reparación', 'Realizamos el trabajo necesario.'], ['Entrega con garantía', 'Te devolvemos el equipo con garantía de servicio.']] },
    benefits: { title: 'Por qué mantener tus equipos', items: [['shield', 'Mayor vida útil', 'Un equipo cuidado dura más.'], ['bolt', 'Mejor rendimiento', 'Trabaja con la potencia de siempre.'], ['clock', 'Menos tiempos sin trabajar', 'Evita paradas inesperadas en obra.'], ['wrench', 'Diagnóstico honesto', 'Te decimos qué necesita, antes de cualquier reparación.']] },
    questions: [
      ['¿Realizan mantenimiento preventivo y correctivo?', 'Sí, según el diagnóstico y las necesidades de cada herramienta o maquinaria.'],
      ['¿Qué tipo de herramientas y maquinaria reparan?', 'Atendemos diferentes tipos. Consúltanos por WhatsApp con la marca y el modelo para confirmar si realizamos el servicio.'],
      ['¿Cómo se determina el costo de la reparación?', 'Primero realizamos una revisión. Luego del diagnóstico te informamos el trabajo necesario y el costo antes de reparar.'],
      ['¿Cuánto demora el mantenimiento o la reparación?', 'Depende del tipo de mantenimiento, la falla y la disponibilidad de repuestos. Después de la revisión te indicamos el tiempo estimado.'],
    ],
    cta: '¡Hola DCH Tools! Necesito dar mantenimiento a mi herramienta. ¿Me indican el proceso, costos y tiempos?',
    form: { title: 'Cotiza tu mantenimiento', text: 'Cuéntanos qué equipo es, su marca y modelo, y qué le pasa.' },
  });

const rental = () =>
  service({
    slug: 'alq',
    tag: 'Alquiler',
    title: 'Alquila y trabaja sin invertir de más.',
    text: 'Equipos en óptimas condiciones para tus trabajos, sin una alta inversión inicial. Alquila solo lo que necesitas.',
    visual: 'despacho',
    how: { title: 'Alquilar es simple', steps: [['Consulta disponibilidad', 'Escríbenos por WhatsApp con el equipo que necesitas.'], ['Definimos condiciones', 'Acordamos el tiempo de alquiler y los requisitos.'], ['Coordinamos la entrega', 'Recojo en tienda o entrega de la herramienta o maquinaria.'], ['Devolución', 'Al finalizar el periodo, devuelves el equipo.']] },
    benefits: { title: 'Por qué alquilar', items: [['shield', 'Equipos en óptimas condiciones', 'Revisados antes de cada alquiler.'], ['clock', 'Flexibilidad de tiempo', 'Por los días que necesites.'], ['bolt', 'Sin alta inversión inicial', 'Paga solo por el uso.'], ['wrench', 'Soporte durante el alquiler', 'Te acompañamos si algo falla.']] },
    questions: [
      ['¿Piden depósito o garantía?', 'Sí, según la herramienta o maquinaria y las condiciones del alquiler se solicita una garantía. Te informamos los requisitos antes de confirmar.'],
      ['¿Cuál es el tiempo mínimo de alquiler?', 'Depende de lo que necesites alquilar. Consúltanos para conocer las condiciones.'],
      ['¿Qué pasa si el equipo falla?', 'Comunícate con nosotros de inmediato para darte soporte y evaluar la solución.'],
      ['¿El alquiler incluye envío?', 'El envío se coordina según la ubicación y las condiciones del alquiler. Al cotizar te indicamos disponibilidad y costo de entrega.'],
    ],
    cta: '¡Hola DCH Tools! Estoy buscando alquilar herramientas para mi trabajo. ¿Me comparten tarifas, tiempos y disponibilidad?',
    form: { title: 'Consulta disponibilidad', text: 'Indícanos el equipo y el tiempo que lo necesitas.' },
  });

/* ---------- Nosotros ---------- */
function about() {
  const root = '';
  const body = `${phero({ root, crumbItems: [['Nosotros']], tag: 'Nosotros', title: 'Construyendo confianza, trabajo a trabajo.', text: 'Nos especializamos en la venta de herramientas y maquinaria. Atendemos en Lima y enviamos a todo el Perú, con variedad, disponibilidad y atención personalizada.', visual: photo(root, 'equipo', 'Maqueta de foto del equipo DCH', 'photo--cut'), split: true })}
<section class="sec"><div class="wrap split"><div class="prose"><span class="tag">Nuestra historia</span><h2 class="h-lg">Una familia del rubro ferretero.</h2>
  <p>DCH nació del esfuerzo y las enseñanzas de nuestra familia en el rubro ferretero y de maquinaria. Desde 2019 ofrecemos herramientas y maquinaria para trabajadores, técnicos, contratistas, ferreterías y empresas del sector construcción.</p>
  <p>Trabajamos para ofrecer herramientas de calidad, precios competitivos y una atención rápida en Lima y todo el Perú. Hoy vendemos máquinas nuevas y de segunda mano.</p></div>
  ${photo(root, 'tienda', 'Maqueta de foto de la tienda', 'photo--cut')}</div></section>
<section class="sec sec--white"><div class="wrap">${secHead({ tag: 'Línea de tiempo', title: 'Nuestra historia en el tiempo' })}
  <ul class="timeline">
    <li><b>Inicios</b><div><strong>Experiencia de familia</strong><span>Nace de la experiencia de una familia vinculada desde hace años al rubro ferretero y a la comercialización de herramientas y maquinaria.</span></div></li>
    <li><b>Crecimiento</b><div><strong>Más variedad</strong><span>Ampliamos nuestra variedad de herramientas y maquinaria y fortalecimos nuestros servicios.</span></div></li>
    <li><b>Consolidación</b><div><strong>Mejor operación</strong><span>Incorporamos nuevas marcas, ampliamos el stock y mejoramos atención, logística y despacho.</span></div></li>
    <li><b>Hoy</b><div><strong>Tienda online</strong><span>Llevamos nuestro catálogo a la web, con compra directa y atención rápida por WhatsApp.</span></div></li>
  </ul></div></section>
<section class="sec"><div class="wrap">${secHead({ tag: 'Por qué elegirnos', title: 'Lo que puedes comprobar de nosotros' })}
  <ul class="promises" style="grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 40px">
    <li>${ic('store')}<div><strong>Desde 2019 en el rubro</strong><span>Atendemos a maestros de obra, técnicos, contratistas, ferreterías y empresas de construcción.</span></div></li>
    <li>${ic('box')}<div><strong>${NEW.length} modelos de ${BRANDS.length} marcas</strong><span>Stock inmediato en Lima para venta y alquiler, sin esperas.</span></div></li>
    <li>${ic('shield')}<div><strong>Garantía en productos seleccionados</strong><span>Equipos originales. Las condiciones de garantía te las informamos antes de pagar.</span></div></li>
    <li>${ic('whatsapp')}<div><strong>Cotización el mismo día</strong><span>Te asesoramos por WhatsApp y despachamos a todo el Perú.</span></div></li>
  </ul></div></section>
<section class="sec sec--white"><div class="wrap">${secHead({ tag: 'Reseñas', title: 'Lo que dicen nuestros clientes' })}${reviews()}</div></section>
${newsletter()}`;
  return { title: 'Nosotros', description: 'Conoce a DCH: una familia del rubro ferretero que vende herramientas y maquinaria en Lima y todo el Perú.', body, current: 'nosotros' };
}

/* ---------- Contacto ---------- */
function contact() {
  const root = '';
  const body = `${phero({ root, crumbItems: [['Contacto']], title: 'Encuentra la herramienta que necesitas.', text: 'Escríbenos por WhatsApp, correo o completa el formulario. Te ayudamos con información, asesoría o cotización.' })}
<section class="sec"><div class="wrap split">
  <div class="prose"><ul class="contact-list">
    <li>${ic('whatsapp')}<div><strong>WhatsApp y teléfono</strong><span><a href="https://wa.me/${SITE.wa}" target="_blank" rel="noopener">${SITE.phone}</a></span></div></li>
    <li>${ic('mail')}<div><strong>Correo</strong><span><a href="mailto:${SITE.email}">${SITE.email}</a></span></div></li>
    <li>${ic('pin')}<div><strong>Dirección</strong><span>${SITE.address}</span></div></li>
    <li>${ic('clock')}<div><strong>Horario</strong><span>${SITE.hours}<br>${SITE.sunday}</span></div></li></ul>
    <a class="btn btn--wa" href="https://wa.me/${SITE.wa}" target="_blank" rel="noopener" style="justify-self:start">${ic('whatsapp')}Contactar por WhatsApp</a>
    ${photo(root, 'tienda', 'Maqueta de foto de la tienda', 'photo--cut')}</div>
  ${contactForm('contacto')}
</div></section>`;
  return { title: 'Contacto', description: 'Escríbenos por WhatsApp, correo o formulario.', body, current: 'contacto' };
}

/* ---------- Cuenta ---------- */
/* En Shopify esta pantalla la aloja Shopify (cuentas de cliente nuevas, sin contraseña) y no se puede editar.
   Aquí se replica tal cual para mostrar cómo la verá el cliente. */
function account() {
  const body = `<div class="sa">
  <header class="sa__head"><a href="index.html">${SITE.name}</a></header>
  <section class="sa__card" aria-labelledby="sa-title">
    <h1 id="sa-title">Iniciar sesión</h1>
    <p class="sa__sub">Inicia sesión o crea una cuenta</p>
    <button type="button" class="sa__shop" data-demo-form-trigger>Continuar con shop</button>
    <div class="sa__or"><span>o</span></div>
    <form class="sa__form" data-demo-form="Demostración: en Shopify, el código de acceso llega al correo.">
      <div class="sa__field">
        <label class="vh" for="sa-email">Correo electrónico</label>
        <input id="sa-email" type="email" name="email" placeholder="Correo electrónico" autocomplete="email" required>
        <button type="submit" aria-label="Continuar">${ic('arrow-right')}</button>
      </div>
      <label class="sa__check"><input type="checkbox" name="novedades"><span>Enviarme novedades y ofertas por correo electrónico</span></label>
    </form>
  </section>
  <footer class="sa__foot"><a href="ayuda.html">Política de privacidad</a></footer>
</div>`;
  return { title: 'Iniciar sesión', description: 'Inicia sesión o crea tu cuenta.', body, bare: true, current: '' };
}

/* ---------- Ayuda ---------- */
function help() {
  const root = '';
  const body = `${phero({ root, crumbItems: [['Preguntas frecuentes']], title: 'Preguntas frecuentes', text: 'Respuestas rápidas sobre compras, envíos, garantía, alquiler y mantenimiento.' })}
<section class="sec"><div class="wrap">
  <h2 class="h-md" id="compras" style="margin-bottom:16px">Compras y pagos</h2>${faq([
    ['¿Las herramientas y maquinaria tienen garantía?', 'Sí, contamos con garantía en productos seleccionados. Las condiciones se informan al momento de la compra.'],
    ['¿Qué formas de pago aceptan?', 'Tarjeta, Yape, Plin y transferencia bancaria. También coordinamos el pago junto con tu cotización por WhatsApp.'],
    ['¿Emiten boleta o factura?', 'Sí, emitimos boleta o factura según corresponda.'],
  ])}
  <h2 class="h-md" id="envios" style="margin:40px 0 16px">Envíos</h2>${faq([
    ['¿Hacen envíos fuera de Lima?', 'Sí, despachamos a nivel nacional.'],
    ['¿Puedo recoger en tienda?', `Sí. Estamos en ${SITE.address}. Horario: ${SITE.hours}. ${SITE.sunday}.`],
  ])}
  <h2 class="h-md" id="usados" style="margin:40px 0 16px">Segunda mano</h2>${faq([
    ['¿Cómo sé en qué estado está un equipo usado?', 'Cada equipo muestra su estado (A o B) y sus horas de uso. Si quieres, te enviamos fotos de esa unidad por WhatsApp.'],
    ['¿Compran equipos usados?', 'Sí. Escríbenos con marca, modelo, horas de uso y fotos, y te hacemos una propuesta.'],
  ])}
  <h2 class="h-md" id="reclamaciones" style="margin:40px 0 16px">Libro de reclamaciones</h2>
  <div class="callout"><p>Aquí va el Libro de Reclamaciones virtual, que la normativa peruana exige a las tiendas con venta online. Se conecta antes de publicar la tienda.</p></div>
</div></section>`;
  return { title: 'Preguntas frecuentes', description: 'Compras, pagos, envíos, garantía, alquiler y mantenimiento.', body, current: '' };
}

/* ---------- Carrito ---------- */
function cartPage() {
  const root = '';
  const suggested = NEW.filter((item) => item.best).slice(0, 4);
  const body = `${phero({ root, crumbItems: [['Carrito']], title: 'Tu carrito' })}
<div class="wrap cart">
  <div><div class="cart__list" data-cart-lines></div>
    <div style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn--ghost" href="colecciones/todos.html">${ic('arrow-left')}Seguir comprando</a></div></div>
  <aside class="summary" data-cart-summary hidden><h2>Resumen del pedido</h2>
    <div class="totals"><div><span>Subtotal</span><b class="num" data-cart-total>S/ 0</b></div><div><span>Envío</span><span>Se calcula al pagar</span></div><div class="is-total"><span>Total</span><span class="num" data-cart-total>S/ 0</span></div></div>
    <p class="mono" style="color:#b9c4e6">IGV incluido. Boleta o factura.</p>
    <a class="btn btn--red btn--block" href="checkout.html">Finalizar compra ${ic('arrow-right')}</a>
    <a class="btn btn--ghost-light btn--block" data-wa-cart href="#" target="_blank" rel="noopener">${ic('whatsapp')}Cotizar este pedido</a>
    <p style="display:flex;gap:8px;align-items:center;color:#b9c4e6;font-size:.8125rem">${ic('lock')}Pago seguro. Elige tu medio de pago en el siguiente paso.</p></aside>
</div>
<section class="sec sec--white"><div class="wrap">${secHead({ tag: 'Complementa tu pedido', title: 'Otros equipos que llevan nuestros clientes' })}<div class="grid grid--rail4">${suggested.map((item) => card(item, root)).join('')}</div></div></section>`;
  return { title: 'Carrito', description: 'Revisa tu pedido.', body, current: '' };
}

/* ---------- Checkout (estilo Shopify) ---------- */
function checkout() {
  const root = '';
  const regions = ['Lima', 'Callao', 'Arequipa', 'Cusco', 'La Libertad', 'Piura', 'Junín', 'Lambayeque', 'Ica', 'Otro departamento'];
  const body = `<div class="co">
  <div class="co__main"><form class="co__col" data-checkout novalidate>
    <a class="co__logo" href="index.html" aria-label="Volver al inicio"><img src="img/logo.png" alt="${SITE.short}"></a>
    <nav class="co__crumbs" aria-label="Pasos"><a href="carrito.html">Carrito</a> › <b>Información y pago</b> › <span>Confirmación</span></nav>

    <section class="co-sec"><h2>Contacto</h2>
      <div class="fld"><input id="co-email" name="email" type="email" required placeholder=" " autocomplete="email"><label for="co-email">Correo electrónico</label></div>
      <div class="fld"><input id="co-tel" name="celular" type="tel" required placeholder=" " autocomplete="tel"><label for="co-tel">Celular (para coordinar la entrega)</label></div></section>

    <section class="co-sec"><h2>Entrega</h2>
      <div class="opts"><label class="opt"><input type="radio" name="entrega" value="envio" checked><span>Envío a domicilio<small>Lima en 24 h · provincias en 48–72 h</small></span><b>Desde S/ 18</b></label>
        <label class="opt"><input type="radio" name="entrega" value="recojo"><span>Recojo en tienda<small>${SITE.address}</small></span><b>Gratis</b></label></div>
      <div class="fld-row"><div class="fld"><input id="co-nombre" name="nombre" required placeholder=" " autocomplete="given-name"><label for="co-nombre">Nombres</label></div><div class="fld"><input id="co-apellido" name="apellido" required placeholder=" " autocomplete="family-name"><label for="co-apellido">Apellidos</label></div></div>
      <div data-ship-fields class="co-sec">
        <div class="fld"><input id="co-dir" name="direccion" required placeholder=" " autocomplete="street-address"><label for="co-dir">Dirección y número</label></div>
        <div class="fld-row fld-row--3"><div class="fld"><select id="co-region" name="departamento" required>${regions.map((region) => `<option>${region}</option>`).join('')}</select><label for="co-region">Departamento</label></div>
          <div class="fld"><input id="co-prov" name="provincia" required placeholder=" "><label for="co-prov">Provincia</label></div><div class="fld"><input id="co-dist" name="distrito" required placeholder=" "><label for="co-dist">Distrito</label></div></div>
        <div class="fld"><input id="co-ref" name="referencia" placeholder=" "><label for="co-ref">Referencia (opcional)</label></div></div></section>

    <section class="co-sec"><h2>Comprobante</h2>
      <div class="opts"><label class="opt"><input type="radio" name="comprobante" value="boleta" checked><span>Boleta</span><span></span></label><label class="opt"><input type="radio" name="comprobante" value="factura"><span>Factura</span><span></span></label></div>
      <div class="fld"><input id="co-dni" name="documento" required inputmode="numeric" placeholder=" "><label for="co-dni">DNI o carné de extranjería</label></div>
      <div data-ruc-fields class="co-sec" hidden><div class="fld"><input id="co-ruc" name="ruc" inputmode="numeric" placeholder=" " required disabled><label for="co-ruc">RUC</label></div><div class="fld"><input id="co-razon" name="razon" placeholder=" " required disabled><label for="co-razon">Razón social</label></div></div></section>

    <section class="co-sec"><h2>Pago</h2><p style="color:#707070;margin-top:-6px">Todas las transacciones son seguras y están cifradas.</p>
      <div class="opts">
        <label class="opt"><input type="radio" name="pago" value="tarjeta" checked><span>Tarjeta de crédito o débito</span><span class="pm-chips"><span>VISA</span><span>MC</span><span>AMEX</span></span></label>
        <div class="opt__more" data-pay-more="tarjeta"><div class="co-sec">
          <div class="fld"><input id="cc-num" data-needs-card inputmode="numeric" placeholder=" " autocomplete="cc-number" required><label for="cc-num">Número de tarjeta</label></div>
          <div class="fld-row"><div class="fld"><input id="cc-exp" data-needs-card placeholder=" " autocomplete="cc-exp" required><label for="cc-exp">Vencimiento (MM / AA)</label></div><div class="fld"><input id="cc-cvv" data-needs-card inputmode="numeric" placeholder=" " autocomplete="cc-csc" required><label for="cc-cvv">Código de seguridad</label></div></div>
          <p class="note">Aquí se incrusta la pasarela de pago (Niubiz, Izipay, Culqi o Mercado Pago). Estos campos son de ejemplo.</p></div></div>
        <label class="opt"><input type="radio" name="pago" value="yape"><span>Yape</span><span class="pm-chips"><span>QR</span></span></label>
        <div class="opt__more" data-pay-more="yape" hidden><p class="note">Al confirmar te mostramos el QR de Yape y el número para pagar. Tu pedido se aprueba al verificar el pago.</p></div>
        <label class="opt"><input type="radio" name="pago" value="plin"><span>Plin</span><span class="pm-chips"><span>QR</span></span></label>
        <div class="opt__more" data-pay-more="plin" hidden><p class="note">Al confirmar te mostramos el QR de Plin. Tu pedido se aprueba al verificar el pago.</p></div>
        <label class="opt"><input type="radio" name="pago" value="transferencia"><span>Transferencia bancaria</span><span></span></label>
        <div class="opt__more" data-pay-more="transferencia" hidden><p class="note">Te enviamos los datos de la cuenta por correo y WhatsApp. Envías el comprobante y despachamos.</p></div>
      </div></section>

    <button class="co__btn" type="submit" data-co-pay>Pagar ahora</button>
    <a class="co__back" href="carrito.html">‹ Volver al carrito</a>
  </form></div>
  <aside class="co__side"><div class="co__side-in"><ul class="co-sec" data-co-lines></ul>
    <div class="co-code"><div class="fld"><input id="co-code" placeholder=" "><label for="co-code">Código de descuento</label></div><button type="button">Aplicar</button></div>
    <div class="totals"><div><span>Subtotal</span><span class="num" data-co-sub>S/ 0</span></div><div><span>Envío</span><span data-co-ship>Por calcular</span></div><div class="is-total"><span>Total</span><span class="num" data-co-total>S/ 0</span></div><div style="font-size:.8125rem"><span>Incluye IGV de</span><span class="num" data-co-igv>S/ 0</span></div></div></div></aside>
</div>`;
  return { title: 'Finalizar compra', description: 'Completa tu pedido.', body, bare: true, current: '' };
}

/* ---------- Gracias ---------- */
function thanks() {
  const root = '';
  const body = `${phero({ root, crumbItems: [['Pedido confirmado']], tag: 'Pedido recibido', title: 'Gracias por tu compra.', text: 'Te enviamos el detalle por correo. Si pagaste por Yape, Plin o transferencia, aprobamos el pedido al verificar el pago.' })}
<section class="sec"><div class="wrap split" data-thanks>
  <div class="prose"><h2 class="h-md">Pedido <span class="mono" data-order-number>DCH-00000</span></h2>
    <ul class="contact-list"><li>${ic('user')}<div><strong>Cliente</strong><span data-order-name>cliente</span></div></li><li>${ic('card')}<div><strong>Medio de pago</strong><span data-order-pay>Tarjeta</span></div></li><li>${ic('doc')}<div><strong>Total</strong><span class="num" data-order-total>S/ 0</span></div></li></ul>
    <div class="hero__cta"><a class="btn btn--navy" href="colecciones/todos.html">Seguir comprando</a><a class="btn btn--wa" href="${waLink('¡Hola DCH Tools! Quiero consultar por mi pedido.')}" target="_blank" rel="noopener">${ic('whatsapp')}Consultar mi pedido</a></div></div>
  <div class="panel"><h3>${ic('box')}Tu pedido</h3><ul class="co-sec" data-order-lines></ul></div>
</div></section>`;
  return { title: 'Pedido confirmado', description: 'Gracias por tu compra.', body, current: '' };
}

module.exports = { home, collectionsAll, product, usedLanding, brandsPage, maintenance, rental, about, contact, account, help, cartPage, checkout, thanks };
