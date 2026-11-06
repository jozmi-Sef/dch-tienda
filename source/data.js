/**
 * Datos del catálogo de DCH.
 * - Los 57 modelos salen de dchmaquinarias.pe (nombre, marca y categoría).
 * - Los PRECIOS son de ejemplo (la web antigua no los publica). Reemplazar por los reales.
 * - Las unidades de segunda mano son ejemplos para mostrar cómo se verá esa sección.
 */

const slugify = (text) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/["']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/* Categorías agrupadas como se mostrarán en el megamenú. */
const CATEGORY_GROUPS = [
  { name: 'Perforación y demolición', keys: ['rot', 'dem', 'tal'] },
  { name: 'Corte y acabado', keys: ['met', 'sol', 'cor', 'car'] },
  { name: 'Energía y aire', keys: ['gen', 'aire', 'hid'] },
  { name: 'Obra y jardín', keys: ['con', 'niv', 'jar'] },
];

const CATEGORIES = {
  rot: { name: 'Rotomartillos', blurb: 'Perforación y cincelado en concreto', icon: 'hammer' },
  dem: { name: 'Demoledores', blurb: 'Demolición de losas, muros y pisos', icon: 'chisel' },
  tal: { name: 'Taladros inalámbricos', blurb: 'Taladros, atornilladores y kits', icon: 'drill' },
  met: { name: 'Metalmecánica', blurb: 'Amoladoras, esmeriles y taladros de banco', icon: 'grinder' },
  sol: { name: 'Soldadoras', blurb: 'Inverter y multiproceso', icon: 'weld' },
  cor: { name: 'Cortadoras', blurb: 'Concreto, mármol y mayólicas', icon: 'cutter' },
  car: { name: 'Carpintería', blurb: 'Sierras, lijadoras y ruteadoras', icon: 'saw' },
  gen: { name: 'Generadores', blurb: 'Energía para obra y respaldo', icon: 'bolt' },
  aire: { name: 'Herramientas de aire', blurb: 'Compresoras de aire', icon: 'tank' },
  hid: { name: 'Hidrolavadoras', blurb: 'Lavado a alta presión', icon: 'drop' },
  con: { name: 'Construcción', blurb: 'Mezclado, vibrado y acabados', icon: 'mixer' },
  niv: { name: 'Niveles láser', blurb: 'Líneas cruzadas y multilíneas', icon: 'laser' },
  jar: { name: 'Jardinería', blurb: 'Motosierras, motobombas y desbrozadoras', icon: 'leaf' },
};
for (const [key, category] of Object.entries(CATEGORIES)) category.handle = slugify(category.name);

/* [slug en la web antigua, título, marca, categoría, precio de ejemplo (S/), especificaciones, extras] */
const NEW_ITEMS = [
  ['lavadora-de-alta-presion-2500w-150-bar', 'Lavadora de alta presión 2500W - 150 Bar', 'Bomder', 'hid', 459, 'Potencia: 2500 W|Presión: 150 Bar'],
  ['hidrolavadora-electrica-de-alta-presion-alpha', 'Hidrolavadora eléctrica de alta presión', 'Alpha', 'hid', 389, ''],
  ['amoladora-angular-dongcheng-900w-115mm', 'Amoladora angular 900W 115mm', 'Dong Cheng', 'met', 189, 'Potencia: 900 W|Diámetro de disco: 115 mm'],
  ['taladro-de-banco-industrial-zafiro-1hp', 'Taladro de banco industrial 1HP', 'Zafiro', 'met', 1250, 'Potencia: 1 HP'],
  ['cortadora-de-concreto-y-marmol-1500w', 'Cortadora de concreto y mármol 1500W', 'Ferton', 'cor', 520, 'Potencia: 1500 W'],
  ['ventosa-de-mayolicas-inalambrico-ingco-20v-130mm', 'Ventosa de mayólicas inalámbrica 20V 130mm', 'Ingco', 'con', 380, 'Voltaje: 20 V|Diámetro: 130 mm|Alimentación: Batería'],
  ['pulidora-inalambrica-brushless-20v-180-mm', 'Pulidora inalámbrica brushless 20V 180 mm', 'Dong Cheng', 'car', 640, 'Voltaje: 20 V|Diámetro: 180 mm|Motor: Brushless'],
  ['sierra-circular', 'Sierra circular', 'Powful', 'car', 249, ''],
  ['ruteadora', 'Ruteadora', 'Powful', 'car', 279, ''],
  ['lijadora-de-pared-y-techo-con-led', 'Lijadora de pared y techo con LED', 'Bomvink', 'car', 690, 'Incluye: Luz LED'],
  ['lijadora-exentrica-random-orbital-con-regulador-de-velocidad', 'Lijadora excéntrica random orbital con regulador', 'Powful', 'car', 235, 'Velocidad: Regulable'],
  ['lijadora-orbital-cuadrada', 'Lijadora orbital cuadrada', 'Powful', 'car', 199, ''],
  ['taladro-atornillador-percutor-inalambrico-yholt-21v-brushless-45nm', 'Taladro atornillador percutor inalámbrico 21V brushless 45Nm', 'Yholt', 'tal', 459, 'Voltaje: 21 V|Torque: 45 Nm|Motor: Brushless'],
  ['taladro-atornillador-21-v-bomtex', 'Taladro atornillador inalámbrico 21V', 'Bomtex', 'tal', 289, 'Voltaje: 21 V', { compareAt: 339 }],
  ['taladro-atornillador-inalambrico-21v-kit-24-piezas', 'Taladro atornillador inalámbrico 21V - Kit 24 piezas', 'Bomtex', 'tal', 329, 'Voltaje: 21 V|Kit: 24 piezas', { best: true }],
  ['juego-de-taladro-percutor-y-amoladora-angular-inalambricos-de-iones-de-litio-21v', 'Juego de taladro percutor y amoladora angular inalámbricos 21V', 'Bomtex', 'tal', 799, 'Voltaje: 21 V|Batería: Iones de litio|Incluye: Taladro percutor y amoladora angular'],
  ['kit-de-taladro-percutor-inalambrico-herramientas-166-piezas', 'Kit de taladro percutor inalámbrico + 166 piezas', 'Ingco', 'tal', 569, 'Kit: 166 piezas', { best: true }],
  ['taladro-de-impacto-inalambrico-compacto-brushless-20v', 'Taladro atornillador percutor inalámbrico brushless 20V-55Nm', 'Ingco', 'tal', 520, 'Voltaje: 20 V|Torque: 55 Nm|Motor: Brushless'],
  ['maquina-de-soldar-multriproceso-mig-200', 'Máquina de soldar multiproceso MIG-200', 'Powful', 'sol', 1290, 'Modelo: MIG-200|Tipo: Multiproceso'],
  ['maquina-de-soldar-inverter-250-amp', 'Máquina de soldar inverter 250 AMP', 'Powful', 'sol', 520, 'Amperaje: 250 A|Tipo: Inverter', { best: true }],
  ['maquina-de-soldar-inverter-300-amp', 'Máquina de soldar inverter 300 AMP', 'Powful', 'sol', 680, 'Amperaje: 300 A|Tipo: Inverter'],
  ['maquina-de-soldar-inverter-200-amp', 'Máquina de soldar inverter 200 AMP', 'Powful', 'sol', 420, 'Amperaje: 200 A|Tipo: Inverter'],
  ['maquina-de-soldar-inverter-350-amp', 'Máquina de soldar inverter 350 AMP', 'Bomvink', 'sol', 890, 'Amperaje: 350 A|Tipo: Inverter'],
  ['rotomartillo-emtop-1600w-sds-3-funciones', 'Rotomartillo 1600W SDS 3 funciones', 'Emtop', 'rot', 780, 'Potencia: 1600 W|Mandril: SDS|Funciones: 3'],
  ['rotomartillo-sds-plus-32-mm-3-funciones-1500w', 'Rotomartillo SDS Plus 32 mm 3 funciones 1500W', 'Powful', 'rot', 459, 'Potencia: 1500 W|Mandril: SDS Plus|Diámetro máx. en concreto: 32 mm|Funciones: 3'],
  ['rotomartillo-sds-plus-4-kg-3-funciones-1050w', 'Rotomartillo SDS Plus 4 Kg 3 funciones 1050W', 'Powful', 'rot', 365, 'Potencia: 1050 W|Peso: 4 kg|Mandril: SDS Plus|Funciones: 3', { compareAt: 410 }],
  ['nivel-laser-5-lineas', 'Nivel láser 5 líneas', 'Bomvink', 'niv', 249, 'Líneas: 5'],
  ['nivel-laser-linea-cruzada-16-7-m', 'Nivel láser línea cruzada 16.7 m', 'Dewalt', 'niv', 1190, 'Alcance: 16.7 m|Tipo: Línea cruzada'],
  ['nivel-laser-12-lineas-con-tripode-bomtex', 'Nivel láser 12 líneas con trípode', 'Bomtex', 'niv', 459, 'Líneas: 12|Incluye: Trípode'],
  ['nivel-laser-16-lineas', 'Nivel láser 16 líneas', 'Bomtex', 'niv', 520, 'Líneas: 16'],
  ['amoladora-angular-1300w-125mm', 'Amoladora angular 1300W - 125mm', 'Powful', 'met', 259, 'Potencia: 1300 W|Diámetro de disco: 125 mm', { best: true }],
  ['esmeril-de-banco-8-1-2-hp', 'Esmeril de banco 8" 1.2 HP', 'Zafiro', 'met', 480, 'Potencia: 1.2 HP|Disco: 8"'],
  ['esmeril-de-banco-powful-1-6-hp-120w', 'Esmeril de banco 1/6 HP 120W', 'Powful', 'met', 189, 'Potencia: 120 W (1/6 HP)'],
  ['esmeril-angular-inalambrico-bomvink-21v-125-mm', 'Esmeril angular inalámbrico 21V 125 mm', 'Bomvink', 'met', 399, 'Voltaje: 21 V|Diámetro de disco: 125 mm'],
  ['compresora-de-aire-10l', 'Compresora de aire 10L', 'Dong Cheng', 'aire', 389, 'Capacidad: 10 L'],
  ['compresora-de-aire-dongcheng-30l-1200w-sin-aceite', 'Compresora de aire 30L 1200W sin aceite', 'Dong Cheng', 'aire', 790, 'Capacidad: 30 L|Potencia: 1200 W|Tipo: Sin aceite'],
  ['compresora-de-aire-30l', 'Compresora de aire 30L', 'Powful', 'aire', 560, 'Capacidad: 30 L'],
  ['generador-de-luz-6500w', 'Generador de luz 6500W', 'Powful', 'gen', 2390, 'Potencia: 6500 W', { compareAt: 2590 }],
  ['generador-de-luz-1000-w', 'Generador de luz 1000 W', 'Powful', 'gen', 590, 'Potencia: 1000 W'],
  ['generador-de-luz-2800-w', 'Generador de luz 2800 W', 'Powful', 'gen', 1190, 'Potencia: 2800 W'],
  ['generador-de-luz-3000-w', 'Generador de luz 3000 W', 'Powful', 'gen', 1450, 'Potencia: 3000 W', { best: true }],
  ['generador-de-luz-5500-w', 'Generador de luz 5500 W', 'Powful', 'gen', 2090, 'Potencia: 5500 W'],
  ['demoledor-electrico-ingco-1300w-20j', 'Demoledor eléctrico 1300W 20J', 'Ingco', 'dem', 1320, 'Potencia: 1300 W|Energía de impacto: 20 J'],
  ['3164', 'Demoledor eléctrico 1900W', 'Powful', 'dem', 1650, 'Potencia: 1900 W'],
  ['demoledor-electrico', 'Demoledor eléctrico 1500W', 'Powful', 'dem', 1150, 'Potencia: 1500 W'],
  ['demoledor-11-kg', 'Demoledor 11 kg', 'DCH Tools', 'dem', 1790, 'Peso: 11 kg'],
  ['motobomba-de-gasolina-3', 'Motobomba de gasolina 3"', 'Powful', 'jar', 690, 'Combustible: Gasolina|Diámetro: 3"'],
  ['motosierra-gasolinera-22', 'Motosierra a gasolina 22"', 'Zafiro', 'jar', 520, 'Largo de espada: 22"'],
  ['motosierra-20-powful', 'Motosierra a gasolina 20"', 'Powful', 'jar', 480, 'Largo de espada: 20"'],
  ['motoguadana', 'Desbrozadora a gasolina 37.7cc - 1.36 HP', 'Bomtex', 'jar', 560, 'Cilindrada: 37.7 cc|Potencia: 1.36 HP'],
  ['cortamayolica-de-1-metro', 'Cortamayólica de 1 metro', 'Powful', 'cor', 330, 'Largo de corte: 1 m'],
  ['batidor-electrico-1300w', 'Batidor eléctrico 1300W', 'Zafiro', 'con', 299, 'Potencia: 1300 W'],
  ['vibradora-de-concreto-1200w-aguja-35-mm', 'Vibradora de concreto 1200W - Aguja 35 mm', 'Powful', 'con', 690, 'Potencia: 1200 W|Aguja: 35 mm'],
  ['mezcladora-de-concreto-electrica', 'Mezcladora de concreto eléctrica', 'Toyaki', 'con', 1250, '', { best: true }],
  ['pistola-de-calor-2000w', 'Pistola de calor 2000W', 'Powful', 'con', 129, 'Potencia: 2000 W'],
  ['rectificadora', 'Rectificadora', 'Ferton', 'met', 289, ''],
  ['llave-de-impacto-de-1-2', 'Llave de impacto de 1/2"', 'Bomvink', 'tal', 480, 'Encastre: 1/2"'],
];

/* Unidades de segunda mano de ejemplo: [posición en NEW_ITEMS, horas de uso, estado, % del precio nuevo] */
const USED_ITEMS = [
  [41, 180, 'A', 0.66],
  [25, 90, 'A', 0.64],
  [36, 140, 'B', 0.58],
  [19, 210, 'B', 0.55],
  [45, 120, 'B', 0.6],
  [30, 70, 'A', 0.7],
  [3, 260, 'B', 0.5],
  [43, 150, 'B', 0.6],
  [48, 95, 'A', 0.66],
  [26, 60, 'A', 0.68],
];

const roundTo5 = (value) => Math.round(value / 5) * 5;

const toProduct = ([old, title, brand, cat, price, specs, extra = {}]) => ({
  handle: slugify(title),
  base: slugify(title),
  old,
  title,
  brand,
  cat,
  price,
  compareAt: extra.compareAt || null,
  best: Boolean(extra.best),
  condition: 'nuevo',
  stock: 'lima',
  specs: specs ? specs.split('|').map((line) => line.split(': ')) : [],
});

const NEW = NEW_ITEMS.map(toProduct);

const USED = USED_ITEMS.map(([index, hours, grade, factor], n) => {
  const base = NEW[index];
  return {
    ...base,
    handle: `${base.handle}-usado-${n + 1}`,
    title: base.title,
    price: roundTo5(base.price * factor),
    compareAt: base.price,
    best: false,
    condition: 'usado',
    grade,
    hours,
    stock: 'lima',
  };
});

/* Algunos modelos se piden bajo pedido, para mostrar ese estado en la tienda. */
for (const handle of ['juego-de-taladro-percutor-y-amoladora-angular-inalambricos-21v', 'nivel-laser-linea-cruzada-16-7-m', 'maquina-de-soldar-multiproceso-mig-200']) {
  const product = NEW.find((item) => item.handle === handle);
  if (product) product.stock = 'pedido';
}

const PRODUCTS = [...NEW, ...USED];

/* Recorrido de la tienda para el home. */
const BRANDS = [...new Set(NEW.map((item) => item.brand))].sort();

module.exports = { CATEGORIES, CATEGORY_GROUPS, PRODUCTS, NEW, USED, BRANDS, slugify };
