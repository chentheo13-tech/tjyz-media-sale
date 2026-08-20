# SCMC · 学生新媒体社团校园义卖线上展厅（v2）

一场关于「记录」的校园义卖。**电影感 / 新媒体语言**的产品数字展览，而非传统电商商城。

> 本目录为 v2 修改版，旧版保留在 `../SCMC`。
> 开发服务器：http://localhost:5174（旧版 5173 仍可访问）。

## 当前版本要点（第三轮：真实商品图 + 价格）

- **17 个商品**（含 4 个套餐），价格严格来自素材文件名与确认信息：

| 商品 | 价格 | | 商品 | 价格 |
|---|---|---|---|---|
| 板夹 | ¥21 | | 胸针 | ¥10 |
| 冲锋衣（样张） | ¥189 | | 明信片（单张） | ¥3 / 张 |
| 帆布托特包 | ¥39.9 | | 明信片十张套装 | ¥23 |
| 拼皮两用托特包 | ¥59.9 | | 书签（单张） | ¥2 / 张 |
| 校园小夜灯 | ¥45 | | 书签五张套装 | ¥10 |
| 万年历 | ¥45 | | 信纸 | ¥11 |
| 挂件 · 男款 | ¥8 | | 信纸 × 板夹套餐 | ¥30 |
| 挂件 · 女款 | ¥8 | | 光栅闪卡 | ¥6 |
| 挂件 · 男女套装 | ¥14（不含胸针） | | | |

- 商品图全部使用真实素材（`object-fit: contain`，绝不裁切/拉伸；缩略条使用 320px 小图）
- 统一详情结构：画廊 → 名称 → 价格 → 描述 → 规格/套餐内容 → 注意事项 → 如何购买（4 步）→ 相关推荐
- 分类：校园穿戴 / 包袋与实用品 / 挂件与饰品 / 纸品文创 / 套餐（套餐同时在商品分类与"套餐"中出现）
- 明信片 10 款：自然堆叠（位移/角度/层级/阴影）→ 悬停轻微扇形 → 点击取出放大（点击驱动、可连续切换）→ 展开时后方模糊压暗 → 点空白/✕/ESC 放回 → 重置按钮
- 信纸专区仅信纸单品：hover 轻翻预览（小角度不穿模）+ 点击进入详情查看完整信纸
- 万年历：滚轮按幅度自由翻动（不锁死、页面不滚动），手机横向滑动翻日期、纵向滚动不受阻
- 导航顶部/底部统一为 6 项；"义卖详情"统一改为"义卖商品展示"；公益区紧凑化
- 书签 5 款（校园 ×2 / 非校园 ×3）；拼皮托特 3 图轮播；信纸卡片悬停翻页动效
- 万年历滚轮在轮盘区域内拦截（不再带走页面滚动）
- 详情返回恢复原滚动位置与分类；分类切换后 ScrollTrigger 自动重算，无长空白
- 品牌：学生新媒体中心徽章用于页头/页脚；负责人微信二维码为真实二维码
- 公益方向：四川凉山；时间线 2022–2026；XMTI 入口；联名 Coming Soon

## 技术栈

Vite · React 18 · TypeScript · Tailwind CSS 4 · Framer Motion · GSAP (ScrollTrigger)

## 启动

```bash
npm install        # 首次
npm run dev        # 开发
npm run build      # 生产构建（dist/）
```

## 素材与图片

- `assets-original/`：全部原始素材（中文文件名保留，永不覆盖）
- `public/images/products/<id>/`：处理后的 WebP（等比、不裁切；长边 ≤1600px，6144px 大图统一 1200px）
- 处理脚本：`node scripts/process-materials.mjs`（原图归档 + 转 WebP + 缩略图 + 清理旧占位）

### 图片 → 商品映射（已实现，勿错位）

| 素材文件 | 商品目录 |
|---|---|
| 板夹（单价21）.jpg | clipboard/cover |
| 冲锋衣样张1（价格189）.jpg | jacket/cover |
| 帆布包大容量（改名红织带帆布托特）.jpg | canvas-bag/cover |
| 拼皮两用托特（单价59.9）/2/3.jpg | leather-bag/01..03 |
| 挂件男款/女款（单价8）.jpg | keychain-boy / keychain-girl |
| 挂件合集 + 挂件男女（…单价14）.jpg | keychain-set/01..02 |
| 胸针（单价10）.jpg | badge/cover |
| 明信片1..10.jpg | postcard/cards/card-01..10 |
| 明信片大合集 + 图合集.jpg | postcard/collection-01..02（套装展示图） |
| 书签学校1/2 + 非学校内容1/2 + 非学校样张3 | bookmark/school-* non-*（5 款） |
| 书签总样张 1..3 | bookmark/overview-01..03（套装展示图） |
| 信纸（单价11）.png | letter-paper/cover |
| 信纸板夹合卖（单价30）.jpg | letter-clipboard-set/cover |
| 小夜灯样张（价格45）.jpg | night-light/cover |
| 万年历样张（价格45）.jpg | calendar/cover |
| 光栅卡闪卡样张（单价6）.jpg | flashcard/cover |
| 学生新媒体中心徽章.png | branding/badge.png（品牌素材，非商品） |
| 副社微信二维码….jpg | branding/qr-wechat.webp（真实二维码） |
| 1.png | 仅归档（未识别商品，未使用） |
| 素材补充：校园风景展示1/2/3 | backgrounds/campus-01..03（关于我们真实照片） |
| 素材补充：歌艺社/礼仪公关社/原创专辑社合作 | branding/collab-choir/etiquette/album（联名视觉） |
| 素材补充：公众号地址.jpeg | branding/qr-account.webp（真实公众号二维码） |
| 素材补充：义卖商品展示.jpg | branding/sale-goods.webp（关于义卖展示图） |

## 数据文件

- `src/data/products.ts` — 17 商品唯一数据源（价格/分类/套餐/注意事项/画廊）
- `src/data/postcards.ts` — 明信片 10 款（名称来自文件名备注，介绍待补充）
- `src/data/bookmarks.ts` — 书签 5 款（校园/非校园分组）
- `src/data/site.ts` — 全站文案 / 购买 4 步 / 全局购买须知 / 免责 / 时间线 / XMTI / 联名

新增商品 = `products.ts` 追加一条记录 + 图片目录，页面自动出现。
修改价格 = 只改 `products.ts` 的 `price` 字段。

## 脚本

```bash
node scripts/process-materials.mjs              # 主素材处理（原图归档 + WebP + 缩略图）
node scripts/process-materials-supplement.mjs   # 素材补充处理（校园照片/联名/公众号二维码）
node scripts/audit-assets.mjs                   # 17 商品 + 全部图片路径核对
node scripts/verify-v5.mjs                      # 无头浏览器全量回归（18 项）
```

## 性能与无障碍

- 商品图 WebP + 懒加载（首屏 / 横向 transform 容器 / 缩略条使用 eager 或小图）
- 图片容器固定 aspect-ratio，加载前后不塌陷、不跳动；shimmer 骨架
- 动画只用 transform / opacity；明信片抽出的 backdrop blur 仅交互期间启用
- `prefers-reduced-motion` 降级；触屏关闭自定义光标；分类切换后防抖刷新 ScrollTrigger
