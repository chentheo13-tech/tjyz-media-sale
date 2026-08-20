/**
 * SCMC-v2 第三轮回归（真实商品图 + 价格 + 套餐）
 * 需 v2 dev server :5174 + 系统 Edge
 */
import { chromium } from "playwright-core";
const EDGE = "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge";
const URL = process.env.SITE_URL ?? "http://localhost:5174/";

const browser = await chromium.launch({ executablePath: EDGE, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 200)));

await page.goto(URL, { waitUntil: "load" });
await page.waitForTimeout(2800);

const pass = (name, ok, extra = "") =>
  console.log(`${name}: ${ok ? "PASS" : "FAIL"}${extra ? ` (${extra})` : ""}`);

/* 1. 商品数量与价格 */
await page.evaluate(() => document.getElementById("products")?.scrollIntoView({ behavior: "instant" }));
await page.waitForTimeout(1500);
const cards = await page.evaluate(() =>
  Array.from(document.querySelectorAll("#products article")).map((a) => {
    const name = a.querySelector("h3")?.textContent?.trim() ?? "";
    /* 价格 = 信息栏中 ¥ 开头或"价格请咨询"的那一行 */
    const labels = Array.from(a.querySelectorAll("span")).map((x) => x.textContent?.trim() ?? "");
    const price = labels.find((t) => t.startsWith("¥") || t === "价格请咨询") ?? "";
    const badge = a.textContent?.includes("SET") ?? false;
    const img = a.querySelector("img");
    return { name, price, badge, fit: img ? getComputedStyle(img).objectFit : null };
  }),
);
const EXPECT = {
  "学生新媒体中心板夹": "¥21",
  "学生新媒体中心冲锋衣": "¥189",
  "学生新媒体中心大容量帆布托特包": "价格请咨询",
  "学生新媒体中心拼皮两用托特包": "¥59.9",
  "学生新媒体中心校园小夜灯": "¥45",
  "学生新媒体中心万年历": "¥45",
  "学生新媒体中心挂件 · 男款": "¥8",
  "学生新媒体中心挂件 · 女款": "¥8",
  "学生新媒体中心挂件 · 男女套装": "¥14",
  "学生新媒体中心胸针": "¥10",
  "学生新媒体中心系列明信片": "¥3/ 张",
  "校园明信片十张套装": "¥23",
  "学生新媒体中心系列书签": "¥2/ 张",
  "书签五张套装": "¥10",
  "学生新媒体中心信纸": "¥11",
  "学生新媒体中心光栅闪卡": "¥6",
  "信纸 × 板夹组合套餐": "¥30",
};
let priceOk = cards.length === 17;
for (const [name, price] of Object.entries(EXPECT)) {
  const c = cards.find((x) => x.name === name);
  if (!c) { priceOk = false; console.log(`  缺少商品: ${name}`); continue; }
  if (!c.price.includes(price)) { priceOk = false; console.log(`  价格不符: ${name} → "${c.price}" 应为 "${price}"`); }
}
pass("1. 17 商品价格", priceOk, `${cards.length} cards`);

/* 2. SET 角标数量 = 4 */
const setCount = cards.filter((c) => c.badge).length;
pass("2. SET 套餐角标", setCount === 4, `SET=${setCount}`);

/* 3. 图片 contain 不裁切 */
const containOk = cards.every((c) => c.fit === "contain");
pass("3. 商品图 object-fit:contain", containOk);

/* 4. 分类筛选 */
const counts = {};
for (const [label, expect] of [
  ["套餐", 4], ["挂件与饰品", 4], ["纸品文创", 6], ["校园穿戴", 1], ["包袋与实用品", 5], ["全部", 17],
]) {
  await page.locator("#products [role='tab']", { hasText: label }).click();
  await page.waitForTimeout(1100);
  counts[label] = await page.evaluate(() => document.querySelectorAll("#products article").length);
  if (label === "校园穿戴") {
    counts.lookbookApparel = await page.evaluate(() => !!document.querySelector("#lookbook"));
  }
  if (label === "套餐") {
    counts.lookbookBundle = await page.evaluate(() => !!document.querySelector("#lookbook"));
  }
  await page.waitForTimeout(300);
}
const catOk = Object.entries({ 套餐: 4, 挂件与饰品: 4, 纸品文创: 6, 校园穿戴: 1, 包袋与实用品: 5, 全部: 17 })
  .every(([k, v]) => counts[k] === v);
pass("4. 分类数量", catOk, JSON.stringify(counts));
pass("   lookbook 条件渲染", counts.lookbookApparel === true && counts.lookbookBundle === false,
  `apparel=${counts.lookbookApparel} bundle=${counts.lookbookBundle}`);

/* 5. 挂件套餐详情：¥14 不含胸针 */
await page.locator("#products [role='tab']", { hasText: "全部" }).click();
await page.waitForTimeout(1100);
await page.locator("#products article button[aria-label^='查看学生新媒体中心挂件 · 男女套装']").click();
await page.waitForTimeout(900);
const keySet = await page.evaluate(() => {
  const d = document.querySelector('[role="dialog"]');
  const t = d?.innerText ?? "";
  return { has14: t.includes("¥14"), noBadge: t.includes("不包含胸针"), bundle: t.includes("男款挂件 × 1") && t.includes("女款挂件 × 1") };
});
pass("5. 挂件套餐 ¥14/不含胸针", keySet.has14 && keySet.noBadge && keySet.bundle, JSON.stringify(keySet));
await page.keyboard.press("Escape");
await page.waitForTimeout(600);

/* 6. 信纸板夹套餐 ¥30 */
await page.locator("#products article button[aria-label^='查看信纸 × 板夹组合套餐']").click();
await page.waitForTimeout(900);
const lcSet = await page.evaluate(() => {
  const t = document.querySelector('[role="dialog"]')?.innerText ?? "";
  return { has30: t.includes("¥30"), has32: t.includes("单买合计 ¥32"), items: t.includes("信纸 × 1") && t.includes("板夹 × 1") };
});
pass("6. 信纸板夹套餐 ¥30", lcSet.has30 && lcSet.has32 && lcSet.items, JSON.stringify(lcSet));
await page.keyboard.press("Escape");
await page.waitForTimeout(600);

/* 7. 滚动位置恢复 */
const yBefore = await page.evaluate(() => {
  const el = document.getElementById("products");
  el?.scrollIntoView({ behavior: "instant" });
  return Math.round(window.scrollY);
});
await page.waitForTimeout(400);
await page.locator("#products article button").first().click();
await page.waitForTimeout(900);
await page.keyboard.press("Escape");
await page.waitForTimeout(800);
const yAfter = await page.evaluate(() => Math.round(window.scrollY));
pass("7. 返回后滚动位置", Math.abs(yAfter - yBefore) < 80, `${yBefore} -> ${yAfter}`);

/* 8. 明信片弹窗画廊 10 张 + 计价 */
await page.evaluate(() => document.getElementById("postcards")?.scrollIntoView({ behavior: "instant" }));
await page.waitForTimeout(900);
await page.locator("#postcards button", { hasText: "单张选购" }).click();
await page.waitForTimeout(900);
const pcModal = await page.evaluate(() => {
  const d = document.querySelector('[role="dialog"]');
  const thumbs = d?.querySelectorAll("button[aria-label^='查看第']").length ?? 0;
  const t = d?.innerText ?? "";
  return { thumbs, counter: /\/ 10/.test(t), price: t.includes("¥3/ 张") };
});
pass("8. 明信片详情 10 款", pcModal.thumbs >= 10 && pcModal.counter && pcModal.price, JSON.stringify(pcModal));
await page.keyboard.press("Escape");
await page.waitForTimeout(600);

/* 9. 书签弹窗 5 款 */
const bmBtn = page.locator("#products article button[aria-label^='查看学生新媒体中心系列书签']");
if ((await bmBtn.count()) > 0) {
  await page.evaluate(() => document.getElementById("products")?.scrollIntoView({ behavior: "instant" }));
  await page.waitForTimeout(600);
  await bmBtn.click();
  await page.waitForTimeout(900);
  const bmModal = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    const thumbs = d?.querySelectorAll("button[aria-label^='查看第']").length ?? 0;
    const t = d?.innerText ?? "";
    return { thumbs, counter: /\/ 05/.test(t), price: t.includes("¥2/ 张") };
  });
  pass("9. 书签详情 5 款", bmModal.thumbs >= 5 && bmModal.counter && bmModal.price, JSON.stringify(bmModal));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(600);
} else {
  pass("9. 书签详情 5 款", false, "按钮未找到");
}

/* 10. 拼皮托特 3 图轮播 */
await page.locator("#products article button[aria-label^='查看学生新媒体中心拼皮两用托特包']").click();
await page.waitForTimeout(900);
const tote = await page.evaluate(() => {
  const d = document.querySelector('[role="dialog"]');
  const thumbs = d?.querySelectorAll("button[aria-label^='查看第']").length ?? 0;
  const t = d?.innerText ?? "";
  return { thumbs, counter: /\/ 03/.test(t), price: t.includes("¥59.9") };
});
pass("10. 拼皮托特 3 图 ¥59.9", tote.thumbs >= 3 && tote.counter && tote.price, JSON.stringify(tote));
await page.keyboard.press("Escape");
await page.waitForTimeout(500);

/* 11. 明信片浏览 10 款 + 抽出 */
const pcSection = await page.evaluate(() => {
  const s = document.getElementById("postcards");
  const t = s?.innerText ?? "";
  return {
    thumbs: s?.querySelectorAll("button[aria-label^='查看明信片']").length ?? 0,
    has10: t.includes("共 10 款"),
    has3: t.includes("¥3 / 张"),
    has23: t.includes("¥23"),
    deck: s?.querySelectorAll("div[style*='z-index']").length ?? 0,
  };
});
pass("11. 明信片展区", pcSection.thumbs >= 10 && pcSection.has10 && pcSection.has3 && pcSection.has23 && pcSection.deck === 10, JSON.stringify(pcSection));

/* 12. 全站无拉伸：所有商品相关 img 均 contain（抽样 60 张） */
const fitStats = await page.evaluate(() => {
  const imgs = Array.from(document.images).filter((i) => i.src.includes("/images/products/"));
  const bad = imgs.filter((i) => getComputedStyle(i).objectFit === "cover").map((i) => i.src.split("/").slice(-2).join("/"));
  return { total: imgs.length, bad };
});
pass("12. 商品图无 cover 裁切", fitStats.bad.length === 0, `${fitStats.total} 张, cover=${fitStats.bad.length}`);

/* 13. 无残留旧文案 */
const stale = await page.evaluate(() => {
  const t = document.body.innerText;
  return {
    old13: t.includes("13 PRODUCTS"),
    oldPrice: t.includes("价格待更新"),
    liangshan: t.includes("四川凉山"),
    steps: t.includes("登记确认"),
  };
});
pass("13. 文案", !stale.old13 && !stale.oldPrice && stale.liangshan && stale.steps, JSON.stringify(stale));

console.log(`\nconsole errors: ${errors.length}`);
errors.slice(0, 6).forEach((e) => console.log("  •", e));

/* 14. 三档视口溢出 */
for (const vp of [{ w: 390, h: 844 }, { w: 768, h: 1024 }, { w: 1440, h: 900 }]) {
  const p2 = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
  await p2.goto(URL, { waitUntil: "load" });
  await p2.waitForTimeout(2500);
  const H = await p2.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < H; y += 400) {
    await p2.evaluate((yy) => window.scrollTo(0, yy), y);
    await p2.waitForTimeout(90);
  }
  await p2.waitForTimeout(1200);
  const ov = await p2.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const broken = await p2.evaluate(() =>
    Array.from(document.images).filter((i) => !(i.complete && i.naturalWidth > 0)).length,
  );
  pass(`14. 溢出 ${vp.w}px`, ov === 0, `overflow=${ov} broken=${broken}`);
  await p2.close();
}

await browser.close();
console.log("\nDONE");
