/**
 * SCMC-v2 第五轮回归（本轮修复项）
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
const pass = (name, ok, extra = "") => console.log(`${name}: ${ok ? "PASS" : "FAIL"}${extra ? ` (${extra})` : ""}`);

/* ---------- 明信片 ---------- */
await page.evaluate(() => document.getElementById("postcards")?.scrollIntoView({ behavior: "instant" }));
await page.waitForTimeout(1000);
await page.evaluate(() => {
  const st = document.querySelector("#postcards .relative.mx-auto.w-full");
  st?.scrollIntoView({ block: "center", behavior: "instant" });
});
await page.waitForTimeout(800);
const pickBtn = (n) => page.locator("#postcards button[data-cursor='PICK']").nth(n);
const stageBox = await page.locator("#postcards .relative.mx-auto.w-full").first().boundingBox();
const slotSel = "#postcards .aspect-square.w-\\[78\\%\\]";

/* 1. 默认自然堆叠：卡片位移/角度各不相同 */
const t0 = await pickBtn(0).evaluate((el) => getComputedStyle(el).transform);
const t9 = await pickBtn(9).evaluate((el) => getComputedStyle(el).transform);
pass("1. 默认堆叠（位移/角度差）", t0 !== t9, `c0=${t0.slice(0, 30)} c9=${t9.slice(0, 30)}`);

/* 2. 点击展开 → 点击另一张立即切换（鼠标始终不离开舞台） */
const clickCard = async (n) => {
  const box = await pickBtn(n).boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height * 0.8);
  await page.waitForTimeout(550); // 等聚焦 z-index 提升稳定
  const box2 = await pickBtn(n).boundingBox();
  await page.mouse.click(box2.x + box2.width / 2, box2.y + box2.height * 0.8);
  await page.waitForTimeout(900);
};
await page.mouse.move(stageBox.x + stageBox.width / 2, stageBox.y + 40);
await page.waitForTimeout(900);
await clickCard(2);
const s1 = await page.evaluate((sel) => /PC-03/.test(document.querySelector(sel)?.textContent ?? ""), slotSel);
/* 鼠标仍停留在舞台内（未离开），直接点第 5 张 */
await page.mouse.move(stageBox.x + stageBox.width / 2, stageBox.y + 40);
await page.waitForTimeout(600);
await clickCard(4);
const s2 = await page.evaluate((sel) => /PC-05/.test(document.querySelector(sel)?.textContent ?? ""), slotSel);
pass("2. 点击展开 + 连续切换", s1 && s2, `PC-03=${s1} PC-05=${s2}`);

/* 3. 展开时背景模糊 + 压暗 */
const dim = await page.evaluate(() => {
  const overlays = Array.from(document.querySelectorAll("#postcards .relative.mx-auto.w-full > div"));
  const o = overlays.find((d) => getComputedStyle(d).backdropFilter.includes("blur"));
  return o ? { has: true, blur: getComputedStyle(o).backdropFilter } : { has: false };
});
pass("3. 展开背景模糊压暗", dim.has, JSON.stringify(dim));

/* 4. 点空白关闭 → 再点可再次展开（循环） */
const dimBox = await page.evaluate(() => {
  const overlays = Array.from(document.querySelectorAll("#postcards .relative.mx-auto.w-full > div"));
  const o = overlays.find((d) => getComputedStyle(d).backdropFilter.includes("blur"));
  if (!o) return null;
  const r = o.getBoundingClientRect();
  return { x: r.x + 20, y: r.y + 20 };
});
await page.mouse.click(dimBox.x, dimBox.y);
await page.waitForTimeout(800);
const closed1 = await page.evaluate((sel) => document.querySelector(sel)?.textContent?.includes("DISPLAY") ?? false, slotSel);
await page.mouse.move(stageBox.x + stageBox.width / 2, stageBox.y + 40);
await page.waitForTimeout(600);
await clickCard(6);
const reopened = await page.evaluate((sel) => /PC-07/.test(document.querySelector(sel)?.textContent ?? ""), slotSel);
pass("4. 空白关闭 + 再次展开", closed1 && reopened, `closed=${closed1} reopened=${reopened}`);

/* 5. ✕ 关闭 + ESC 关闭 */
await page.locator("#postcards button[aria-label='放回明信片']").click();
await page.waitForTimeout(800);
const closedX = await page.evaluate((sel) => document.querySelector(sel)?.textContent?.includes("DISPLAY") ?? false, slotSel);
await page.mouse.move(stageBox.x + stageBox.width / 2, stageBox.y + 40);
await page.waitForTimeout(600);
await clickCard(0);
await page.keyboard.press("Escape");
await page.waitForTimeout(800);
const closedEsc = await page.evaluate((sel) => document.querySelector(sel)?.textContent?.includes("DISPLAY") ?? false, slotSel);
pass("5. ✕ 与 ESC 关闭", closedX && closedEsc, `✕=${closedX} esc=${closedEsc}`);

/* ---------- 信纸 ---------- */
await page.evaluate(() => document.getElementById("letter-paper")?.scrollIntoView({ behavior: "instant" }));
await page.waitForTimeout(900);
const letter = await page.evaluate(() => {
  const sec = document.getElementById("letter-paper");
  const t = sec?.innerText ?? "";
  return {
    onlyLetter: !t.includes("板夹套餐") && !t.includes("信封"),
    single: t.includes("单品"),
    preview: t.includes("悬停预览"),
    click: t.includes("点击查看完整信纸"),
  };
});
pass("6. 信纸区仅信纸单品", letter.onlyLetter && letter.single && letter.preview && letter.click, JSON.stringify(letter));
await page.locator("#letter-paper button[aria-label^='查看学生新媒体中心信纸']").click();
await page.waitForTimeout(900);
const letterModal = await page.evaluate(() => {
  const d = document.querySelector('[role="dialog"]');
  const t = d?.innerText ?? "";
  return { has: !!d, name: t.includes("学生新媒体中心信纸"), price: t.includes("¥11"), img: !!d?.querySelector("img[src*='letter-paper']") };
});
pass("7. 信纸点击查看", letterModal.has && letterModal.name && letterModal.price && letterModal.img, JSON.stringify(letterModal));
await page.keyboard.press("Escape");
await page.waitForTimeout(700);

/* ---------- 万年历 ---------- */
await page.evaluate(() => {
  const w = document.querySelector("#calendar [data-cursor='WHEEL']");
  w?.scrollIntoView({ block: "center", behavior: "instant" });
});
await page.waitForTimeout(1400); // 等 Reveal 入场动画结束
const wheelBox = page.locator("#calendar [data-cursor='WHEEL']");
await wheelBox.hover();
await page.waitForTimeout(500);
const y0 = await page.evaluate(() => Math.round(window.scrollY));
const readDate = () => page.evaluate(() => {
  const w = document.querySelector("#calendar [data-cursor='WHEEL']");
  const t = (w?.innerText ?? "").replace(/\n/g, "");
  const m = t.match(/(\d{4})年(\d+)月(\d+)日/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : "";
});
const dateBefore = await readDate();
for (let k = 0; k < 5; k++) { await page.mouse.wheel(0, 120); await page.waitForTimeout(200); }
await page.waitForTimeout(600);
const y1 = await page.evaluate(() => Math.round(window.scrollY));
const dateAfter = await readDate();
const touchAction = await wheelBox.evaluate((el) => getComputedStyle(el).touchAction);
pass("8. 万年历连续滚轮（页面不动）", y0 === y1 && dateBefore !== dateAfter && touchAction.includes("pan-y"), `${dateBefore}->${dateAfter} scrollY=${y0}->${y1} touchAction=${touchAction}`);

/* ---------- 导航统一 ---------- */
const nav = await page.evaluate(() => {
  const top = Array.from(document.querySelectorAll("header nav button")).map((b) => b.textContent?.trim());
  const footer = Array.from(document.querySelectorAll("#footer button")).map((b) => b.textContent?.trim());
  return { top, footer };
});
const expectNav = ["首页", "义卖产品", "关于义卖", "关于我们", "联名企划", "XMTI"];
pass("9. 上下导航统一", JSON.stringify(nav.top) === JSON.stringify(expectNav) && JSON.stringify(nav.footer) === JSON.stringify(expectNav), JSON.stringify(nav));

/* ---------- 义卖商品展示（先滚到页脚让懒加载图加载） ---------- */
await page.evaluate(() => document.getElementById("footer")?.scrollIntoView({ behavior: "instant" }));
await page.waitForTimeout(900);
const qrText = await page.evaluate(() => {
  const t = document.body.innerText;
  const goodsImg = Array.from(document.querySelectorAll("#footer img"))
    .some((i) => i.src.includes("sale-goods.webp") && i.complete && i.naturalWidth > 0);
  return { hasNew: t.includes("义卖商品展示"), hasOld: t.includes("义卖详情"), noPending: !t.includes("稍后提供"), goodsImg };
});
pass("10. 义卖商品展示（真实图片/无稍后提供）", qrText.hasNew && !qrText.hasOld && qrText.noPending && qrText.goodsImg, JSON.stringify(qrText));

/* ---------- 公益区紧凑（对齐保持） ---------- */
await page.evaluate(() => document.getElementById("about-sale")?.scrollIntoView({ behavior: "instant" }));
await page.waitForTimeout(900);
const about = await page.evaluate(() => {
  const sec = document.getElementById("about-sale");
  const h2 = sec?.querySelector("h2");
  const twoLine = h2 ? h2.textContent?.includes("走得更远") && !!h2.querySelector("br") : false;
  const l = sec?.querySelector(".lg\\:col-span-5")?.getBoundingClientRect();
  const r = sec?.querySelector(".lg\\:col-span-7")?.getBoundingClientRect();
  return { twoLine, alignOk: l && r ? Math.abs(l.bottom - r.bottom) < 60 : false, h: sec ? Math.round(sec.getBoundingClientRect().height) : 0 };
});
pass("11. 公益区（紧凑+对齐）", about.twoLine && about.alignOk, JSON.stringify(about));

/* ---------- 价格回归 ---------- */
await page.evaluate(() => document.getElementById("products")?.scrollIntoView({ behavior: "instant" }));
await page.waitForTimeout(900);
const grid = await page.evaluate(() =>
  Array.from(document.querySelectorAll("#products article")).map((a) => {
    const name = a.querySelector("h3")?.textContent?.trim() ?? "";
    const labels = Array.from(a.querySelectorAll("span")).map((x) => x.textContent?.trim() ?? "");
    return { name, price: labels.find((t) => t.startsWith("¥")) ?? "" };
  }),
);
const find = (n) => grid.find((g) => g.name.includes(n))?.price ?? "MISSING";
const priceChecks = {
  "板夹": find("板夹") === "¥21", "冲锋衣": find("冲锋衣") === "¥189",
  "帆布托特包": find("帆布托特包") === "¥39.9", "拼皮两用托特包": find("拼皮两用托特包") === "¥59.9",
  "小夜灯": find("小夜灯") === "¥45", "万年历": find("万年历") === "¥45",
  "男款": find("男款") === "¥8", "女款": find("女款") === "¥8", "男女套装": find("男女套装") === "¥14",
  "胸针": find("胸针") === "¥10", "系列明信片": find("系列明信片") === "¥3/ 张",
  "明信片十张套装": find("明信片十张套装") === "¥23", "系列书签": find("系列书签") === "¥2/ 张",
  "书签五张套装": find("书签五张套装") === "¥10", "信纸": find("信纸") === "¥11",
  "光栅闪卡": find("光栅闪卡") === "¥6", "组合套餐": find("组合套餐") === "¥30",
};
pass("12. 17 商品价格", grid.length === 17 && Object.values(priceChecks).every(Boolean), `${grid.length} cards`);

console.log(`console errors: ${errors.length}`);
errors.slice(0, 5).forEach((e) => console.log("  •", e));

/* ---------- 手机端 ---------- */
const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
const mErr = [];
m.on("pageerror", (e) => mErr.push(String(e).slice(0, 120)));
await m.goto(URL, { waitUntil: "load" });
await m.waitForTimeout(2500);

/* 手机明信片：点击展开 → 点空白关闭 */
await m.evaluate(() => document.getElementById("postcards")?.scrollIntoView({ behavior: "instant" }));
await m.waitForTimeout(800);
await m.evaluate(() => {
  const st = document.querySelector("#postcards .relative.mx-auto.w-full");
  st?.scrollIntoView({ block: "center", behavior: "instant" });
});
await m.waitForTimeout(700);
const mPick = m.locator("#postcards button[data-cursor='PICK']").nth(3);
let mb = await mPick.boundingBox();
await m.mouse.move(mb.x + mb.width / 2, mb.y + mb.height * 0.75);
await m.waitForTimeout(500);
mb = await mPick.boundingBox();
await m.mouse.click(mb.x + mb.width / 2, mb.y + mb.height * 0.75);
await m.waitForTimeout(900);
const mExtracted = await m.evaluate((sel) => /PC-\d/.test(document.querySelector(sel)?.textContent ?? ""), slotSel);
const mDimBox = await m.evaluate(() => {
  const overlays = Array.from(document.querySelectorAll("#postcards .relative.mx-auto.w-full > div"));
  const o = overlays.find((d) => getComputedStyle(d).backdropFilter.includes("blur"));
  if (!o) return null;
  const r = o.getBoundingClientRect();
  return { x: r.x + 12, y: r.y + 12 };
});
await m.mouse.click(mDimBox.x, mDimBox.y);
await m.waitForTimeout(800);
const mClosed = await m.evaluate((sel) => document.querySelector(sel)?.textContent?.includes("DISPLAY") ?? false, slotSel);
pass("13. 手机明信片点击/空白关闭", mExtracted && mClosed, `extracted=${mExtracted} closed=${mClosed}`);

/* 手机菜单 6 项 */
await m.evaluate(() => window.scrollTo(0, 0));
await m.waitForTimeout(600);
await m.locator("header button[aria-label='菜单']").click();
await m.waitForTimeout(800);
const mMenu = await m.evaluate(() => {
  const overlay = document.querySelector("[data-menu]");
  const items = overlay ? Array.from(overlay.querySelectorAll("span.font-display")).map((x) => x.textContent?.trim()) : [];
  return items;
});
pass("14. 手机菜单 6 项统一", mMenu.length === 6 && mMenu.includes("联名企划") && mMenu.includes("XMTI"), JSON.stringify(mMenu));
await m.keyboard.press("Escape");
await m.waitForTimeout(700);
const mMenuClosed = await m.evaluate(() => !document.querySelector("[data-menu]"));
if (!mMenuClosed) {
  await m.locator("header button[aria-label='菜单']").click().catch(() => {});
  await m.waitForTimeout(700);
}

/* 手机溢出 */
const H = await m.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < H; y += 250) {
  await m.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
  await m.waitForTimeout(100);
}
await m.waitForTimeout(1400);
const mOv = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
pass("15. 手机 0 溢出 0 报错", mOv === 0 && mErr.length === 0, `overflow=${mOv} err=${mErr.length}`);

/* 平板 + 桌面溢出 */
for (const vp of [{ w: 768, h: 1024 }, { w: 1440, h: 900 }]) {
  const p2 = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
  const e2 = [];
  p2.on("pageerror", (e) => e2.push(String(e).slice(0, 120)));
  await p2.goto(URL, { waitUntil: "load" });
  await p2.waitForTimeout(2400);
  const H2 = await p2.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < H2; y += 250) {
    await p2.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
    await p2.waitForTimeout(100);
  }
  await p2.waitForTimeout(1200);
  const ov = await p2.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  pass(`溢出 ${vp.w}px`, ov === 0 && e2.length === 0, `overflow=${ov} err=${e2.length}`);
  await p2.close();
}

await browser.close();
console.log("\nDONE");
