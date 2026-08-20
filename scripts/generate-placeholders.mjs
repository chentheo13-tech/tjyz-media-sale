/**
 * 生成义卖产品占位图（WebP）
 * ------------------------------------------------------------
 * 原始产品照片尚未提供。本脚本为每个产品生成统一的"影像占位图"，
 * 写入 public/images/products/<id>/ 下，文件名与 products.ts 中
 * 约定的图片路径完全一致。
 *
 * 后续拿到真实产品照片后，只需用同名文件覆盖（保持 .webp 后缀），
 * 网站无需改动任何代码即可显示真实图片。
 *
 * 占位图设计：展览式灰阶底 + 取景框角标 + 帧号 + 产品编号 + REC 圆点，
 * 与整站"新媒体 / 影像展览"视觉语言一致。
 *
 * 运行：npm run assets:placeholders
 */
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "images", "products");

/* 每个产品需要生成的图片槽位：文件名 -> 画幅（宽x高） */
const SLOTS = {
  cover: [1600, 2000], // 封面 4:5
  "01": [1600, 2000],
  "02": [1600, 1200], // 横向场景
  "03": [1600, 2000],
  "detail-01": [1600, 1200], // 细节特写
  "detail-02": [1600, 1200],
};

const PRODUCTS = {
  badge: { cn: "胸针", no: "SM-001", en: "BADGE" },
  "keychain-boy": { cn: "男生挂件", no: "SM-002", en: "KEYCHAIN BOY" },
  "keychain-girl": { cn: "女生挂件", no: "SM-003", en: "KEYCHAIN GIRL" },
  postcard: { cn: "明信片", no: "SM-004", en: "POSTCARD" },
  bookmark: { cn: "书签", no: "SM-005", en: "BOOKMARK" },
  flashcard: { cn: "闪卡", no: "SM-006", en: "FLASHCARD" },
  "letter-paper": { cn: "信纸", no: "SM-007", en: "LETTER PAPER" },
  clipboard: { cn: "板夹", no: "SM-008", en: "CLIPBOARD" },
  "canvas-bag": { cn: "帆布包", no: "SM-009", en: "CANVAS BAG" },
  "leather-bag": { cn: "皮包", no: "SM-010", en: "LEATHER BAG" },
  "night-light": { cn: "小夜灯", no: "SM-011", en: "NIGHT LIGHT" },
  calendar: { cn: "万年历", no: "SM-012", en: "CALENDAR" },
  jacket: { cn: "冲锋衣", no: "SM-013", en: "JACKET" },
};

/* 每个产品的占位底色（低饱和，克制） */
const TINTS = {
  badge: "#20242b",
  "keychain-boy": "#232a33",
  "keychain-girl": "#2b2327",
  postcard: "#252823",
  bookmark: "#262420",
  flashcard: "#24222b",
  "letter-paper": "#232622",
  clipboard: "#26221e",
  "canvas-bag": "#20241f",
  "leather-bag": "#262019",
  "night-light": "#151820",
  calendar: "#211f26",
  jacket: "#1e232a",
};

const es = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** 生成一张 SVG 占位图 */
function svgPlaceholder({ w, h, cn, en, no, tint, index, total }) {
  const fs = Math.min(w, h) * 0.085; // 基础字号
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${tint}"/>
      <stop offset="1" stop-color="#0b0b0e"/>
    </linearGradient>
    <radialGradient id="halo" cx="0.5" cy="0.42" r="0.75">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.14"/>
      <stop offset="0.55" stop-color="#ffffff" stop-opacity="0.03"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grain" width="3" height="3" patternUnits="userSpaceOnUse">
      <rect width="3" height="3" fill="none"/>
      <rect x="1" y="1" width="1" height="1" fill="#ffffff" fill-opacity="0.02"/>
      <rect x="2" y="2" width="1" height="1" fill="#000000" fill-opacity="0.04"/>
    </pattern>
    <pattern id="scan" width="100%" height="4" patternUnits="userSpaceOnUse">
      <rect width="100%" height="1" fill="#ffffff" fill-opacity="0.025"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#halo)"/>
  <rect width="${w}" height="${h}" fill="url(#scan)"/>
  <rect width="${w}" height="${h}" fill="url(#grain)"/>

  <!-- 取景框 -->
  <g stroke="#ffffff" stroke-opacity="0.32" stroke-width="${Math.max(2, w * 0.0015)}" fill="none">
    <rect x="${w * 0.055}" y="${h * 0.05}" width="${w * 0.89}" height="${h * 0.9}"/>
    <line x1="${w * 0.5}" y1="${h * 0.05}" x2="${w * 0.5}" y2="${h * 0.95}" stroke-opacity="0.12"/>
    <line x1="${w * 0.055}" y1="${h * 0.5}" x2="${w * 0.945}" y2="${h * 0.5}" stroke-opacity="0.12"/>
    <rect x="${w * 0.42}" y="${h * 0.385}" width="${w * 0.16}" height="${h * 0.23}" stroke-opacity="0.5" stroke-width="${Math.max(1.5, w * 0.001)}"/>
    <line x1="${w * 0.42}" y1="${h * 0.385}" x2="${w * 0.58}" y2="${h * 0.615}" stroke-opacity="0.22"/>
    <line x1="${w * 0.58}" y1="${h * 0.385}" x2="${w * 0.42}" y2="${h * 0.615}" stroke-opacity="0.22"/>
  </g>

  <!-- 主体文字 -->
  <g text-anchor="middle" fill="#f4f1ea" font-family="'PingFang SC','Microsoft YaHei',sans-serif">
    <text x="${w * 0.5}" y="${h * 0.5 - fs * 0.15}" font-size="${fs}" font-weight="600" letter-spacing="${fs * 0.18}">${es(cn)}</text>
    <text x="${w * 0.5}" y="${h * 0.5 + fs * 1.05}" font-size="${fs * 0.3}" letter-spacing="${fs * 0.3}" fill="#f4f1ea" fill-opacity="0.55" font-family="'Courier New',monospace">${es(en)}</text>
    <text x="${w * 0.5}" y="${h * 0.5 + fs * 1.75}" font-size="${fs * 0.21}" letter-spacing="${fs * 0.12}" fill="#f4f1ea" fill-opacity="0.38" font-family="'Courier New',monospace">图片待替换 · REPLACE ME</text>
  </g>

  <!-- 信息条 -->
  <g fill="#f4f1ea" font-family="'Courier New',monospace" font-size="${Math.max(11, fs * 0.16)}">
    <text x="${w * 0.058}" y="${h * 0.958}">${es(no)}</text>
    <text x="${w * 0.5}" y="${h * 0.958}" text-anchor="middle" fill-opacity="0.45">FRAME ${String(index).padStart(2, "0")} / ${total}</text>
    <circle cx="${w * 0.928}" cy="${h * 0.953}" r="${fs * 0.07}" fill="#ff4d2e"/>
    <text x="${w * 0.942}" y="${h * 0.958}">REC</text>
  </g>
</svg>`;
}

const totalPerProduct = Object.keys(SLOTS).length;

for (const [id, meta] of Object.entries(PRODUCTS)) {
  let i = 0;
  for (const [slot, [w, h]] of Object.entries(SLOTS)) {
    i += 1;
    const svg = svgPlaceholder({
      w,
      h,
      cn: meta.cn,
      en: meta.en,
      no: meta.no,
      tint: TINTS[id],
      index: i,
      total: totalPerProduct,
    });
    const out = join(OUT, id, `${slot}.webp`);
    mkdirSync(dirname(out), { recursive: true });
    // 注意：不要传 density 选项，libvips 会走极慢的渲染路径（单图 ~19s）
    // eslint-disable-next-line no-await-in-loop
    await sharp(Buffer.from(svg)).webp({ quality: 82 }).toFile(out);
    console.log(`✓ ${out.replace(OUT + "/", "")}`);
  }
}

console.log("\n完成：13 个产品 × 6 个槽位 = 78 张占位图。");
console.log("拿到真实照片后，用同名 .webp 文件覆盖即可，无需改代码。");
