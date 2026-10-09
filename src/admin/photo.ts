/**
 * Turns an uploaded photo into the site's portrait files, entirely in the browser:
 * background removal (if the photo isn't already transparent) → portrait-420/720/1100.webp + og-image.jpg.
 * The cutout removes only background connected to the image border, so light areas inside the
 * subject (teeth, glasses highlights) survive. Works best on a plain, light or evenly coloured background.
 */

export type PhotoResult = { cutoutUrl: string; ogUrl: string; files: { path: string; blob: Blob }[]; removedBackground: boolean };

const MAX_SIDE = 1600;

function canvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d', { willReadFrequently: true })!] as const;
}

const toBlob = (c: HTMLCanvasElement, type: string, q: number) =>
  new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('Could not encode image.'))), type, q));

/** Downscale in halving steps for a sharp result. */
function resize(src: HTMLCanvasElement, w: number) {
  let cur = src;
  while (cur.width / 2 > w) {
    const [c, ctx] = canvas(Math.round(cur.width / 2), Math.round(cur.height / 2));
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(cur, 0, 0, c.width, c.height);
    cur = c;
  }
  const h = Math.round((cur.height * w) / cur.width);
  const [c, ctx] = canvas(w, h);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(cur, 0, 0, w, h);
  return c;
}

function removeBackground(img: ImageData) {
  const { data, width: W, height: H } = img;
  const N = W * H;
  const border: number[] = [];
  for (let x = 0; x < W; x++) border.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) border.push(y * W, y * W + W - 1);

  // Already transparent around the edges? Keep the photo's own mask.
  const transparentEdges = border.filter((p) => data[p * 4 + 3] < 250).length / border.length;
  if (transparentEdges > 0.5) return false;

  const med = (c: number) => border.map((p) => data[p * 4 + c]).sort((a, b) => a - b)[border.length >> 1];
  const bg = [med(0), med(1), med(2)];
  const dist = new Float32Array(N);
  for (let p = 0; p < N; p++) {
    dist[p] = Math.max(Math.abs(data[p * 4] - bg[0]), Math.abs(data[p * 4 + 1] - bg[1]), Math.abs(data[p * 4 + 2] - bg[2]));
  }
  const REACH = 34;
  const SOLID = 10;
  const isBg = new Uint8Array(N);
  const stack = border.filter((p) => dist[p] < REACH);
  for (const p of stack) isBg[p] = 1;
  while (stack.length) {
    const p = stack.pop()!;
    const x = p % W;
    const y = (p / W) | 0;
    if (x > 0 && !isBg[p - 1] && dist[p - 1] < REACH) (isBg[p - 1] = 1), stack.push(p - 1);
    if (x < W - 1 && !isBg[p + 1] && dist[p + 1] < REACH) (isBg[p + 1] = 1), stack.push(p + 1);
    if (y > 0 && !isBg[p - W] && dist[p - W] < REACH) (isBg[p - W] = 1), stack.push(p - W);
    if (y < H - 1 && !isBg[p + W] && dist[p + W] < REACH) (isBg[p + W] = 1), stack.push(p + W);
  }
  const alpha = new Uint8Array(N);
  for (let p = 0; p < N; p++) alpha[p] = !isBg[p] ? 255 : dist[p] <= SOLID ? 0 : Math.round(((dist[p] - SOLID) / (REACH - SOLID)) * 255);

  // Erode 1px (no light halo on the dark site), then soften the edge.
  const eroded = new Uint8Array(N);
  const soft = new Uint8Array(N);
  const pass = (src: Uint8Array, dst: Uint8Array, op: 'min' | 'avg') => {
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        let acc = op === 'min' ? 255 : 0;
        for (let dy = -1; dy <= 1; dy++) {
          const yy = Math.min(H - 1, Math.max(0, y + dy));
          for (let dx = -1; dx <= 1; dx++) {
            const v = src[yy * W + Math.min(W - 1, Math.max(0, x + dx))];
            acc = op === 'min' ? Math.min(acc, v) : acc + v;
          }
        }
        dst[y * W + x] = op === 'min' ? acc : Math.round(acc / 9);
      }
    }
  };
  pass(alpha, eroded, 'min');
  pass(eroded, soft, 'avg');
  for (let p = 0; p < N; p++) data[p * 4 + 3] = soft[p];
  return true;
}

export async function processPhoto(file: File, text: { title: string; series: string; tagline: string }): Promise<PhotoResult> {
  if (!/^image\/(png|jpeg|webp)$/.test(file.type)) throw new Error('Please choose a PNG, JPG or WebP photo.');
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
  const W = Math.round(bmp.width * scale);
  const H = Math.round(bmp.height * scale);
  const [full, ctx] = canvas(W, H);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bmp, 0, 0, W, H);
  const img = ctx.getImageData(0, 0, W, H);
  const removedBackground = removeBackground(img);
  ctx.putImageData(img, 0, 0);

  const files: PhotoResult['files'] = [];
  for (const w of [1100, 720, 420]) {
    const blob = await toBlob(resize(full, Math.min(w, W)), 'image/webp', 0.86);
    if (blob.type !== 'image/webp') throw new Error('This browser can’t create WebP images. Please use Chrome or Edge.');
    files.push({ path: `public/assets/portrait-${w}.webp`, blob });
  }

  // Share image (1200×630) — same layout as scripts/build-images.mjs.
  await Promise.all([document.fonts.load('128px "Bebas Neue"'), document.fonts.load('700 26px Inter'), document.fonts.load('600 18px Inter')]);
  const [og, o] = canvas(1200, 630);
  o.fillStyle = '#07070a';
  o.fillRect(0, 0, 1200, 630);
  const g = o.createRadialGradient(936, 284, 0, 936, 284, 540);
  g.addColorStop(0, 'rgba(229,19,43,0.45)');
  g.addColorStop(1, 'rgba(229,19,43,0)');
  o.fillStyle = g;
  o.fillRect(0, 0, 1200, 630);
  const ph = resize(full, Math.round((W * 600) / H));
  o.drawImage(ph, 1200 - ph.width, 630 - ph.height);
  const spaced = (s: string, x: number, y: number, font: string, color: string, spacing: number) => {
    o.font = font;
    o.fillStyle = color;
    (o as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${spacing}px`;
    o.fillText(s, x, y);
  };
  spaced(text.title.toUpperCase(), 72, 300, '128px "Bebas Neue", Impact, sans-serif', '#f4f1ec', 4);
  spaced(text.series.toUpperCase(), 78, 352, '700 26px Inter, Arial, sans-serif', '#ff3d5a', 16);
  spaced(text.tagline.toUpperCase(), 78, 420, '600 18px Inter, Arial, sans-serif', '#a7a6ad', 5);
  const ogBlob = await toBlob(og, 'image/jpeg', 0.85);
  files.push({ path: 'public/assets/og-image.jpg', blob: ogBlob });

  return { cutoutUrl: URL.createObjectURL(files[1].blob), ogUrl: URL.createObjectURL(ogBlob), files, removedBackground };
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(',')[1] ?? '');
    r.onerror = () => rej(r.error);
    r.readAsDataURL(blob);
  });
}
