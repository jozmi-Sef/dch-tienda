/**
 * Descarga las fotos de producto de la web antigua (dchmaquinarias.pe).
 * Uso:  node fetch-images.js
 * Guarda en ../site/img/p/<handle>.webp  (solo los productos nuevos; los usados reutilizan la foto del modelo).
 */
const fs = require('fs');
const path = require('path');
const { NEW } = require('./data.js');

const OUT = path.join(__dirname, '..', 'site', 'img', 'p');
fs.mkdirSync(OUT, { recursive: true });

const UA = { headers: { 'User-Agent': 'Mozilla/5.0' } };

async function download(url, file) {
  const response = await fetch(url, UA);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  fs.writeFileSync(file, Buffer.from(await response.arrayBuffer()));
}

async function one(product) {
  const file = path.join(OUT, `${product.handle}.webp`);
  if (fs.existsSync(file) && fs.statSync(file).size > 2000) return 'ya existe';

  const page = await fetch(`https://dchmaquinarias.pe/producto/${product.old}/`, UA);
  if (!page.ok) throw new Error(`página ${page.status}`);
  const html = await page.text();
  const match = html.match(/property="og:image" content="([^"]+)"/);
  if (!match) throw new Error('sin og:image');

  const original = match[1];
  const sized = original.replace(/-\d+x\d+(?=\.\w+$)/, '-600x600');
  try {
    await download(sized, file);
  } catch {
    await download(original, file);
  }
  return 'ok';
}

(async () => {
  const queue = [...NEW];
  const results = { ok: 0, fail: [] };

  async function worker() {
    while (queue.length) {
      const product = queue.shift();
      try {
        const status = await one(product);
        if (status === 'ok') results.ok += 1;
      } catch (error) {
        results.fail.push(`${product.handle}: ${error.message}`);
      }
    }
  }

  await Promise.all(Array.from({ length: 6 }, worker));
  console.log(`Descargadas: ${results.ok} | Fallidas: ${results.fail.length}`);
  for (const line of results.fail) console.log(' -', line);
})();
