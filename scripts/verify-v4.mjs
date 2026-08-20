/**
 * SCMC-v2 第四轮回归（本轮修改点）
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

/* 1. 帆布托特包 ¥39.9 */
await page.evaluate(() => document.getElementById("products")?.scrollIntoView({ behavior: "instant" }));
await page.waitForTimeout(1400);
const canvasCard = await page.evaluate(() => {
  const cards = Array.from(document.querySelectorAll("#products article"));
  const c = cards.find((a) => a.textContent?.includes("大容量帆布托特包"));
  if (!c) return null;
  const labels = Array.from(c.querySelectorAll("span")).map((x) => x.textContent?.trim() ?? "");
  return { price: labels.find((t) => t.startsWith("¥")) ?? "", noOld: !c.textContent?.includes("价格请咨询") };
});
pass("1. 帆布托特包 ¥39.9", canvasCard?.price === "¥39.9" && canvasCard.noOld, JSON.stringify(canvasCard));

/* 2. 明信片展区：新交互，无旧拖拽/底部大区 */
await page.evaluate(() => document.getElementById("postcards")?.scrollIntoView({ behavior: "instant" }));
await page.waitForTimeout(1200);
const pc = await page.evaluate(() => {
  const t = document.body.innerText;
  return {
    stackCards: document.querySelectorAll("#postcards button[aria-label^='取出']").length,
    oldDeck: t.includes("PULL OUT"),
    oldBrowser: t.includes("下一张明信片"),
    has10: t.includes("共 10 款"),
  };
});
pass("2. 明信片 10 张 / 旧交互已移除", pc.stackCards === 10 && !pc.oldDeck && !pc.oldBrowser && pc.has10, JSON.stringify(pc));

/* 3-7. 明信片交互（先让交互区完整进入视口） */
const pickBtn = (n) => page.locator("#postcards button[data-cursor='PICK']").nth(n);
await page.evaluate(() => {
  const st = document.querySelector("#postcards .relative.mx-auto.w-full");
  st?.scrollIntoView({ block: "center", behavior: "instant" });
});
await page.waitForTimeout(900);
const stageBox2 = await page.locator("#postcards .relative.mx-auto.w-full").first().boundingBox();

/* 3. 悬停整叠 → 扇形展开 */
const stackTransform = await pickBtn(0).evaluate((el) => getComputedStyle(el).transform);
await page.mouse.move(stageBox2.x + stageBox2.width / 2, stageBox2.y + 40);
await page.waitForTimeout(1000);
const fanTransform = await pickBtn(0).evaluate((el) => getComputedStyle(el).transform);
pass("3. 悬停扇形展开", stackTransform !== fanTransform, `stack=${stackTransform.slice(0, 30)} fan=${fanTransform.slice(0, 30)}`);

/* 4. 悬停某一张：选中卡保持、其余散开、焦点可切换 */
const b3 = await pickBtn(2).boundingBox();
await page.mouse.move(b3.x + b3.width / 2, b3.y + b3.height * 0.8);
await page.waitForTimeout(900);
const t3focusedA = await pickBtn(2).evaluate((el) => getComputedStyle(el).transform);
const t3focusedB = await pickBtn(2).evaluate((el) => getComputedStyle(el).transform);
const t6while3 = await pickBtn(5).evaluate((el) => getComputedStyle(el).transform);
const b6 = await pickBtn(5).boundingBox();
await page.mouse.move(b6.x + b6.width / 2, b6.y + b6.height * 0.8);
await page.waitForTimeout(900);
const t3after = await pickBtn(2).evaluate((el) => getComputedStyle(el).transform);
const t6focused = await pickBtn(5).evaluate((el) => getComputedStyle(el).transform);
pass("4. 悬停单张聚焦", t3focusedA === t3focusedB && t6focused !== t6while3 && t3after !== t3focusedA, "选中保持+其余散开+焦点切换");

/* 5. 点击取出 → 展示槽显示内容 */
const slotSel = "#postcards .aspect-square.w-\\[78\\%\\]";
const slotBefore = await page.evaluate((sel) => document.querySelector(sel)?.textContent ?? "", slotSel);
const b3b = await pickBtn(2).boundingBox();
await page.mouse.click(b3b.x + b3b.width / 2, b3b.y + b3b.height * 0.8);
await page.waitForTimeout(1200);
const slotAfter = await page.evaluate((sel) => {
  const slot = document.querySelector(sel);
  const t = slot?.textContent ?? "";
  return { hasNo: /PC-\d/.test(t), empty: t.includes("DISPLAY") };
}, slotSel);
pass("5. 点击取出展示", slotBefore.includes("DISPLAY") && slotAfter.hasNo && !slotAfter.empty, JSON.stringify(slotAfter));

/* 6. 重置按钮：取出后出现，点击恢复 */
const resetVisible = await page.evaluate(() => {
  const b = document.querySelector("button[aria-label='重置明信片叠放状态']");
  return b ? getComputedStyle(b).opacity : "0";
});
await page.locator("button[aria-label='重置明信片叠放状态']").click();
await page.waitForTimeout(1200);
const slotReset = await page.evaluate((sel) => document.querySelector(sel)?.textContent?.includes("DISPLAY") ?? false, slotSel);
pass("6. 重置按钮出现并恢复", resetVisible === "1" && slotReset, `visible=${resetVisible} reset=${slotReset}`);

/* 7. 重复操作：重置后再次扇形展开，取出第 5 张（PC-05） */
await page.mouse.move(stageBox2.x + stageBox2.width / 2, stageBox2.y + 40);
await page.waitForTimeout(900);
const b5 = await pickBtn(4).boundingBox();
await page.mouse.move(b5.x + b5.width / 2, b5.y + b5.height * 0.8);
await page.waitForTimeout(700);
const b5b = await pickBtn(4).boundingBox();
await page.mouse.click(b5b.x + b5b.width / 2, b5b.y + b5b.height * 0.8);
await page.waitForTimeout(1200);
const repeat = await page.evaluate((sel) => {
  const slot = document.querySelector(sel);
  return /PC-05/.test(slot?.textContent ?? "");
}, slotSel);
pass("7. 重复取出另一张", repeat, `PC-05=${repeat}`);

/* 8. 万年历：滚轮不带走页面 */
await page.evaluate(() => document.getElementById("calendar")?.scrollIntoView({ behavior: "instant" }));
await page.waitForTimeout(1000);
const y0 = await page.evaluate(() => Math.round(window.scrollY));
const wheelBox = page.locator("#calendar [data-cursor='WHEEL']");
await wheelBox.hover();
await page.mouse.wheel(0, 400);
await page.waitForTimeout(500);
const y1 = await page.evaluate(() => Math.round(window.scrollY));
pass("8. 万年历滚轮不带走页面", y0 === y1, `${y0} -> ${y1}`);

/* 9. 关于义卖：标题逗号换行 + 右栏与购买模块底部对齐 */
await page.evaluate(() => document.getElementById("about-sale")?.scrollIntoView({ behavior: "instant" }));
await page.waitForTimeout(1000);
const about = await page.evaluate(() => {
  const sec = document.getElementById("about-sale");
  const h2 = sec?.querySelector("h2");
  const twoLine = h2 ? h2.textContent?.includes("走得更远") && h2.querySelector("br") !== null : false;
  const left = sec?.querySelector(".lg\\:col-span-5")?.getBoundingClientRect();
  const right = sec?.querySelector(".lg\\:col-span-7")?.getBoundingClientRect();
  return {
    twoLine,
    leftBottom: left ? Math.round(left.bottom) : null,
    rightBottom: right ? Math.round(right.bottom) : null,
  };
});
pass("9. 标题换行 + 底部对齐", about.twoLine && about.leftBottom !== null && Math.abs((about.leftBottom ?? 0) - (about.rightBottom ?? 0)) < 60, JSON.stringify(about));

/* 10. 页脚：二维码统一模块 + 大字标完整展示 */
await page.evaluate(() => document.getElementById("footer")?.scrollIntoView({ behavior: "instant" }));
await page.waitForTimeout(1000);
const foot = await page.evaluate(() => {
  const f = document.getElementById("footer");
  const t = f?.innerText ?? "";
  const word = f?.querySelector(".stroke-text-strong");
  const wrap = word?.parentElement;
  return {
    scanHere: t.includes("扫码此处"),
    pending: t.includes("负责人微信与公众号为真实二维码"),
    placeholder: t.includes("※ 义卖详情二维码为预留占位图"),
    wordFull: wrap ? wrap.scrollWidth <= wrap.clientWidth + 2 : false,
  };
});
pass("10. 页脚二维码模块 + 大字标完整", foot.scanHere && foot.pending && foot.placeholder && foot.wordFull, JSON.stringify(foot));

/* 11. 信纸区：单品/套餐区分 + 翻开提示 */
await page.evaluate(() => document.getElementById("letter-paper")?.scrollIntoView({ behavior: "instant" }));
await page.waitForTimeout(1000);
const letter = await page.evaluate(() => {
  const t = document.getElementById("letter-paper")?.innerText ?? "";
  return {
    unfold: t.includes("悬停翻开"),
    single: t.includes("单品"),
    set: t.includes("套餐 · 信纸 × 1 + 板夹 × 1"),
  };
});
pass("11. 信纸单品/套餐区分 + 动效", letter.unfold && letter.single && letter.set, JSON.stringify(letter));

/* 11.5 新素材接入检查 */
const newMat = await page.evaluate(() => {
  const t = document.body.innerText;
  const campus = Array.from(document.querySelectorAll("#about-us img"))
    .filter((i) => i.src.includes("/backgrounds/campus-"))
    .map((i) => ({ src: i.src.split("/").pop(), ok: i.complete && i.naturalWidth > 0 }));
  const collabImgs = Array.from(document.querySelectorAll("#collabs img"))
    .filter((i) => i.src.includes("collab-")).length;
  const qrAcc = Array.from(document.querySelectorAll("#footer img"))
    .some((i) => i.src.includes("qr-account.webp") && i.complete && i.naturalWidth > 0);
  return {
    campusCount: campus.length,
    campusOk: campus.every((c) => c.ok),
    noCampus4: !document.body.innerHTML.includes("campus-04"),
    collabImgs,
    qrAcc,
    labelWechat: t.includes("公众号"),
    goods: !!document.querySelector("img[src*='sale-goods']"),
    archiveNote: t.includes("3 张真实校园风景"),
  };
});
pass("11.5 新素材接入", newMat.campusCount === 3 && newMat.campusOk && newMat.noCampus4 && newMat.collabImgs >= 3 && newMat.qrAcc && newMat.labelWechat && newMat.goods && newMat.archiveNote, JSON.stringify(newMat));

/* 12. 全量回归：价格 + console + 溢出 */
const grid = await page.evaluate(() =>
  Array.from(document.querySelectorAll("#products article")).map((a) => {
    const name = a.querySelector("h3")?.textContent?.trim() ?? "";
    const labels = Array.from(a.querySelectorAll("span")).map((x) => x.textContent?.trim() ?? "");
    return { name, price: labels.find((t) => t.startsWith("¥")) ?? "" };
  }),
);
const find = (n) => grid.find((g) => g.name.includes(n))?.price ?? "MISSING";
const priceChecks = {
  "板夹": find("板夹") === "¥21",
  "冲锋衣": find("冲锋衣") === "¥189",
  "帆布托特包": find("帆布托特包") === "¥39.9",
  "拼皮两用托特包": find("拼皮两用托特包") === "¥59.9",
  "小夜灯": find("小夜灯") === "¥45",
  "万年历": find("万年历") === "¥45",
  "男款": find("男款") === "¥8",
  "女款": find("女款") === "¥8",
  "男女套装": find("男女套装") === "¥14",
  "胸针": find("胸针") === "¥10",
  "系列明信片": find("系列明信片") === "¥3/ 张",
  "明信片十张套装": find("明信片十张套装") === "¥23",
  "系列书签": find("系列书签") === "¥2/ 张",
  "书签五张套装": find("书签五张套装") === "¥10",
  "信纸": find("信纸") === "¥11",
  "光栅闪卡": find("光栅闪卡") === "¥6",
  "板夹组合套餐": find("组合套餐") === "¥30",
};
const allPricesOk = Object.values(priceChecks).every(Boolean) && grid.length === 17;
const badPrices = Object.entries(priceChecks).filter(([, v]) => !v).map(([k]) => k);
pass("12. 17 商品价格", allPricesOk, badPrices.length ? `错误: ${badPrices.join(",")}` : "17 cards");

console.log(`console errors: ${errors.length}`);
errors.slice(0, 5).forEach((e) => console.log("  •", e));

for (const vp of [{ w: 390, h: 844 }, { w: 768, h: 1024 }, { w: 1440, h: 900 }]) {
  const p2 = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
  const e2 = [];
  p2.on("pageerror", (e) => e2.push(String(e).slice(0, 120)));
  await p2.goto(URL, { waitUntil: "load" });
  await p2.waitForTimeout(2500);
  const H = await p2.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < H; y += 250) {
    await p2.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
    await p2.waitForTimeout(120);
  }
  await p2.waitForTimeout(1500);
  const ov = await p2.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  pass(`溢出 ${vp.w}px`, ov === 0 && e2.length === 0, `overflow=${ov} err=${e2.length}`);
  await p2.close();
}

await browser.close();
console.log("\nDONE");
