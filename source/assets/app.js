/**
 * DCH · Tienda — comportamiento del sitio.
 * Sin dependencias. Datos de catálogo en window.DCH_CATALOG (generado por build.js).
 *
 * Guía para llevarlo a Shopify:
 *  - Carrito:      reemplazar por /cart/add.js, /cart/change.js y /cart.js
 *  - Búsqueda:     reemplazar por /search/suggest.json
 *  - Favoritos:    localStorage ya funciona; pasar a metaobjetos si se quiere cuenta
 *  - Checkout:     lo reemplaza el checkout nativo de Shopify
 */
(() => {
  'use strict';

  const CATALOG = window.DCH_CATALOG || { products: [], categories: {}, wa: '', root: '' };
  const ROOT = document.documentElement.dataset.root || '';
  const byId = new Map(CATALOG.products.map((p) => [p.id, p]));

  /* ---------- Utilidades ---------- */
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const store = {
    read(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch {
        return fallback;
      }
    },
    write(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        /* sin almacenamiento: el cambio vive solo en esta página */
      }
    },
  };

  const money = (value) =>
    `S/ ${Number(value).toLocaleString('en-US', { minimumFractionDigits: value % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;

  const url = (path) => `${ROOT}${path}`;
  const waLink = (text) => `https://wa.me/${CATALOG.wa}?text=${encodeURIComponent(text)}`;

  let toastTimer = 0;
  function toast(message) {
    let node = $('.toast');
    if (!node) {
      node = document.createElement('div');
      node.className = 'toast';
      node.setAttribute('role', 'status');
      document.body.append(node);
    }
    node.textContent = message;
    node.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove('is-on'), 2600);
  }

  const icon = (name) => `<svg class="i" aria-hidden="true"><use href="#i-${name}"/></svg>`;

  /* ---------- Carrito ---------- */
  const cart = {
    items() {
      return store.read('dch:cart', []).filter((line) => byId.has(line.id));
    },
    save(items) {
      store.write('dch:cart', items);
      document.dispatchEvent(new CustomEvent('dch:cart'));
    },
    add(id, qty = 1) {
      const items = this.items();
      const line = items.find((item) => item.id === id);
      if (line) line.qty = Math.min(99, line.qty + qty);
      else items.push({ id, qty });
      this.save(items);
    },
    set(id, qty) {
      const items = this.items();
      const line = items.find((item) => item.id === id);
      if (!line) return;
      line.qty = Math.max(1, Math.min(99, qty));
      this.save(items);
    },
    remove(id) {
      this.save(this.items().filter((item) => item.id !== id));
    },
    clear() {
      this.save([]);
    },
    count() {
      return this.items().reduce((sum, line) => sum + line.qty, 0);
    },
    subtotal() {
      return this.items().reduce((sum, line) => sum + byId.get(line.id).price * line.qty, 0);
    },
  };

  function lineHtml(line, withControls = true) {
    const product = byId.get(line.id);
    const condition = product.condition === 'usado' ? `Segunda mano · Estado ${product.grade}` : product.brand;
    return `<li class="line" data-line="${product.id}">
      <a href="${url(product.href)}"><img src="${url(product.img)}" alt="" width="76" height="76" loading="lazy"></a>
      <div>
        <a class="line__title" href="${url(product.href)}">${product.title}</a>
        <p class="line__meta">${condition}</p>
        ${
          withControls
            ? `<div class="line__ctrl">
          <div class="qty" role="group" aria-label="Cantidad de ${product.title}">
            <button type="button" data-line-step="-1" aria-label="Quitar uno">−</button>
            <input type="number" min="1" max="99" value="${line.qty}" aria-label="Cantidad" data-line-qty>
            <button type="button" data-line-step="1" aria-label="Agregar uno">+</button>
          </div>
          <button type="button" class="link-rm" data-line-remove>Quitar</button>
        </div>`
            : ''
        }
      </div>
      <b class="line__price num">${money(product.price * line.qty)}</b>
    </li>`;
  }

  function renderCart() {
    const items = cart.items();
    const count = cart.count();

    $$('[data-cart-count]').forEach((node) => {
      node.textContent = String(count);
      node.hidden = count === 0;
    });
    $$('[data-cart-total]').forEach((node) => {
      node.textContent = money(cart.subtotal());
    });

    const emptyHtml = `<div class="empty">${icon('cart')}<p><strong>Tu carrito está vacío</strong></p><p>Agrega herramientas y las verás aquí.</p><a class="btn btn--navy" href="${url('colecciones/todos.html')}">Ver la tienda</a></div>`;

    const drawerList = $('[data-drawer-lines]');
    if (drawerList) {
      drawerList.innerHTML = items.length ? `<ul>${items.map((line) => lineHtml(line)).join('')}</ul>` : emptyHtml;
      $('[data-drawer-foot]').hidden = items.length === 0;
    }

    const pageList = $('[data-cart-lines]');
    if (pageList) {
      pageList.innerHTML = items.length ? `<ul>${items.map((line) => lineHtml(line)).join('')}</ul>` : emptyHtml;
      $$('[data-cart-summary]').forEach((node) => {
        node.hidden = items.length === 0;
      });
    }

    $$('[data-wa-cart]').forEach((link) => {
      const lines = items.map((line) => `- ${line.qty} x ${byId.get(line.id).title}`).join('\n');
      link.href = waLink(`¡Hola DCH Tools! Quiero cotizar este pedido:\n${lines}\nTotal referencial: ${money(cart.subtotal())}`);
    });

    renderCheckoutSummary();
  }

  document.addEventListener('click', (event) => {
    const lineNode = event.target.closest('[data-line]');
    if (!lineNode) return;
    const id = lineNode.dataset.line;
    const line = cart.items().find((item) => item.id === id);
    if (!line) return;

    const step = event.target.closest('[data-line-step]');
    if (step) {
      const next = line.qty + Number(step.dataset.lineStep);
      if (next < 1) cart.remove(id);
      else cart.set(id, next);
    }
    if (event.target.closest('[data-line-remove]')) cart.remove(id);
  });

  document.addEventListener('change', (event) => {
    const input = event.target.closest('[data-line-qty]');
    if (!input) return;
    const id = input.closest('[data-line]').dataset.line;
    cart.set(id, Number(input.value) || 1);
  });

  document.addEventListener('dch:cart', renderCart);

  /* Botones de compra */
  document.addEventListener('click', (event) => {
    const addButton = event.target.closest('[data-add]');
    if (addButton) {
      const id = addButton.dataset.add;
      const qtyInput = $('[data-qty-input]');
      const qty = addButton.hasAttribute('data-use-qty') && qtyInput ? Math.max(1, Number(qtyInput.value) || 1) : 1;
      cart.add(id, qty);
      const product = byId.get(id);
      if (addButton.hasAttribute('data-buy-now')) {
        window.location.href = url('checkout.html');
        return;
      }
      openDrawer('cart');
      toast(`Agregado: ${product.title}`);
    }
  });

  /* ---------- Cajón y menú móvil ---------- */
  const overlay = $('[data-overlay]');
  let lastFocus = null;

  function setPanel(panel, open) {
    if (!panel) return;
    panel.classList.toggle('is-on', open);
    overlay?.classList.toggle('is-on', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      lastFocus = document.activeElement;
      $('button, a, input', panel)?.focus({ preventScroll: true });
    } else if (lastFocus) {
      lastFocus.focus({ preventScroll: true });
    }
  }

  function openDrawer(kind) {
    closePanels();
    setPanel($(`[data-panel="${kind}"]`), true);
  }

  function closePanels() {
    $$('[data-panel].is-on').forEach((panel) => panel.classList.remove('is-on'));
    overlay?.classList.remove('is-on');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', (event) => {
    const opener = event.target.closest('[data-open]');
    if (opener) {
      event.preventDefault();
      openDrawer(opener.dataset.open);
    }
    if (event.target.closest('[data-close]') || event.target === overlay) closePanels();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closePanels();
      closeMenus();
      hideSuggest();
    }
  });

  /* ---------- Menús desplegables y megamenú ---------- */
  function closeMenus(except) {
    $$('[data-toggle-target]').forEach((button) => {
      if (button === except) return;
      button.setAttribute('aria-expanded', 'false');
      const target = document.getElementById(button.dataset.toggleTarget);
      if (target) target.hidden = true;
    });
  }

  function toggleMenu(button, force) {
    const target = document.getElementById(button.dataset.toggleTarget);
    if (!target) return;
    const open = force ?? target.hidden;
    closeMenus(open ? button : undefined);
    target.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
  }

  $$('[data-toggle-target]').forEach((button) => {
    const target = document.getElementById(button.dataset.toggleTarget);
    const hoverable = window.matchMedia('(hover: hover)');

    // Con ratón el hover ya abre el menú: el clic lo mantiene abierto. En táctil, alterna.
    button.addEventListener('click', () => toggleMenu(button, hoverable.matches ? true : undefined));

    // El botón y su panel forman una sola zona: al pasar de uno al otro el menú no se cierra.
    const zones = [button.closest('li') || button.parentElement, target].filter(Boolean);
    let timer = 0;
    zones.forEach((zone) => {
      zone.addEventListener('mouseenter', () => {
        clearTimeout(timer);
        if (hoverable.matches) toggleMenu(button, true);
      });
      zone.addEventListener('mouseleave', () => {
        if (!hoverable.matches) return;
        clearTimeout(timer);
        timer = setTimeout(() => toggleMenu(button, false), 250);
      });
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.navbar, [data-toggle-target]')) closeMenus();
  });

  /* ---------- Búsqueda ---------- */
  const searchInput = $('[data-search-input]');
  const suggestBox = $('[data-suggest]');

  function hideSuggest() {
    if (suggestBox) suggestBox.hidden = true;
  }

  function normalize(text) {
    return text
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase();
  }

  function search(query) {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return CATALOG.products.filter((product) => {
      const haystack = normalize(`${product.title} ${product.brand} ${product.catName} ${product.condition}`);
      return terms.every((term) => haystack.includes(term));
    });
  }

  if (searchInput && suggestBox) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim();
      if (query.length < 2) return hideSuggest();
      const results = search(query);
      const top = results.slice(0, 5);
      suggestBox.innerHTML = top.length
        ? `${top
            .map(
              (product) => `<a class="suggest__item" href="${url(product.href)}">
          <img src="${url(product.img)}" alt="" width="48" height="48" loading="lazy">
          <div><strong>${product.title}</strong><span>${product.brand} · ${product.condition === 'usado' ? 'Segunda mano' : product.catName}</span></div>
          <b class="num">${money(product.price)}</b></a>`
            )
            .join('')}
        <a class="suggest__all" href="${url('colecciones/todos.html')}?q=${encodeURIComponent(query)}">Ver los ${results.length} resultados</a>`
        : `<p class="suggest__empty">No encontramos "${query.replace(/[<>&]/g, '')}". Prueba con otra palabra o <a href="${waLink(`Hola DCH Tools, busco: ${query}`)}" target="_blank" rel="noopener"><u>pregúntanos por WhatsApp</u></a>.</p>`;
      suggestBox.hidden = false;
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('.search')) hideSuggest();
    });
  }

  /* ---------- Favoritos ---------- */
  const favs = {
    get: () => store.read('dch:fav', []),
    has(id) {
      return this.get().includes(id);
    },
    toggle(id) {
      const list = this.get();
      const index = list.indexOf(id);
      if (index === -1) list.push(id);
      else list.splice(index, 1);
      store.write('dch:fav', list);
      document.dispatchEvent(new CustomEvent('dch:fav'));
      return index === -1;
    },
  };

  function renderFavs() {
    const count = favs.get().length;
    $$('[data-fav-count]').forEach((node) => {
      node.textContent = String(count);
      node.hidden = count === 0;
    });
    $$('[data-fav]').forEach((button) => {
      const on = favs.has(button.dataset.fav);
      button.setAttribute('aria-pressed', String(on));
      button.setAttribute('aria-label', on ? 'Quitar de favoritos' : 'Guardar en favoritos');
    });
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-fav]');
    if (!button) return;
    event.preventDefault();
    const added = favs.toggle(button.dataset.fav);
    toast(added ? 'Guardado en favoritos' : 'Quitado de favoritos');
  });
  document.addEventListener('dch:fav', () => {
    renderFavs();
    if ($('[data-collection]')) applyFilters();
    renderFavPage();
  });

  /* ---------- Cantidad (ficha de producto) ---------- */
  document.addEventListener('click', (event) => {
    const step = event.target.closest('[data-step]');
    if (!step) return;
    const input = $('[data-qty-input]', step.closest('.qty'));
    if (!input) return;
    input.value = String(Math.max(1, Math.min(99, (Number(input.value) || 1) + Number(step.dataset.step))));
  });

  /* ---------- Carruseles y pestañas del home ---------- */
  $$('[data-rail]').forEach((rail) => {
    const scroller = $('.rail', rail) || $('.pgrid', rail);
    $$('[data-rail-dir]', rail).forEach((button) => {
      button.addEventListener('click', () => {
        scroller.scrollBy({ left: Number(button.dataset.railDir) * scroller.clientWidth * 0.85, behavior: 'smooth' });
      });
    });

    const tabs = $$('[role="tab"]', rail);
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((other) => other.setAttribute('aria-selected', String(other === tab)));
        $$('.card', scroller).forEach((card) => {
          card.hidden = card.dataset.group !== tab.dataset.group;
        });
        scroller.scrollTo({ left: 0 });
      });
    });
    tabs[0]?.click();
  });

  /* ---------- Colección: filtros, orden y consulta ---------- */
  const collection = $('[data-collection]');
  const state = { q: '', fav: false, cond: new Set(), cat: new Set(), brand: new Set(), stock: false, min: null, max: null, sort: 'default' };

  function readParams() {
    const params = new URLSearchParams(window.location.search);
    state.q = params.get('q') || '';
    state.fav = params.get('fav') === '1';
    if (params.get('cond')) state.cond.add(params.get('cond'));
    if (params.get('marca')) state.brand.add(params.get('marca'));
  }

  function applyFilters() {
    if (!collection) return;
    const cards = $$('.card', collection);
    const favorites = favs.get();
    const terms = normalize(state.q).split(/\s+/).filter(Boolean);
    let visible = 0;

    cards.forEach((card) => {
      const price = Number(card.dataset.price);
      const text = normalize(card.dataset.text);
      const pass =
        (!terms.length || terms.every((term) => text.includes(term))) &&
        (!state.fav || favorites.includes(card.dataset.id)) &&
        (!state.cond.size || state.cond.has(card.dataset.cond)) &&
        (!state.cat.size || state.cat.has(card.dataset.cat)) &&
        (!state.brand.size || state.brand.has(card.dataset.brand)) &&
        (!state.stock || card.dataset.stock === 'lima') &&
        (state.min === null || price >= state.min) &&
        (state.max === null || price <= state.max);
      card.hidden = !pass;
      if (pass) visible += 1;
    });

    const order = {
      default: (a, b) => Number(a.dataset.index) - Number(b.dataset.index),
      'price-asc': (a, b) => Number(a.dataset.price) - Number(b.dataset.price),
      'price-desc': (a, b) => Number(b.dataset.price) - Number(a.dataset.price),
      'name-asc': (a, b) => a.dataset.title.localeCompare(b.dataset.title, 'es'),
    }[state.sort];
    const grid = $('[data-grid]', collection);
    cards.sort(order).forEach((card) => grid.append(card));

    $$('[data-count]', collection).forEach((node) => {
      node.textContent = String(visible);
    });
    const none = $('[data-noresult]', collection);
    if (none) none.hidden = visible > 0;

    const chips = $('[data-chips]', collection);
    if (chips) {
      const parts = [];
      if (state.q) parts.push(['q', `Búsqueda: ${state.q}`]);
      if (state.fav) parts.push(['fav', 'Solo favoritos']);
      state.cond.forEach((value) => parts.push([`cond:${value}`, value === 'usado' ? 'Segunda mano' : 'Nuevo']));
      state.brand.forEach((value) => parts.push([`brand:${value}`, `Marca: ${value}`]));
      state.cat.forEach((value) => parts.push([`cat:${value}`, `Categoría: ${CATALOG.categories[value]?.name || value}`]));
      if (state.stock) parts.push(['stock', 'En stock Lima']);
      chips.innerHTML = parts.map(([key, label]) => `<button type="button" class="chip" data-chip="${key}">${label}${icon('close')}</button>`).join('');
    }
  }

  /** Marca los checkboxes según el estado actual de los filtros. */
  function syncInputs() {
    $$('[data-filter]', collection).forEach((input) => {
      const { filter, value } = input.dataset;
      input.checked = filter === 'stock' ? state.stock : state[filter].has(value);
    });
  }

  if (collection) {
    readParams();
    const searchField = $('[data-q]', collection);
    if (searchField) searchField.value = state.q;

    $$('[data-filter]', collection).forEach((input) => {
      const { filter, value } = input.dataset;
      if (filter !== 'stock' && state[filter] instanceof Set && state[filter].has(value)) input.checked = true;
      input.addEventListener('change', () => {
        if (filter === 'stock') state.stock = input.checked;
        else if (input.checked) state[filter].add(value);
        else state[filter].delete(value);
        applyFilters();
      });
    });

    ['min', 'max'].forEach((key) => {
      const input = $(`[data-price-${key}]`, collection);
      input?.addEventListener('input', () => {
        state[key] = input.value === '' ? null : Number(input.value);
        applyFilters();
      });
    });

    $('[data-sort]', collection)?.addEventListener('change', (event) => {
      state.sort = event.target.value;
      applyFilters();
    });

    collection.addEventListener('click', (event) => {
      const chip = event.target.closest('[data-chip]');
      if (chip) {
        const [type, value] = chip.dataset.chip.split(':');
        if (type === 'q') state.q = '';
        if (type === 'fav') state.fav = false;
        if (type === 'stock') state.stock = false;
        if (['cond', 'brand', 'cat'].includes(type)) state[type].delete(value);
        syncInputs();
        applyFilters();
      }
      if (event.target.closest('[data-clear]')) {
        Object.assign(state, { q: '', fav: false, stock: false, min: null, max: null });
        state.cond.clear();
        state.cat.clear();
        state.brand.clear();
        syncInputs();
        $$('[data-price-min], [data-price-max], [data-q]', collection).forEach((input) => {
          input.value = '';
        });
        applyFilters();
      }
      if (event.target.closest('[data-filters-toggle]')) {
        const panel = $('[data-filters]', collection);
        panel.classList.toggle('is-on');
        overlay?.classList.toggle('is-on', panel.classList.contains('is-on'));
      }
    });

    applyFilters();
  }

  /* ---------- Ficha: entrega y barra pegajosa ---------- */
  const deliverySelect = $('[data-delivery]');
  deliverySelect?.addEventListener('change', () => {
    const lima = deliverySelect.value === 'lima';
    const out = $('[data-delivery-out]');
    if (out) {
      out.textContent = lima
        ? 'Lima: llega en 24 horas hábiles, o recógelo en tienda hoy mismo.'
        : 'Provincias: despachamos a todo el Perú; llega en 48 a 72 horas.';
    }
  });

  /* ---------- Checkout ---------- */
  function shippingCost() {
    const mode = $('input[name="entrega"]:checked');
    if (!mode || mode.value === 'recojo') return 0;
    const region = $('#co-region');
    return region && region.value === 'Lima' ? 18 : 35;
  }

  function renderCheckoutSummary() {
    const list = $('[data-co-lines]');
    if (!list) return;
    const items = cart.items();
    list.innerHTML = items
      .map((line) => {
        const product = byId.get(line.id);
        return `<li class="co-line"><div class="co-line__img"><img src="${url(product.img)}" alt=""><b>${line.qty}</b></div><div><strong>${product.title}</strong><small>${product.condition === 'usado' ? 'Segunda mano' : product.brand}</small></div><span class="num">${money(product.price * line.qty)}</span></li>`;
      })
      .join('');
    const sub = cart.subtotal();
    const ship = shippingCost();
    $('[data-co-sub]').textContent = money(sub);
    $('[data-co-ship]').textContent = ship === 0 ? ($('input[name="entrega"]:checked')?.value === 'recojo' ? 'Gratis' : 'Por calcular') : money(ship);
    $('[data-co-total]').textContent = money(sub + ship);
    $('[data-co-igv]').textContent = money(Math.round(((sub + ship) / 1.18) * 0.18 * 100) / 100);
    const pay = $('[data-co-pay]');
    if (pay) pay.textContent = `Pagar ahora · ${money(sub + ship)}`;
  }

  const checkoutForm = $('[data-checkout]');
  if (checkoutForm) {
    const toggleBlocks = () => {
      const delivery = $('input[name="entrega"]:checked')?.value;
      $('[data-ship-fields]').hidden = delivery === 'recojo';
      $$('[data-ship-fields] [required]').forEach((field) => {
        field.disabled = delivery === 'recojo';
      });
      const proof = $('input[name="comprobante"]:checked')?.value;
      $('[data-ruc-fields]').hidden = proof !== 'factura';
      $$('[data-ruc-fields] [required]').forEach((field) => {
        field.disabled = proof !== 'factura';
      });
      const method = $('input[name="pago"]:checked')?.value;
      $$('[data-pay-more]').forEach((block) => {
        block.hidden = block.dataset.payMore !== method;
        $$('[data-needs-card]', block).forEach((field) => {
          field.disabled = method !== 'tarjeta';
        });
      });
      renderCheckoutSummary();
    };

    checkoutForm.addEventListener('change', toggleBlocks);
    toggleBlocks();

    checkoutForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!cart.items().length) {
        toast('Tu carrito está vacío');
        return;
      }
      const data = new FormData(checkoutForm);
      const order = {
        number: `DCH-${Math.floor(10000 + Math.random() * 89999)}`,
        name: data.get('nombre'),
        email: data.get('email'),
        entrega: data.get('entrega'),
        pago: data.get('pago'),
        total: cart.subtotal() + shippingCost(),
        items: cart.items().map((line) => ({ ...line, ...byId.get(line.id) })),
      };
      try {
        sessionStorage.setItem('dch:order', JSON.stringify(order));
      } catch {
        /* se muestra la confirmación sin detalle */
      }
      cart.clear();
      window.location.href = 'gracias.html';
    });
  }

  const thanks = $('[data-thanks]');
  if (thanks) {
    let order = null;
    try {
      order = JSON.parse(sessionStorage.getItem('dch:order') || 'null');
    } catch {
      order = null;
    }
    if (order) {
      $('[data-order-number]').textContent = order.number;
      $('[data-order-name]').textContent = order.name || 'cliente';
      $('[data-order-total]').textContent = money(order.total);
      $('[data-order-pay]').textContent = { tarjeta: 'Tarjeta', yape: 'Yape', plin: 'Plin', transferencia: 'Transferencia bancaria', contraentrega: 'Pago contra entrega' }[order.pago] || order.pago;
      $('[data-order-lines]').innerHTML = order.items
        .map((line) => `<li class="co-line"><div class="co-line__img"><img src="${url(line.img)}" alt=""><b>${line.qty}</b></div><div><strong>${line.title}</strong></div><span class="num">${money(line.price * line.qty)}</span></li>`)
        .join('');
    }
  }

  /* ---------- Formularios de demostración ---------- */
  $$('[data-demo-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      toast(form.dataset.demoForm || 'Recibimos tu mensaje. Te respondemos el mismo día.');
      form.reset();
    });
  });

  $$('[data-demo-form-trigger]').forEach((button) => {
    button.addEventListener('click', () => toast('Demostración: aquí Shopify abre el inicio de sesión con Shop.'));
  });

  /* ---------- Sección con efecto de scroll (mantenimiento) ---------- */
  const scrolly = $('[data-scrolly]');
  if (scrolly && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    scrolly.classList.add('has-js');
    const steps = $$('.mstep', scrolly);
    const list = $('.maint__steps', scrolly);
    const label = $('[data-scrolly-label]', scrolly);
    const count = $('[data-scrolly-count]', scrolly);
    const bars = $$('.ticket__bar i', scrolly);
    let frame = 0;

    const update = () => {
      frame = 0;
      const mid = window.innerHeight * 0.5;
      let active = 0;
      steps.forEach((step, index) => {
        if (step.getBoundingClientRect().top < mid) active = index;
      });

      const box = list.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (mid - box.top) / box.height));
      scrolly.style.setProperty('--p', progress.toFixed(3));

      steps.forEach((step, index) => {
        step.classList.toggle('is-active', index === active);
        step.classList.toggle('is-done', index < active);
      });
      bars.forEach((bar, index) => bar.classList.toggle('on', index <= active));
      label.textContent = steps[active].dataset.title;
      count.textContent = `Paso ${active + 1} de ${steps.length}`;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
  }

  /* ---------- Banner: el engranaje gira y la foto se desplaza con el scroll ---------- */
  const hero = $('.hero');
  if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const gear = $('.hero__gear', hero);
    const photo = $('.hero__visual .photo', hero);
    let heroFrame = 0;

    const moveHero = () => {
      heroFrame = 0;
      const y = Math.min(window.scrollY, 700);
      if (gear) gear.style.transform = `rotate(${(y * 0.09).toFixed(2)}deg)`;
      if (photo) photo.style.transform = `translateY(${(-y * 0.04).toFixed(1)}px)`;
    };

    window.addEventListener(
      'scroll',
      () => {
        if (!heroFrame) heroFrame = requestAnimationFrame(moveHero);
      },
      { passive: true }
    );
  }

  /* ---------- Página de favoritos ---------- */
  const favPage = $('[data-favpage]');

  /** Muestra solo los productos guardados, en el orden en que se guardaron. */
  function renderFavPage() {
    if (!favPage) return;
    const list = favs.get();
    const grid = $('[data-fav-grid]', favPage);
    const cards = $$('.card', grid);
    const byIdMap = new Map(cards.map((card) => [card.dataset.id, card]));

    list.forEach((id) => {
      const card = byIdMap.get(id);
      if (card) grid.append(card);
    });
    cards.forEach((card) => {
      card.hidden = !list.includes(card.dataset.id);
    });

    const total = list.filter((id) => byIdMap.has(id)).length;
    $('[data-fav-empty]', favPage).hidden = total > 0;
    $('[data-fav-bar]', favPage).hidden = total === 0;
    $('[data-fav-total]', favPage).textContent = `${total} ${total === 1 ? 'producto guardado' : 'productos guardados'}`;
  }

  if (favPage) {
    $('[data-fav-addall]', favPage)?.addEventListener('click', () => {
      const ids = favs.get().filter((id) => byId.has(id));
      ids.forEach((id) => cart.add(id, 1));
      openDrawer('cart');
      toast(ids.length === 1 ? 'Agregamos 1 favorito al carrito' : `Agregamos ${ids.length} favoritos al carrito`);
    });

    $('[data-fav-clear]', favPage)?.addEventListener('click', () => {
      store.write('dch:fav', []);
      document.dispatchEvent(new CustomEvent('dch:fav'));
      toast('Lista de favoritos vacía');
    });
  }

  /* ---------- Inicio ---------- */
  const year = $('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  renderCart();
  renderFavs();
  renderFavPage();
})();
