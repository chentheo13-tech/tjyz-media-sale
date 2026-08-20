/**
 * 素材补充处理（素材/素材补充）：
 * - 3 张真实校园风景 → backgrounds/campus-01..03
 * - 3 张联名合作视觉 → branding/collab-choir / collab-etiquette / collab-album
 * - 公众号二维码 → branding/qr-account（真实二维码）
 * - 义卖商品展示 → branding/sale-goods
 * 原图归档 assets-original/素材补充/
 */
import sharp from "sharp";
import { copyFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC = "/Users/dongwei/Documents/DeepSeek/SCMC/素材/素材补充";
const ORIG = join(ROOT, "assets-original", "素材补充");
const PUB = join(ROOT, "public", "images");

mkdirSync(ORIG, { recursive: true });
for (const f of ["歌艺社合作.jpg", "礼仪公关社合作.jpg", "原创专辑社合作.png", "公众号地址.jpeg", "校园风景展示1.jpg", "校园风景展示2.png", "校园风景展示3.jpg", "义卖商品展示.jpg"]) {
  copyFileSync(join(SRC, f), join(ORIG, f));
  console.log(`归档原图 ✓ ${f}`);
}

const out = (p) => join(PUB, p);
async function convert(input, outputPath, maxLong, quality = 84) {
  mkdirSync(dirname(outputPath), { recursive: true });
  const s = sharp(input, { failOn: "none" }).rotate();
  const meta = await s.metadata();
  const largest = Math.max(meta.width ?? 0, meta.height ?? 0);
  if (largest > maxLong) {
    s.resize({
      width: (meta.width ?? 0) >= (meta.height ?? 0) ? maxLong : undefined,
      height: (meta.height ?? 0) > (meta.width ?? 0) ? maxLong : undefined,
      fit: "inside",
      withoutEnlargement: true,
    });
  }
  await s.webp({ quality }).toFile(outputPath);
}

const jobs = [
  { from: "校园风景展示1.jpg", to: "backgrounds/campus-01.webp", max: 1600 },
  { from: "校园风景展示2.png", to: "backgrounds/campus-02.webp", max: 1600 },
  { from: "校园风景展示3.jpg", to: "backgrounds/campus-03.webp", max: 1600 },
  { from: "歌艺社合作.jpg", to: "branding/collab-choir.webp", max: 1400 },
  { from: "礼仪公关社合作.jpg", to: "branding/collab-etiquette.webp", max: 1400 },
  { from: "原创专辑社合作.png", to: "branding/collab-album.webp", max: 1400 },
  { from: "公众号地址.jpeg", to: "branding/qr-account.webp", max: 430, q: 80 },
  { from: "义卖商品展示.jpg", to: "branding/sale-goods.webp", max: 640, q: 85 },
];
for (const j of jobs) {
  await convert(join(SRC, j.from), out(j.to), j.max, j.q ?? 84);
  console.log(`✓ ${j.to}`);
}

/* 移除多余的第四张校园占位（真实照片共 3 张） */
const old4 = out("backgrounds/campus-04.webp");
if (existsSync(old4)) { rmSync(old4); console.log("清理 campus-04.webp"); }
console.log("\n素材补充处理完成。");
