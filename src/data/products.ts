/**
 * 义卖商品统一数据文件（唯一数据源）
 * ------------------------------------------------------------------
 * 所有页面（网格 / 分类 / 详情 / 套餐 / 推荐）都从本文件读取数据。
 * 价格严格按素材文件名与确认信息填写，不允许任何页面出现第二个价格。
 *
 * 图片命名约定（public/images/products/<id>/）：
 *   cover.webp = 网格主图；其余为详情画廊图。
 * 所有图片展示一律 object-fit: contain，绝不裁切 / 拉伸商品主体。
 */

export type CategoryId = "apparel" | "practical" | "accessory" | "paper" | "bundle";

export type InteractionKind = "duo" | "flip" | "lamp" | "wheel" | "plain";

export interface Product {
  /** 唯一 id（同时是图片目录名），严禁重复 */
  id: string;
  /** 商品编号 */
  no: string;
  name: string;
  nameEn: string;
  /** 商品可属于多个分类（套餐同时属于"商品分类"和"套餐"） */
  categories: CategoryId[];
  /** 价格（元）。null = 文件名未给出价格，显示"价格请咨询" */
  price: number | null;
  /** 计价单位，如 "/ 张" */
  priceUnit?: string;
  /** 一句话描述 */
  description: string;
  /** 规格 / 特色（只写已确认事实） */
  features: string[];
  /** 网格主图 */
  cover: string;
  /** 详情画廊图（含主图） */
  images: string[];
  /** 画廊图标注（与 images 一一对应，可选） */
  imageLabels?: string[];
  /** 是否为套餐 */
  bundle: boolean;
  /** 套餐内容 */
  bundleItems?: string[];
  /** 卡片角标：SET（套餐）/ 样张 */
  badge?: string;
  /** 特殊提示（如版本未定） */
  note?: string;
  /** 商品专属注意事项（全局购买须知在 site.ts） */
  notices: string[];
  /** 排序 */
  order: number;
  /** 卡片内轻量交互 */
  interaction: InteractionKind;
}

export const CATEGORIES: { id: CategoryId | "all"; label: string; en: string }[] = [
  { id: "all", label: "全部", en: "ALL" },
  { id: "apparel", label: "校园穿戴", en: "APPAREL" },
  { id: "practical", label: "包袋与实用品", en: "PRACTICAL" },
  { id: "accessory", label: "挂件与饰品", en: "ACCESSORY" },
  { id: "paper", label: "纸品文创", en: "PAPER" },
  { id: "bundle", label: "套餐", en: "SET" },
];

import { asset } from "@/utils/paths";

const P = (id: string, slot: string) => asset(`/images/products/${id}/${slot}.webp`);

export const PRODUCTS: Product[] = [
  /* ============ 包袋与实用品 ============ */
  {
    id: "clipboard",
    no: "SM-001",
    name: "学生新媒体中心板夹",
    nameEn: "Clipboard",
    categories: ["practical"],
    price: 21,
    description: "校园文创板夹，实用文具，日常学习与整理资料都用得上。",
    features: ["校园文创", "实用文具"],
    cover: P("clipboard", "cover"),
    images: [P("clipboard", "cover")],
    bundle: false,
    notices: [],
    order: 1,
    interaction: "plain",
  },
  {
    id: "jacket",
    no: "SM-002",
    name: "学生新媒体中心冲锋衣",
    nameEn: "Jacket",
    categories: ["apparel"],
    price: 189,
    description: "学校主题定制冲锋衣。图片为样张展示，具体以实物为准。",
    features: ["学校主题定制", "图片为样张展示"],
    cover: P("jacket", "cover"),
    images: [P("jacket", "cover")],
    bundle: false,
    badge: "样张",
    notices: ["图片属于样张展示，具体以实物为准。"],
    order: 2,
    interaction: "plain",
  },
  {
    id: "canvas-bag",
    no: "SM-003",
    name: "学生新媒体中心大容量帆布托特包",
    nameEn: "Canvas Tote",
    categories: ["practical"],
    price: 39.9,
    description: "学校主题定制帆布托特包，大容量，实物质感好，适合日常使用。",
    features: ["学校主题定制", "大容量", "实物质感好"],
    cover: P("canvas-bag", "cover"),
    images: [P("canvas-bag", "cover")],
    bundle: false,
    notices: [],
    order: 3,
    interaction: "plain",
  },
  {
    id: "leather-bag",
    no: "SM-004",
    name: "学生新媒体中心拼皮两用托特包",
    nameEn: "Leather Tote",
    categories: ["practical"],
    price: 59.9,
    description: "学校主题定制拼皮两用托特包，实物质感好，适合日常使用。",
    features: ["学校主题定制", "拼皮两用", "实物质感好"],
    cover: P("leather-bag", "01"),
    images: [P("leather-bag", "01"), P("leather-bag", "02"), P("leather-bag", "03")],
    bundle: false,
    notices: [],
    order: 4,
    interaction: "plain",
  },
  {
    id: "night-light",
    no: "SM-005",
    name: "学生新媒体中心校园小夜灯",
    nameEn: "Night Light",
    categories: ["practical"],
    price: 45,
    description: "学校主题定制校园小夜灯：校园纪念、桌面摆件，点亮时呈现夜灯视觉效果。",
    features: ["校园纪念", "桌面摆件", "夜灯视觉效果"],
    cover: P("night-light", "cover"),
    images: [P("night-light", "cover")],
    bundle: false,
    note: "当前展示版本尚未最终确定，仅供参考。",
    notices: ["当前展示版本尚未最终确定，仅供参考。"],
    order: 5,
    interaction: "lamp",
  },
  {
    id: "calendar",
    no: "SM-006",
    name: "学生新媒体中心万年历",
    nameEn: "Calendar",
    categories: ["practical"],
    price: 45,
    description: "学校主题定制万年历，桌面摆件，日期一目了然。",
    features: ["学校主题定制", "桌面摆件"],
    cover: P("calendar", "cover"),
    images: [P("calendar", "cover")],
    bundle: false,
    note: "当前展示版本尚未最终确定，仅供参考。",
    notices: ["当前展示版本尚未最终确定，仅供参考。"],
    order: 6,
    interaction: "wheel",
  },

  /* ============ 挂件与饰品 ============ */
  {
    id: "keychain-boy",
    no: "SM-007",
    name: "学生新媒体中心挂件 · 男款",
    nameEn: "Keychain · Boy",
    categories: ["accessory"],
    price: 8,
    description: "塑料挂件，男款对应「拍摄」——记录正在发生的校园。",
    features: ["塑料制品", "主题：拍摄"],
    cover: P("keychain-boy", "cover"),
    images: [P("keychain-boy", "cover")],
    bundle: false,
    notices: [],
    order: 7,
    interaction: "duo",
  },
  {
    id: "keychain-girl",
    no: "SM-008",
    name: "学生新媒体中心挂件 · 女款",
    nameEn: "Keychain · Girl",
    categories: ["accessory"],
    price: 8,
    description: "塑料挂件，女款对应「剪辑」——在时间线上重新整理故事。",
    features: ["塑料制品", "主题：剪辑"],
    cover: P("keychain-girl", "cover"),
    images: [P("keychain-girl", "cover")],
    bundle: false,
    notices: [],
    order: 8,
    interaction: "duo",
  },
  {
    id: "keychain-set",
    no: "SM-009",
    name: "学生新媒体中心挂件 · 男女套装",
    nameEn: "Keychain Set",
    categories: ["accessory", "bundle"],
    price: 14,
    description: "男女挂件组合套餐，两枚一起带走，对应一段校园影像从被记录到被完成的过程。",
    features: ["套餐：男款 + 女款"],
    cover: P("keychain-set", "02"),
    images: [P("keychain-set", "02"), P("keychain-set", "01")],
    bundle: true,
    bundleItems: ["男款挂件 × 1", "女款挂件 × 1"],
    badge: "SET",
    notices: ["套餐包含男款挂件、女款挂件各 1 个，不包含胸针。"],
    order: 9,
    interaction: "plain",
  },
  {
    id: "badge",
    no: "SM-010",
    name: "学生新媒体中心胸针",
    nameEn: "Badge",
    categories: ["accessory"],
    price: 10,
    description: "学生新媒体中心胸针，独立义卖商品（不包含在挂件套餐内）。",
    features: ["独立商品"],
    cover: P("badge", "cover"),
    images: [P("badge", "cover")],
    bundle: false,
    notices: [],
    order: 10,
    interaction: "plain",
  },

  /* ============ 纸品文创 ============ */
  {
    id: "postcard",
    no: "SM-011",
    name: "学生新媒体中心系列明信片",
    nameEn: "Postcard",
    categories: ["paper"],
    price: 3,
    priceUnit: "/ 张",
    description: "明信片共 10 款，单张 ¥3，可按款式挑选；另有十张套装 ¥23。",
    features: ["共 10 款", "单张 ¥3", "十张套装 ¥23"],
    cover: P("postcard", "cards/card-01"),
    images: [],
    bundle: false,
    notices: ["共 10 款，按款式挑选；十张套装另见套装商品。"],
    order: 11,
    interaction: "plain",
  },
  {
    id: "postcard-set",
    no: "SM-012",
    name: "校园明信片十张套装",
    nameEn: "Postcard Set",
    categories: ["paper", "bundle"],
    price: 23,
    description: "10 款明信片各 1 张的完整套装。单买合计 ¥30，整套 ¥23。",
    features: ["10 款各 1 张", "单买 ¥3 / 张", "整套 ¥23"],
    cover: P("postcard", "collection-01"),
    images: [P("postcard", "collection-01"), P("postcard", "collection-02")],
    bundle: true,
    bundleItems: ["10 款明信片 × 各 1 张"],
    badge: "SET",
    notices: ["套装包含 10 款明信片各 1 张；单买合计 ¥30，整套 ¥23。"],
    order: 12,
    interaction: "plain",
  },
  {
    id: "bookmark",
    no: "SM-013",
    name: "学生新媒体中心系列书签",
    nameEn: "Bookmark",
    categories: ["paper"],
    price: 2,
    priceUnit: "/ 张",
    description: "书签共 5 款，分校园系列与非校园系列；单张 ¥2，五张整套 ¥10。",
    features: ["共 5 款", "校园系列 × 2", "非校园系列 × 3", "单张 ¥2"],
    cover: P("bookmark", "school-01"),
    images: [],
    bundle: false,
    notices: ["共 5 款（校园系列 2 款 / 非校园系列 3 款）；五张整套另见套装商品。"],
    order: 13,
    interaction: "plain",
  },
  {
    id: "bookmark-set",
    no: "SM-014",
    name: "书签五张套装",
    nameEn: "Bookmark Set",
    categories: ["paper", "bundle"],
    price: 10,
    description: "5 款书签各 1 张的完整套装，校园系列与非校园系列一次集齐。",
    features: ["5 款各 1 张", "校园系列 × 2", "非校园系列 × 3", "整套 ¥10"],
    cover: P("bookmark", "overview-01"),
    images: [P("bookmark", "overview-01"), P("bookmark", "overview-02"), P("bookmark", "overview-03")],
    bundle: true,
    bundleItems: ["5 款书签 × 各 1 张"],
    badge: "SET",
    notices: ["套装包含 5 款书签各 1 张。"],
    order: 14,
    interaction: "plain",
  },
  {
    id: "letter-paper",
    no: "SM-015",
    name: "学生新媒体中心信纸",
    nameEn: "Letter Paper",
    categories: ["paper"],
    price: 11,
    description: "学校主题信纸，主要元素为学校名字，可单独购买。",
    features: ["学校主题", "印有学校名称"],
    cover: P("letter-paper", "cover"),
    images: [P("letter-paper", "cover")],
    bundle: false,
    notices: ["信纸单买 ¥11；与板夹组合的套餐 ¥30，另见套餐商品。"],
    order: 15,
    interaction: "plain",
  },
  {
    id: "flashcard",
    no: "SM-016",
    name: "学生新媒体中心光栅闪卡",
    nameEn: "Flashcard",
    categories: ["paper"],
    price: 6,
    description: "光栅闪卡，学校主题，一张卡片在不同角度呈现变化的光栅效果。",
    features: ["光栅效果", "学校主题"],
    cover: P("flashcard", "cover"),
    images: [P("flashcard", "cover")],
    bundle: false,
    notices: [],
    order: 16,
    interaction: "flip",
  },

  /* ============ 套餐 ============ */
  {
    id: "letter-clipboard-set",
    no: "SM-017",
    name: "信纸 × 板夹组合套餐",
    nameEn: "Letter + Clipboard Set",
    categories: ["bundle"],
    price: 30,
    description: "信纸与板夹的组合套餐：单买合计 ¥32，套餐 ¥30。",
    features: ["信纸 × 1 + 板夹 × 1", "单买合计 ¥32", "套餐 ¥30"],
    cover: P("letter-clipboard-set", "cover"),
    images: [P("letter-clipboard-set", "cover")],
    bundle: true,
    bundleItems: ["信纸 × 1", "板夹 × 1"],
    badge: "SET",
    notices: ["套餐包含信纸 × 1、板夹 × 1；单买合计 ¥32，套餐 ¥30。"],
    order: 17,
    interaction: "plain",
  },
];

export const sortedProducts = [...PRODUCTS].sort((a, b) => a.order - b.order);

export const productById = (id: string): Product | undefined =>
  PRODUCTS.find((p) => p.id === id);

/** 价格显示文本（全站统一） */
export function priceText(p: Product): string {
  if (p.price == null) return "价格请咨询";
  const num = Number.isInteger(p.price) ? String(p.price) : p.price.toFixed(1).replace(/\.0$/, "");
  return `¥${num}${p.priceUnit ?? ""}`;
}
