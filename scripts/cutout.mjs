// Makes pic.png (transparent cutout) and pic1.jpeg (full photo) from a photo shot on a plain,
// light background. Usage: node scripts/cutout.mjs <photo.png>
// Only background connected to the image border is removed (flood fill), so light areas inside
// the subject — teeth, glasses highlights — are kept. Then run `npm run images`.
import sharp from 'sharp';

const src = process.argv[2];
if (!src) throw new Error('usage: node scripts/cutout.mjs <photo>');

const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const N = W * H;

// Background colour = median of the border pixels.
const border = [];
for (let x = 0; x < W; x++) border.push(x, (H - 1) * W + x);
for (let y = 0; y < H; y++) border.push(y * W, y * W + W - 1);
const med = (c) => border.map((p) => data[p * 3 + c]).sort((a, b) => a - b)[border.length >> 1];
const bg = [med(0), med(1), med(2)];

const dist = new Float32Array(N);
for (let p = 0; p < N; p++) {
  dist[p] = Math.max(Math.abs(data[p * 3] - bg[0]), Math.abs(data[p * 3 + 1] - bg[1]), Math.abs(data[p * 3 + 2] - bg[2]));
}

// Flood fill the background from the border through pixels close to the background colour.
const REACH = 34; // how different a pixel may be and still count as background
const SOLID = 10; // below this it is fully transparent
const isBg = new Uint8Array(N);
const stack = border.filter((p) => dist[p] < REACH);
for (const p of stack) isBg[p] = 1;
while (stack.length) {
  const p = stack.pop();
  const x = p % W, y = (p / W) | 0;
  for (const q of [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, y > 0 ? p - W : -1, y < H - 1 ? p + W : -1]) {
    if (q >= 0 && !isBg[q] && dist[q] < REACH) {
      isBg[q] = 1;
      stack.push(q);
    }
  }
}

// Soft alpha across the fringe, then erode 1px so no light halo survives on a dark page.
let alpha = new Uint8Array(N);
for (let p = 0; p < N; p++) {
  alpha[p] = !isBg[p] ? 255 : dist[p] <= SOLID ? 0 : Math.round(((dist[p] - SOLID) / (REACH - SOLID)) * 255);
}
const eroded = new Uint8Array(N);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    let m = 255;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const xx = Math.min(W - 1, Math.max(0, x + dx)), yy = Math.min(H - 1, Math.max(0, y + dy));
      m = Math.min(m, alpha[yy * W + xx]);
    }
    eroded[y * W + x] = m;
  }
}
alpha = eroded;

const rgba = Buffer.alloc(N * 4);
for (let p = 0; p < N; p++) {
  rgba[p * 4] = data[p * 3];
  rgba[p * 4 + 1] = data[p * 3 + 1];
  rgba[p * 4 + 2] = data[p * 3 + 2];
  rgba[p * 4 + 3] = alpha[p];
}
await sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).png().toFile('pic.png');
await sharp(src).removeAlpha().jpeg({ quality: 95 }).toFile('pic1.jpeg');

const kept = alpha.reduce((n, a) => n + (a > 0 ? 1 : 0), 0);
console.log(`background rgb(${bg.join(',')}) · subject ${(100 * kept / N).toFixed(1)}% of frame · wrote pic.png + pic1.jpeg`);
