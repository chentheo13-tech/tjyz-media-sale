/**
 * V2 素材占位图：
 * 1. 明信片 10 张（校园风景 ×2 影像帧风格 / 设计款 ×8 排版风格）
 * 2. 书签 5 款
 * 3. 二维码位（社长微信 / 社团账号 / 义卖详情）
 * 全部为占位图，真实图片到位后用同名文件覆盖。
 */
import sharp from "sharp";
import { mkdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "images");

const es = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ---------- 明信片：校园风景（影像帧风格） ---------- */
function campusCardSvg({ label, no, tint, w = 1200, h = 1600 }) {
  const fs = 64;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${tint}"/>
      <stop offset="0.75" stop-color="#101116"/>
      <stop offset="1" stop-color="#0b0b0e"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#sky)"/>
  <circle cx="${w * 0.68}" cy="${h * 0.2}" r="${w * 0.09}" fill="#f2efe6" fill-opacity="0.14"/>
  <g fill="#ffffff">
    <rect x="${w * 0.08}" y="${h * 0.62}" width="${w * 0.84}" height="${h * 0.3}" fill-opacity="0.05"/>
    <rect x="${w * 0.10}" y="${h * 0.55}" width="${w * 0.16}" height="${h * 0.2}" fill-opacity="0.08"/>
    <rect x="${w * 0.30}" y="${h * 0.48}" width="${w * 0.2}" height="${h * 0.28}" fill-opacity="0.07"/>
    <rect x="${w * 0.55}" y="${h * 0.58}" width="${w * 0.17}" height="${h * 0.18}" fill-opacity="0.09"/>
    <rect x="${w * 0.76}" y="${h * 0.5}" width="${w * 0.14}" height="${h * 0.24}" fill-opacity="0.06"/>
  </g>
  <g stroke="#f2efe6" stroke-opacity="0.35" stroke-width="2" fill="none">
    <rect x="36" y="32" width="${w - 72}" height="${h - 64}"/>
    <line x1="${w / 2}" y1="32" x2="${w / 2}" y2="${h - 32}" stroke-opacity="0.1"/>
    <line x1="36" y1="${h / 2}" x2="${w - 36}" y2="${h / 2}" stroke-opacity="0.1"/>
    <rect x="${w * 0.42}" y="${h * 0.4}" width="${w * 0.16}" height="${h * 0.12}" stroke-opacity="0.5"/>
  </g>
  <g text-anchor="middle" fill="#f2efe6" font-family="'PingFang SC','Microsoft YaHei',sans-serif">
    <text x="${w / 2}" y="${h / 2 - 20}" font-size="${fs}" letter-spacing="10">${es(label)}</text>
    <text x="${w / 2}" y="${h / 2 + 44}" font-size="26" letter-spacing="6" fill-opacity="0.55" font-family="'Courier New',monospace">校园风景明信片 · 占位图</text>
    <text x="${w / 2}" y="${h / 2 + 86}" font-size="22" letter-spacing="3" fill-opacity="0.4" font-family="'Courier New',monospace">待真实照片替换</text>
  </g>
  <g fill="#f2efe6" font-family="'Courier New',monospace" font-size="24">
    <text x="56" y="${h - 44}">${es(no)}</text>
    <circle cx="${w - 60}" cy="${h - 52}" r="8" fill="#ff4d2e"/>
    <text x="${w - 42}" y="${h - 44}">REC</text>
  </g>
</svg>`;
}

/* ---------- 明信片：设计款（排版风格） ---------- */
function designCardSvg({ label, no, tint, w = 1200, h = 1600 }) {
  const fs = 72;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${tint}"/>
      <stop offset="1" stop-color="#0b0b0e"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <g stroke="#f2efe6" stroke-opacity="0.28" stroke-width="2" fill="none">
    <rect x="44" y="44" width="${w - 88}" height="${h - 88}"/>
    <line x1="44" y1="${h * 0.28}" x2="${w - 44}" y2="${h * 0.28}" stroke-opacity="0.16"/>
  </g>
  <g text-anchor="middle" fill="#f2efe6" font-family="'PingFang SC','Microsoft YaHei',sans-serif">
    <text x="${w / 2}" y="${h * 0.16}" font-size="30" letter-spacing="12" fill-opacity="0.55">SCMC POSTCARD</text>
    <text x="${w / 2}" y="${h * 0.5 + 12}" font-size="${fs}" letter-spacing="10">${es(label)}</text>
    <text x="${w / 2}" y="${h * 0.62 + 10}" font-size="24" letter-spacing="4" fill-opacity="0.5" font-family="'Courier New',monospace">设计款明信片 · 占位图</text>
    <text x="${w / 2}" y="${h * 0.62 + 52}" font-size="20" letter-spacing="2" fill-opacity="0.38" font-family="'Courier New',monospace">待真实图片替换</text>
  </g>
  <g font-family="'Courier New',monospace" fill="#f2efe6">
    <text x="64" y="${h - 52}" font-size="24">${es(no)}</text>
    <circle cx="${w - 68}" cy="${h - 60}" r="8" fill="#ff4d2e"/>
    <text x="${w - 50}" y="${h - 52}" font-size="24">REC</text>
  </g>
</svg>`;
}

/* ---------- 书签（窄长） ---------- */
function bookmarkSvg({ label, no, tint, w = 900, h = 1500 }) {
  const fs = 64;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${tint}"/>
      <stop offset="1" stop-color="#0b0b0e"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <g stroke="#f2efe6" stroke-opacity="0.3" stroke-width="2" fill="none">
    <rect x="28" y="28" width="${w - 56}" height="${h - 56}"/>
  </g>
  <g text-anchor="middle" fill="#f2efe6" font-family="'PingFang SC','Microsoft YaHei',sans-serif">
    <text x="${w / 2}" y="${h / 2 - 6}" font-size="${fs}" letter-spacing="6">${es(label)}</text>
    <text x="${w / 2}" y="${h / 2 + 44}" font-size="22" letter-spacing="4" fill-opacity="0.5" font-family="'Courier New',monospace">书签 · 占位图</text>
    <text x="${w / 2}" y="${h / 2 + 84}" font-size="18" letter-spacing="2" fill-opacity="0.38" font-family="'Courier New',monospace">待真实图片替换</text>
  </g>
  <g font-family="'Courier New',monospace" fill="#f2efe6" font-size="20">
    <text x="44" y="${h - 40}">${es(no)}</text>
    <circle cx="${w - 52}" cy="${h - 48}" r="7" fill="#ff4d2e"/>
  </g>
</svg>`;
}

/* ---------- 二维码占位 ---------- */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
function qrSvg(label, seed, dark = "#0b0b0e", light = "#f2efe6") {
  const n = 29;
  const cell = 24;
  const pad = 4;
  const size = (n + pad * 2) * cell;
  const rand = rng(seed);
  let cells = "";
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const inFinder =
        (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8);
      if (!inFinder && rand() > 0.52) {
        cells += `<rect x="${(x + pad) * cell}" y="${(y + pad) * cell}" width="${cell}" height="${cell}"/>`;
      }
    }
  }
  const finder = (fx, fy) => `
    <g fill="${dark}">
      <rect x="${(fx + pad) * cell}" y="${(fy + pad) * cell}" width="${7 * cell}" height="${7 * cell}"/>
      <rect x="${(fx + pad + 1) * cell}" y="${(fy + pad + 1) * cell}" width="${5 * cell}" height="${5 * cell}" fill="${light}"/>
      <rect x="${(fx + pad + 2) * cell}" y="${(fy + pad + 2) * cell}" width="${3 * cell}" height="${3 * cell}"/>
    </g>`;
  const fs = cell * 2.2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size + 2 * cell * 4}" height="${size + 2 * cell * 4 + fs * 1.9}" viewBox="0 0 ${size + 2 * cell * 4} ${size + 2 * cell * 4 + fs * 1.9}">
  <rect width="100%" height="100%" fill="${light}"/>
  <g transform="translate(${cell * 3},${cell * 3})">
    <rect x="${-cell * 2}" y="${-cell * 2}" width="${size + cell * 4}" height="${size + cell * 4}" fill="${light}"/>
    <g fill="${dark}">${cells}</g>
    ${finder(0, 0)}${finder(n - 7, 0)}${finder(0, n - 7)}
  </g>
  <text x="${(size + 2 * cell * 4) / 2}" y="${size + 2 * cell * 3 + cell * 2 + fs * 0.9}" text-anchor="middle" font-family="'PingFang SC','Microsoft YaHei',sans-serif" font-size="${fs}" letter-spacing="${fs * 0.2}" fill="${dark}">${label}</text>
</svg>`;
}

const jobs = [];
/* 明信片 10 张 */
jobs.push({ file: "products/postcard/cards/card-01.webp", svg: campusCardSvg({ label: "校园风景 01", no: "PC-01", tint: "#1d2330" }) });
jobs.push({ file: "products/postcard/cards/card-02.webp", svg: campusCardSvg({ label: "校园风景 02", no: "PC-02", tint: "#24211c" }) });
const designTints = ["#20242b", "#232a33", "#2b2327", "#252823", "#262420", "#24222b", "#232622", "#262019"];
for (let i = 0; i < 8; i++) {
  jobs.push({
    file: `products/postcard/cards/card-${String(i + 3).padStart(2, "0")}.webp`,
    svg: designCardSvg({ label: `设计款 0${i + 1}`, no: `PC-${String(i + 3).padStart(2, "0")}`, tint: designTints[i] }),
  });
}
/* 书签 5 款 */
const bmTints = ["#23262b", "#2b2520", "#252028", "#1f2429", "#292220"];
for (let i = 0; i < 5; i++) {
  jobs.push({
    file: `products/bookmark/bm-0${i + 1}.webp`,
    svg: bookmarkSvg({ label: `书签 0${i + 1}`, no: `BM-0${i + 1}`, tint: bmTints[i] }),
  });
}
/* 二维码位 */
jobs.push({ file: "branding/qr-wechat.webp", svg: qrSvg("社长微信", 202611) });
jobs.push({ file: "branding/qr-account.webp", svg: qrSvg("社团账号", 202612) });
jobs.push({ file: "branding/qr-info.webp", svg: qrSvg("义卖详情", 202613) });

/* 删除旧二维码位（已被新命名取代） */
for (const old of ["branding/qr-sale.webp", "branding/qr-location.webp"]) {
  rmSync(join(OUT, old), { force: true });
  console.log(`✗ 移除旧文件: ${old}`);
}

for (const job of jobs) {
  const out = join(OUT, job.file);
  mkdirSync(dirname(out), { recursive: true });
  await sharp(Buffer.from(job.svg)).webp({ quality: 84 }).toFile(out);
  console.log(`✓ ${job.file}`);
}
console.log(`\n完成：明信片 ${10} 张、书签 ${5} 款、二维码位 ${3} 张。`);
