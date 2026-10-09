// Temporary stand-in until a real photo is added (see README → Photo).
// Draws a head-and-shoulders silhouette with a crimson rim light and writes the same
// files build-images.mjs produces, so the site looks finished in the meantime.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const OUT = 'public/assets';
mkdirSync(OUT, { recursive: true });

const W = 1100, H = 1034;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 1100 1034">
  <defs>
    <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2a2a33"/><stop offset="1" stop-color="#0d0d12"/>
    </linearGradient>
    <linearGradient id="rim" x1="1" y1="0" x2="0" y2="0">
      <stop offset="0" stop-color="#ff3d5a" stop-opacity="0.95"/><stop offset="0.5" stop-color="#ff3d5a" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <g id="s">
    <ellipse cx="550" cy="360" rx="168" ry="205"/>
    <path d="M470 540 h160 l14 90 h-188 z"/>
    <path d="M140 1034 C150 800 260 690 430 650 C480 640 500 628 550 628 C600 628 620 640 670 650 C840 690 950 800 960 1034 Z"/>
  </g>
  <use href="#s" fill="url(#body)"/>
  <use href="#s" fill="none" stroke="url(#rim)" stroke-width="10"/>
  <text x="550" y="900" text-anchor="middle" font-family="Impact, 'Arial Narrow', sans-serif" font-size="150" fill="#e5132b" fill-opacity="0.85" letter-spacing="8">JS</text>
</svg>`;

const cutout = await sharp(Buffer.from(svg)).png().toBuffer();
for (const w of [1100, 720, 420]) {
  await sharp(cutout).resize({ width: w }).webp({ quality: 86, alphaQuality: 90 }).toFile(`${OUT}/portrait-${w}.webp`);
}

const portrait = await sharp(cutout).resize({ height: 600 }).png().toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: '#07070a' } })
  .composite([
    {
      input: Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs><radialGradient id="g" cx="78%" cy="45%" r="45%"><stop offset="0" stop-color="#e5132b" stop-opacity="0.45"/><stop offset="1" stop-color="#e5132b" stop-opacity="0"/></radialGradient></defs>
        <rect width="1200" height="630" fill="url(#g)"/>
      </svg>`),
    },
    { input: portrait, gravity: 'southeast' },
    {
      input: Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <text x="72" y="300" font-family="Impact, 'Arial Narrow', sans-serif" font-size="128" fill="#f4f1ec" letter-spacing="4">JITENDRA</text>
        <text x="78" y="352" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="26" fill="#ff3d5a" letter-spacing="16">THE SERIES</text>
        <text x="78" y="420" font-family="Helvetica, Arial, sans-serif" font-weight="600" font-size="18" fill="#a7a6ad" letter-spacing="5">AI AUTOMATION ENGINEER • BACKEND • AI AGENTS</text>
      </svg>`),
    },
  ])
  .jpeg({ quality: 85 })
  .toFile(`${OUT}/og-image.jpg`);
console.log('placeholder images built');
