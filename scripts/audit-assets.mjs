/**
 * STEP 11-12 资产审计：
 * 1) 13 个产品是否全部有数据与目录
 * 2) products.ts / site.ts / 组件 引用的每个图片路径是否真实存在于 public/
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const pub = (p) => join(ROOT, "public", p);

/* 产品 id（排除分类 id） */
const productsSrc = readFileSync(join(ROOT, "src/data/products.ts"), "utf8");
const categoryIds = ["all", "apparel", "practical", "accessory", "paper", "bundle"];
const allIds = [...productsSrc.matchAll(/id: "([a-z-]+)",/g)].map((m) => m[1]);
const ids = allIds.filter((i) => !categoryIds.includes(i));
console.log(`产品总数: ${ids.length}`);
console.log(ids.join(", "));
if (ids.length !== 17) console.log("⚠ 产品数不是 17！");

/* 扫描源码中的静态图片引用 */
const walk = (d, out = []) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(tsx?|ts)$/.test(e.name)) out.push(readFileSync(p, "utf8"));
  }
  return out;
};
const sources = [
  readFileSync(join(ROOT, "src/data/products.ts"), "utf8"),
  readFileSync(join(ROOT, "src/data/site.ts"), "utf8"),
  ...walk(join(ROOT, "src/components")),
  readFileSync(join(ROOT, "src/App.tsx"), "utf8"),
];
const refs = new Set();
for (const t of sources) {
  for (const m of t.matchAll(/\/images\/[a-zA-Z0-9/\-_.]+\.(?:webp|svg|png|jpg|avif)/g)) refs.add(m[0]);
}

/* 按命名约定生成的图片路径也要核对（真实素材版） */
const productSlots = {
  clipboard: ["cover"], jacket: ["cover"], "canvas-bag": ["cover"],
  "leather-bag": ["01", "02", "03", "thumb-01", "thumb-02", "thumb-03"],
  "keychain-boy": ["cover"], "keychain-girl": ["cover"],
  "keychain-set": ["01", "02"], badge: ["cover"],
  "night-light": ["cover"], calendar: ["cover"],
  "letter-paper": ["cover"], "letter-clipboard-set": ["cover"], flashcard: ["cover"],
};
for (const [id, slots] of Object.entries(productSlots)) {
  for (const s of slots) refs.add(`/images/products/${id}/${s}.webp`);
}
for (let i = 1; i <= 10; i++) {
  const n = String(i).padStart(2, "0");
  refs.add(`/images/products/postcard/cards/card-${n}.webp`);
  refs.add(`/images/products/postcard/cards/thumb-${n}.webp`);
}
refs.add("/images/products/postcard/collection-01.webp");
refs.add("/images/products/postcard/collection-02.webp");
for (const b of ["school-01", "school-02", "non-01", "non-02", "non-03"]) {
  refs.add(`/images/products/bookmark/${b}.webp`);
  refs.add(`/images/products/bookmark/thumb-${b}.webp`);
}
for (let i = 1; i <= 3; i++) refs.add(`/images/products/bookmark/overview-0${i}.webp`);
for (const s of ["qr-wechat", "qr-account"]) refs.add(`/images/branding/${s}.webp`);
refs.add("/images/branding/badge.png");
for (let i = 1; i <= 3; i++) refs.add(`/images/backgrounds/campus-0${i}.webp`);
for (const c of ["collab-choir", "collab-etiquette", "collab-album", "sale-goods"]) {
  refs.add(`/images/branding/${c}.webp`);
}

let missing = 0;
const list = [...refs].sort();
for (const r of list) {
  if (!existsSync(pub(r))) { missing++; console.log(`  ✗ 缺失: ${r}`); }
}
console.log(`\n核对路径 ${list.length} 条，缺失 ${missing} 条 ${missing === 0 ? "✓ 全部通过" : ""}`);

console.log("\n产品目录核对:");
let dirFail = 0;
/* 套装商品的图片存放在单品目录（postcard/、bookmark/） */
const hasOwnDir = ids.filter((id) => !["postcard-set", "bookmark-set"].includes(id));
for (const id of hasOwnDir) {
  const dir = pub(`images/products/${id}`);
  if (!existsSync(dir)) { dirFail++; console.log(`  ✗ ${id}: 目录不存在`); }
}
console.log(dirFail === 0 ? `  ${hasOwnDir.length} 个商品目录全部存在（2 个套装共用单品目录）✓` : `  ${dirFail} 个目录缺失`);

/* public/images 文件总数 */
let count = 0;
const countWalk = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    if (e.isDirectory()) countWalk(join(d, e.name)); else count++;
  }
};
countWalk(pub("images"));
console.log(`\npublic/images 文件总数: ${count}`);
