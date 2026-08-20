/**
 * 生成品牌位图：义卖二维码位（3 张）+ 校园影像帧（4 张）
 * 均为占位图，后续用真实文件同名覆盖即可。
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "images");

/** 伪随机数（固定种子，保证每次生成一致） */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** 生成一张"二维码样式"占位 SVG（三定位角 + 伪随机点阵，不可扫，仅占位） */
function qrSvg(label, seed, dark = "#0b0b0e", light = "#f2efe6") {
  const n = 29;
  const cell = 24;
  const pad = 4;
  const size = (n + pad * 2) * cell;
  const rand = rng(seed);
  let cells = "";
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      // 三个定位角留白
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

/** 生成校园影像帧占位（16:9，带取景框与帧号） */
function campusSvg(label, no, tint, seed) {
  const w = 1600;
  const h = 900;
  const rand = rng(seed);
  // 随机天空楼宇轮廓
  let blocks = "";
  for (let i = 0; i < 14; i++) {
    const bw = 60 + rand() * 140;
    const bh = 120 + rand() * 420;
    const bx = i * 120 - 40;
    blocks += `<rect x="${bx}" y="${h * 0.72 - bh}" width="${bw}" height="${bh}" fill="#ffffff" fill-opacity="${0.05 + rand() * 0.07}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${tint}"/>
      <stop offset="1" stop-color="#0b0b0e"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#sky)"/>
  <circle cx="${w * 0.72}" cy="${h * 0.3}" r="${h * 0.09}" fill="#f2efe6" fill-opacity="0.16"/>
  ${blocks}
  <g stroke="#f2efe6" stroke-opacity="0.3" stroke-width="3" fill="none">
    <rect x="36" y="30" width="${w - 72}" height="${h - 60}"/>
    <line x1="${w / 2}" y1="30" x2="${w / 2}" y2="${h - 30}" stroke-opacity="0.12"/>
    <line x1="36" y1="${h / 2}" x2="${w - 36}" y2="${h / 2}" stroke-opacity="0.12"/>
  </g>
  <g font-family="'Courier New',monospace" fill="#f2efe6">
    <text x="52" y="${h - 46}" font-size="26" fill-opacity="0.8">${no}</text>
    <text x="${w / 2}" y="${h - 46}" text-anchor="middle" font-size="24" fill-opacity="0.5">${label} · 影像占位 · REPLACE ME</text>
    <circle cx="${w - 66}" cy="${h - 54}" r="9" fill="#ff4d2e"/>
    <text x="${w - 48}" y="${h - 46}" font-size="24">REC</text>
  </g>
</svg>`;
}

const jobs = [];

/* 1. 三张二维码占位（社长微信 / 社团账号 / 义卖详情） */
jobs.push(
  { file: "branding/qr-wechat.webp", svg: qrSvg("社长微信", 202611) },
  { file: "branding/qr-account.webp", svg: qrSvg("社团账号", 202612) },
  { file: "branding/qr-info.webp", svg: qrSvg("义卖详情", 202613) },
);

/* 2. 四张校园影像帧（关于我们区使用，待真实照片替换） */
const campus = [
  { label: "校园影像 01", no: "SCENE 01", tint: "#1d2330" },
  { label: "校园影像 02", no: "SCENE 02", tint: "#24211c" },
  { label: "校园影像 03", no: "SCENE 03", tint: "#181c26" },
  { label: "校园影像 04", no: "SCENE 04", tint: "#141a24" },
];
campus.forEach((c, i) => {
  jobs.push({ file: `backgrounds/campus-0${i + 1}.webp`, svg: campusSvg(c.label, c.no, c.tint, 777 + i) });
});

for (const job of jobs) {
  const out = join(OUT, job.file);
  mkdirSync(dirname(out), { recursive: true });
  await sharp(Buffer.from(job.svg)).webp({ quality: 84 }).toFile(out);
  console.log(`✓ ${job.file}`);
}
console.log("\n品牌占位图生成完毕（二维码位 3 张、校园帧 4 张）。");
