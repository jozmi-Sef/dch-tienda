/**
 * Maquetas de dibujo (placeholders) para las fotos del equipo.
 * Cada archivo se reemplaza por una foto real manteniendo el mismo nombre
 * (o cambiando la ruta en las páginas). Uso:  node mock.js
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'site', 'img', 'mock');
fs.mkdirSync(OUT, { recursive: true });

const C = {
  bg: '#dce6f4',
  bg2: '#cbd9ee',
  floor: '#b9cbe6',
  shelf: '#a9bddf',
  box: '#c7d6ee',
  box2: '#8fa8d6',
  navy: '#001a72',
  deep: '#000f45',
  cyan: '#00b5ef',
  red: '#e30613',
  white: '#ffffff',
  ink: '#0a1030',
};
const SKIN = ['#f0c9a6', '#d6a078', '#b87a52', '#8a5a3c'];

/** Persona estilizada. Origen en los pies. */
function person(x, y, s, o = {}) {
  const { skin = SKIN[0], shirt = C.navy, pants = C.deep, hat = C.white, vest = false, tool = null, glasses = false, arm = 'down' } = o;
  const raised = arm === 'up';
  const rightArm = raised
    ? `<g transform="rotate(-62 38 -166)"><rect x="30" y="-170" width="16" height="80" rx="8" fill="${shirt}"/><circle cx="38" cy="-88" r="8.5" fill="${skin}"/></g>`
    : `<rect x="30" y="-170" width="16" height="80" rx="8" fill="${shirt}"/><circle cx="38" cy="-88" r="8.5" fill="${skin}"/>`;

  let toolSvg = '';
  if (tool === 'drill') {
    toolSvg = `<g transform="translate(62 -176) rotate(-8)"><rect x="0" y="0" width="40" height="15" rx="4" fill="${C.red}"/><rect x="38" y="4" width="14" height="7" fill="#2a2f45"/><rect x="6" y="12" width="12" height="24" rx="4" fill="#2a2f45"/></g>`;
  } else if (tool === 'clip') {
    toolSvg = `<g transform="translate(54 -140) rotate(8)"><rect width="30" height="40" rx="3" fill="#fff" stroke="${C.navy}" stroke-width="2"/><rect x="9" y="-4" width="12" height="7" rx="2" fill="${C.navy}"/><path d="M6 14h18M6 22h18M6 30h12" stroke="${C.cyan}" stroke-width="2.5"/></g>`;
  } else if (tool === 'box') {
    toolSvg = `<g transform="translate(-34 -150)"><rect width="68" height="52" rx="3" fill="#d9b98d"/><rect x="0" y="0" width="68" height="12" fill="#c9a574"/><rect x="28" y="0" width="12" height="52" fill="#e8d3ae" opacity=".7"/></g>`;
  } else if (tool === 'grinder') {
    toolSvg = `<g transform="translate(48 -158) rotate(-14)"><rect width="46" height="14" rx="5" fill="${C.cyan}"/><rect x="42" y="-4" width="10" height="22" rx="2" fill="#2a2f45"/><circle cx="58" cy="7" r="14" fill="none" stroke="#6a7390" stroke-width="3"/><path d="M70 6l12-8M72 12l14-1M70 17l12 8" stroke="#ffb020" stroke-width="2.5" stroke-linecap="round"/></g>`;
  }

  const eyes = glasses ? `<rect x="-15" y="-206" width="30" height="9" rx="4.5" fill="${C.cyan}" opacity=".8"/>` : '';
  const vestSvg = vest
    ? `<path d="M-32 -168 q0 -10 10 -10 h10 l12 44 l12 -44 h10 q10 0 10 10 v80 h-64z" fill="${C.red}"/><rect x="-32" y="-118" width="64" height="8" fill="#fff" opacity=".9"/>`
    : '';

  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="2" rx="46" ry="7" fill="#001a72" opacity=".12"/>
    <rect x="-23" y="-94" width="19" height="94" rx="7" fill="${pants}"/><rect x="4" y="-94" width="19" height="94" rx="7" fill="${pants}"/>
    <rect x="-27" y="-9" width="25" height="9" rx="4.5" fill="${C.ink}"/><rect x="2" y="-9" width="25" height="9" rx="4.5" fill="${C.ink}"/>
    <rect x="-46" y="-170" width="16" height="80" rx="8" fill="${shirt}"/><circle cx="-38" cy="-88" r="8.5" fill="${skin}"/>
    <path d="M-32 -168 q0 -10 10 -10 h44 q10 0 10 10 v82 h-64z" fill="${shirt}"/>
    ${vestSvg}
    ${tool === 'box' ? '' : rightArm}
    <rect x="-7" y="-188" width="14" height="16" fill="${skin}"/>
    <circle cx="0" cy="-202" r="22" fill="${skin}"/>
    ${eyes}
    <path d="M-27 -210 a27 27 0 0 1 54 0z" fill="${hat}"/><rect x="-32" y="-212" width="64" height="7" rx="3.5" fill="${hat}"/><rect x="-4" y="-240" width="8" height="30" rx="4" fill="${hat}" opacity=".6"/>
    ${toolSvg}
    ${tool === 'box' ? `<rect x="-46" y="-170" width="16" height="60" rx="8" fill="${shirt}"/><rect x="30" y="-170" width="16" height="60" rx="8" fill="${shirt}"/>` : ''}
  </g>`;
}

/** Estantería con cajas al fondo. */
function shelves(x, y, w, rows, h = 92) {
  let out = '';
  for (let r = 0; r < rows; r += 1) {
    const top = y + r * h;
    out += `<rect x="${x}" y="${top + h - 8}" width="${w}" height="8" fill="${C.shelf}"/>`;
    let cx = x + 10;
    let n = 0;
    while (cx < x + w - 50) {
      const bw = 40 + ((n * 13 + r * 7) % 34);
      const bh = 34 + ((n * 17 + r * 11) % 38);
      const fill = n % 3 === 0 ? C.box2 : C.box;
      out += `<rect x="${cx}" y="${top + h - 8 - bh}" width="${bw}" height="${bh}" rx="3" fill="${fill}"/>`;
      if (n % 4 === 1) out += `<rect x="${cx + 6}" y="${top + h - 8 - bh + 8}" width="${bw - 12}" height="6" rx="2" fill="${C.white}" opacity=".55"/>`;
      cx += bw + 10;
      n += 1;
    }
  }
  return out;
}

function frame(inner, label) {
  const mark = (x, y, dx, dy) => `<path d="M${x} ${y + dy * 26}V${y}H${x + dx * 26}" fill="none" stroke="${C.navy}" stroke-width="3" opacity=".35"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-label="${label}">
  <defs>
    <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.4" fill="${C.navy}" opacity=".12"/></pattern>
  </defs>
  <rect width="800" height="600" fill="${C.bg}"/>
  <rect width="800" height="600" fill="url(#dots)"/>
  ${inner}
  ${mark(22, 22, 1, 1)}${mark(778, 22, -1, 1)}${mark(22, 578, 1, -1)}${mark(778, 578, -1, -1)}
</svg>`;
}

const floor = (y = 470) => `<rect y="${y}" width="800" height="${600 - y}" fill="${C.floor}"/><rect y="${y}" width="800" height="5" fill="${C.navy}" opacity=".08"/>`;

const banner = (text) =>
  `<g><rect x="0" y="56" width="560" height="46" fill="${C.navy}"/><path d="M560 56 h26 l-26 46 h-26z" fill="${C.red}"/><text x="28" y="87" font-family="Archivo, Arial, sans-serif" font-size="22" font-weight="800" letter-spacing="2" fill="#fff">${text}</text></g>`;

const scenes = {
  /* Foto de equipo: cinco personas al frente de la estantería. */
  equipo: frame(
    `${shelves(40, 130, 720, 3, 108)}${banner('EQUIPO DCH')}${floor(470)}
     ${person(120, 540, 1.05, { skin: SKIN[1], shirt: C.cyan, hat: C.red, vest: true })}
     ${person(255, 548, 1.18, { skin: SKIN[0], shirt: C.navy, hat: C.white, tool: 'clip' })}
     ${person(405, 556, 1.32, { skin: SKIN[2], shirt: C.navy, hat: C.red, vest: true, tool: 'drill', arm: 'up' })}
     ${person(550, 548, 1.18, { skin: SKIN[3], shirt: '#35507f', hat: C.white })}
     ${person(685, 540, 1.05, { skin: SKIN[0], shirt: C.cyan, hat: C.red, vest: true })}`,
    'Maqueta de foto del equipo DCH'
  ),

  /* Asesoría en mostrador. */
  mostrador: frame(
    `${shelves(40, 120, 720, 2, 112)}${floor(480)}
     ${person(300, 470, 1.25, { skin: SKIN[1], shirt: C.navy, hat: C.white, vest: true, tool: 'clip' })}
     <rect x="90" y="390" width="470" height="120" fill="${C.navy}"/><rect x="90" y="384" width="470" height="12" fill="${C.deep}"/>
     <rect x="120" y="420" width="120" height="8" fill="${C.cyan}" opacity=".7"/><rect x="120" y="440" width="80" height="8" fill="${C.cyan}" opacity=".4"/>
     <g transform="translate(400 340)"><rect width="56" height="22" rx="5" fill="${C.red}"/><rect x="52" y="6" width="20" height="9" fill="#2a2f45"/><rect x="10" y="20" width="16" height="30" rx="5" fill="#2a2f45"/></g>
     <g transform="translate(160 346)"><rect width="74" height="40" rx="4" fill="#fff" stroke="${C.navy}" stroke-width="3"/><path d="M12 14h50M12 24h34" stroke="${C.cyan}" stroke-width="4"/></g>
     ${person(640, 520, 1.2, { skin: SKIN[2], shirt: '#35507f', hat: '#f2b705', vest: false, arm: 'up' })}`,
    'Maqueta de foto de asesoría en mostrador'
  ),

  /* Despacho: camioneta y carga. */
  despacho: frame(
    `${floor(430)}
     <rect x="0" y="470" width="800" height="130" fill="${C.deep}" opacity=".85"/><path d="M0 535h800" stroke="#fff" stroke-width="5" stroke-dasharray="48 36" opacity=".5"/>
     <g transform="translate(90 250)">
       <rect x="0" y="40" width="300" height="104" rx="8" fill="${C.navy}"/>
       <path d="M300 60 h86 l54 46 v38 h-140z" fill="${C.navy}"/><path d="M318 72 h54 l36 32 h-90z" fill="${C.bg2}"/>
       <rect x="14" y="14" width="120" height="70" rx="3" fill="#d9b98d"/><rect x="144" y="26" width="90" height="58" rx="3" fill="#c9a574"/><rect x="20" y="-34" width="96" height="50" rx="3" fill="#e0c79c"/>
       <rect x="0" y="120" width="440" height="14" fill="${C.deep}"/><rect x="8" y="64" width="150" height="10" fill="${C.red}"/>
       <circle cx="86" cy="148" r="34" fill="${C.ink}"/><circle cx="86" cy="148" r="15" fill="${C.bg2}"/>
       <circle cx="352" cy="148" r="34" fill="${C.ink}"/><circle cx="352" cy="148" r="15" fill="${C.bg2}"/>
     </g>
     ${person(590, 560, 1.22, { skin: SKIN[2], shirt: C.navy, hat: C.red, vest: true, tool: 'box' })}`,
    'Maqueta de foto del despacho de pedidos'
  ),

  /* Taller de mantenimiento. */
  taller: frame(
    `${shelves(40, 110, 330, 2, 112)}
     <g transform="translate(470 120)"><rect width="260" height="120" rx="4" fill="${C.bg2}" stroke="${C.navy}" stroke-width="3" opacity=".9"/>
       <path d="M24 40h70M24 60h110M24 80h50" stroke="${C.navy}" stroke-width="5" opacity=".45"/><circle cx="196" cy="60" r="30" fill="none" stroke="${C.cyan}" stroke-width="8"/></g>
     ${floor(470)}
     ${person(330, 540, 1.3, { skin: SKIN[3], shirt: '#35507f', hat: C.white, glasses: true, tool: 'grinder', arm: 'up' })}
     <rect x="440" y="400" width="300" height="130" fill="${C.navy}"/><rect x="430" y="388" width="320" height="14" fill="${C.deep}"/>
     <rect x="560" y="352" width="60" height="36" rx="3" fill="${C.shelf}"/><rect x="556" y="340" width="68" height="12" rx="3" fill="${C.ink}"/>
     <rect x="470" y="420" width="90" height="8" fill="${C.cyan}" opacity=".6"/>`,
    'Maqueta de foto del taller de mantenimiento'
  ),

  /* Fachada de la tienda. */
  tienda: frame(
    `${floor(480)}
     <rect x="110" y="120" width="580" height="360" fill="#eef3fb" stroke="${C.navy}" stroke-width="4"/>
     <rect x="110" y="120" width="580" height="72" fill="${C.navy}"/><path d="M690 120 h0 v72 h-70 l30 -72z" fill="${C.red}"/>
     <text x="150" y="168" font-family="Archivo, Arial, sans-serif" font-size="34" font-weight="800" letter-spacing="3" fill="#fff">DCH TOOLS</text>
     <g transform="translate(110 192)">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => `<path d="M${i * 48.3} 0 h48.3 v34 q-24 14 -48.3 0z" fill="${i % 2 ? '#fff' : C.red}"/>`).join('')}</g>
     <rect x="150" y="250" width="250" height="190" fill="${C.bg}" stroke="${C.navy}" stroke-width="3"/>
     <rect x="160" y="352" width="230" height="8" fill="${C.shelf}"/><rect x="160" y="410" width="230" height="8" fill="${C.shelf}"/>
     <rect x="176" y="316" width="44" height="36" rx="3" fill="${C.box2}"/><rect x="232" y="326" width="58" height="26" rx="3" fill="${C.red}"/><rect x="306" y="312" width="64" height="40" rx="3" fill="${C.box}"/>
     <rect x="180" y="374" width="70" height="36" rx="3" fill="${C.cyan}" opacity=".8"/><rect x="266" y="380" width="52" height="30" rx="3" fill="${C.box2}"/><rect x="332" y="370" width="40" height="40" rx="3" fill="${C.box}"/>
     <rect x="440" y="250" width="130" height="230" fill="${C.navy}"/><rect x="452" y="262" width="106" height="150" fill="${C.bg2}" opacity=".5"/><circle cx="552" cy="372" r="6" fill="#fff"/>
     <rect x="590" y="250" width="70" height="120" fill="${C.bg}" stroke="${C.navy}" stroke-width="3"/><rect x="598" y="262" width="54" height="96" fill="${C.red}" opacity=".15"/>
     ${person(630, 550, 1.1, { skin: SKIN[1], shirt: C.cyan, hat: C.red, vest: true })}`,
    'Maqueta de foto de la tienda'
  ),
};

for (const [name, svg] of Object.entries(scenes)) fs.writeFileSync(path.join(OUT, `${name}.svg`), svg);
console.log('Maquetas:', Object.keys(scenes).join(', '));
