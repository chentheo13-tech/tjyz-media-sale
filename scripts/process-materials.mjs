/**
 * 素材处理脚本：
 * 1. 原图全部归档到 assets-original/（保留中文文件名，永不覆盖）
 * 2. 按"文件名 → 商品"严格映射，转 WebP 写入 public/images/...
 *    - 保持原始宽高比，绝不裁切 / 拉伸
 *    - 长边超过 1600px 的等比缩小（大图 6144px 统一到 1200px 展示尺寸）
 *    - 二维码保持原始尺寸（清晰可扫）
 * 3. 清理旧占位图，避免新旧混用
 */
import sharp from "sharp";
import { copyFileSync, mkdirSync, readdirSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC = "/Users/dongwei/Documents/DeepSeek/SCMC/素材";
const ORIG = join(ROOT, "assets-original");
const PUB = join(ROOT, "public", "images");

/* 原图归档 */
mkdirSync(ORIG, { recursive: true });
for (const f of readdirSync(SRC)) {
  if (f.startsWith(".")) continue;
  copyFileSync(join(SRC, f), join(ORIG, f));
  console.log(`归档原图 ✓ ${f}`);
}

const src = (f) => join(SRC, f);
const out = (p) => join(PUB, p);

/** 转 webp：等比、不裁切；maxLong 控制长边 */
async function convert(input, outputPath, maxLong = 1200, quality = 82) {
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
  /* ---------- 单品 ---------- */
  { from: src("板夹（单价21）.jpg"), to: out("products/clipboard/cover.webp") },
  { from: src("冲锋衣样张1（价格189）.jpg"), to: out("products/jacket/cover.webp"), maxLong: 1600 },
  { from: src("帆布包大容量（改名红织带帆布托特）.jpg"), to: out("products/canvas-bag/cover.webp") },
  { from: src("拼皮两用托特（单价59.9）.jpg"), to: out("products/leather-bag/01.webp"), maxLong: 1100 },
  { from: src("拼皮两用托特2.jpg"), to: out("products/leather-bag/02.webp"), maxLong: 1100 },
  { from: src("拼皮两用托特3.jpg"), to: out("products/leather-bag/03.webp"), maxLong: 1100 },
  { from: src("挂件男款（单价8）.jpg"), to: out("products/keychain-boy/cover.webp") },
  { from: src("挂件女款（单价8）.jpg"), to: out("products/keychain-girl/cover.webp") },
  { from: src("挂件合集（仅展示产品）.jpg"), to: out("products/keychain-set/01.webp") },
  { from: src("挂件男女（不包括胸针单价14）.jpg"), to: out("products/keychain-set/02.webp"), maxLong: 1600 },
  { from: src("胸针（单价10）.jpg"), to: out("products/badge/cover.webp") },
  { from: src("光栅卡闪卡样张（单价6）.jpg"), to: out("products/flashcard/cover.webp"), maxLong: 1100 },
  { from: src("信纸（单价11）.png"), to: out("products/letter-paper/cover.webp"), maxLong: 1600 },
  { from: src("信纸板夹合卖（单价30）.jpg"), to: out("products/letter-clipboard-set/cover.webp"), maxLong: 1600 },
  { from: src("小夜灯样张（价格45）.jpg"), to: out("products/night-light/cover.webp"), maxLong: 1600 },
  { from: src("万年历样张（价格45）.jpg"), to: out("products/calendar/cover.webp"), maxLong: 1600 },

  /* ---------- 明信片 10 款 ---------- */
  { from: src("明信片1.jpg"), to: out("products/postcard/cards/card-01.webp") },
  { from: src("明信片2（学校内容）.jpg"), to: out("products/postcard/cards/card-02.webp") },
  { from: src("明信片3（天津特色）.jpg"), to: out("products/postcard/cards/card-03.webp") },
  { from: src("明信片4（学校内容）.jpg"), to: out("products/postcard/cards/card-04.webp") },
  { from: src("明信片5.jpg"), to: out("products/postcard/cards/card-05.webp") },
  { from: src("明信片6.jpg"), to: out("products/postcard/cards/card-06.webp") },
  { from: src("明信片7（学校特色）.jpg"), to: out("products/postcard/cards/card-07.webp") },
  { from: src("明信片8.jpg"), to: out("products/postcard/cards/card-08.webp") },
  { from: src("明信片9.jpg"), to: out("products/postcard/cards/card-09.webp") },
  { from: src("明信片10.jpg"), to: out("products/postcard/cards/card-10.webp") },
  { from: src("明信片大合集（总价23 单买3）.jpg"), to: out("products/postcard/collection-01.webp") },
  { from: src("明信片图合集.jpg"), to: out("products/postcard/collection-02.webp"), maxLong: 1600 },

  /* ---------- 书签 5 款 + 总样张 ---------- */
  { from: src("书签学校1.jpg"), to: out("products/bookmark/school-01.webp") },
  { from: src("书签学校2.jpg"), to: out("products/bookmark/school-02.webp") },
  { from: src("书签非学校内容1.jpg"), to: out("products/bookmark/non-01.webp") },
  { from: src("书签非学校内容2.jpg"), to: out("products/bookmark/non-02.webp") },
  { from: src("书签非学校样张3.jpg"), to: out("products/bookmark/non-03.webp") },
  { from: src("书签总样张（总价10元）.jpg"), to: out("products/bookmark/overview-01.webp") },
  { from: src("书签总样张2.jpg"), to: out("products/bookmark/overview-02.webp") },
  { from: src("书签总样张3.jpg"), to: out("products/bookmark/overview-03.webp"), maxLong: 1600 },

  /* ---------- 品牌 ---------- */
  { from: src("副社微信二维码加社长微信转账18512280901.jpg"), to: out("branding/qr-wechat.webp"), maxLong: 888, quality: 80 },
];

for (const j of jobs) {
  await convert(j.from, j.to, j.maxLong ?? 1200, j.quality ?? 82);
  console.log(`✓ ${j.to.replace(PUB + "/", "")}`);
}

/* 徽章：保持 PNG 原格式（品牌识别素材） */
{
  const badgeOut = out("branding/badge.png");
  mkdirSync(dirname(badgeOut), { recursive: true });
  await sharp(src("学生新媒体中心徽章.png"), { failOn: "none" })
    .resize({ width: 1024, height: 1024, fit: "inside", withoutEnlargement: true })
    .png()
    .toFile(badgeOut);
  console.log("✓ branding/badge.png（徽章，等比缩小）");
}

/* 清理旧占位图：删除已弃用的槽位文件 */
const cleanups = [
  "products/clipboard/01.webp", "products/clipboard/02.webp", "products/clipboard/03.webp",
  "products/clipboard/detail-01.webp", "products/clipboard/detail-02.webp",
  "products/jacket/01.webp", "products/jacket/02.webp", "products/jacket/03.webp",
  "products/jacket/detail-01.webp", "products/jacket/detail-02.webp",
  "products/canvas-bag/01.webp", "products/canvas-bag/02.webp", "products/canvas-bag/03.webp",
  "products/canvas-bag/detail-01.webp", "products/canvas-bag/detail-02.webp",
  "products/leather-bag/cover.webp", "products/leather-bag/detail-01.webp", "products/leather-bag/detail-02.webp",
  "products/keychain-boy/01.webp", "products/keychain-boy/02.webp", "products/keychain-boy/03.webp",
  "products/keychain-boy/detail-01.webp", "products/keychain-boy/detail-02.webp",
  "products/keychain-girl/01.webp", "products/keychain-girl/02.webp", "products/keychain-girl/03.webp",
  "products/keychain-girl/detail-01.webp", "products/keychain-girl/detail-02.webp",
  "products/badge/01.webp", "products/badge/02.webp", "products/badge/03.webp",
  "products/badge/detail-01.webp", "products/badge/detail-02.webp",
  "products/flashcard/01.webp", "products/flashcard/02.webp", "products/flashcard/03.webp",
  "products/flashcard/detail-01.webp", "products/flashcard/detail-02.webp",
  "products/letter-paper/01.webp", "products/letter-paper/02.webp", "products/letter-paper/03.webp",
  "products/letter-paper/detail-01.webp", "products/letter-paper/detail-02.webp",
  "products/night-light/01.webp", "products/night-light/02.webp", "products/night-light/03.webp",
  "products/night-light/detail-01.webp", "products/night-light/detail-02.webp",
  "products/calendar/01.webp", "products/calendar/02.webp", "products/calendar/03.webp",
  "products/calendar/detail-01.webp", "products/calendar/detail-02.webp",
  "products/postcard/cover.webp", "products/postcard/01.webp", "products/postcard/02.webp",
  "products/postcard/03.webp", "products/postcard/detail-01.webp", "products/postcard/detail-02.webp",
  "products/bookmark/cover.webp", "products/bookmark/bm-01.webp", "products/bookmark/bm-02.webp",
  "products/bookmark/bm-03.webp", "products/bookmark/bm-04.webp", "products/bookmark/bm-05.webp",
];
for (const c of cleanups) {
  const p = join(PUB, c);
  if (existsSync(p)) { rmSync(p); console.log(`清理旧占位 ✓ ${c}`); }
}

console.log("\n完成：原图已归档 assets-original/，WebP 已写入 public/images/。");
console.log("说明：1.png 未识别对应商品，仅归档未使用。");

/* ---------- 缩略图（缩略条专用，320px） ---------- */
const THUMBS = [
  ...Array.from({ length: 10 }, (_, i) => ({
    from: join(PUB, `products/postcard/cards/card-${String(i + 1).padStart(2, "0")}.webp`),
    to: join(PUB, `products/postcard/cards/thumb-${String(i + 1).padStart(2, "0")}.webp`),
  })),
  { from: join(PUB, "products/bookmark/school-01.webp"), to: join(PUB, "products/bookmark/thumb-school-01.webp") },
  { from: join(PUB, "products/bookmark/school-02.webp"), to: join(PUB, "products/bookmark/thumb-school-02.webp") },
  { from: join(PUB, "products/bookmark/non-01.webp"), to: join(PUB, "products/bookmark/thumb-non-01.webp") },
  { from: join(PUB, "products/bookmark/non-02.webp"), to: join(PUB, "products/bookmark/thumb-non-02.webp") },
  { from: join(PUB, "products/bookmark/non-03.webp"), to: join(PUB, "products/bookmark/thumb-non-03.webp") },
  { from: join(PUB, "products/leather-bag/01.webp"), to: join(PUB, "products/leather-bag/thumb-01.webp") },
  { from: join(PUB, "products/leather-bag/02.webp"), to: join(PUB, "products/leather-bag/thumb-02.webp") },
  { from: join(PUB, "products/leather-bag/03.webp"), to: join(PUB, "products/leather-bag/thumb-03.webp") },
];
for (const t of THUMBS) {
  await sharp(t.from).resize({ width: 320, withoutEnlargement: true }).webp({ quality: 75 }).toFile(t.to);
  console.log(`✓ thumb ${t.to.replace(PUB + "/", "")}`);
}
