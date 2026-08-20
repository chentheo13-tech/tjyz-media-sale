import { asset } from "@/utils/paths";

/**
 * 站点全局文案与配置
 * 真实性原则：只写已确认的事实，不虚构活动背景、产品信息与联系方式。
 */
export const SITE = {
  name: "学生新媒体社团",
  nameEn: "STUDENT MEDIA CENTER",
  shortName: "SCMC",
  event: "校园义卖 · 线上展厅",
  eventEn: "CHARITY SALE",
  year: "2026",
  /** 品牌徽章（学生新媒体中心徽章，组织视觉素材） */
  badge: asset("/images/branding/badge.png"),
  /** 首屏主标题 */
  heroTitle: "学生新媒体社团",
  heroSub: "校园义卖线上展厅",
  heroEn: ["STUDENT MEDIA CENTER", "CHARITY SALE", "2026"],
  /** 义卖状态栏 */
  status: {
    on: true,
    text: "义卖进行中",
    en: "SALE ON AIR",
  },
  nav: [
    { id: "home", label: "首页", en: "HOME" },
    { id: "products", label: "义卖产品", en: "PRODUCTS" },
    { id: "about-sale", label: "关于义卖", en: "ABOUT SALE" },
    { id: "about-us", label: "关于我们", en: "ABOUT US" },
    { id: "collabs", label: "联名企划", en: "COLLABS" },
    { id: "xmti", label: "XMTI", en: "XMTI" },
  ],
  /** 关于义卖（公益方向：四川凉山） */
  aboutSale: {
    kicker: "ABOUT THE SALE",
    title: "让校园里的创意，走得更远",
    paragraphs: [
      "一张明信片、一枚书签、一件校园文创，对我们来说也许只是一次简单的选择。但当许多这样的选择汇聚在一起，它们也可以跨越很远的距离。",
      "这一次，我们希望把在校园里认真完成的一份份创意，变成送往四川凉山孩子身边的一份善意。",
      "我们不知道一件小小的文创最终会改变什么，也不想用夸张的语言替这份善意定义结果。我们只是希望，在我们拥有机会记录青春、表达创意的时候，也能把其中的一点温度分享给更远的地方。",
      "让一件校园纪念品，被赋予比纪念本身更长的意义。",
    ],
    stats: [
      { value: "17", label: "义卖产品", en: "PRODUCTS" },
      { value: "10", label: "款明信片", en: "POSTCARDS" },
      { value: "5", label: "款书签", en: "BOOKMARKS" },
      { value: "凉山", label: "公益方向", en: "LIANGSHAN" },
    ],
  },
  /** 购买方式（唯一渠道：添加负责人微信） */
  purchase: {
    title: "购买方式",
    steps: [
      "添加学生新媒体中心负责人微信",
      "发送：商品名称 + 数量",
      "登记确认",
      "付款",
    ],
    note: "本网站仅作商品展示，购买请通过负责人微信登记。",
    qrLabel: "负责人微信",
    qrImage: asset("/images/branding/qr-wechat.webp"),
  },
  /** 购买须知（全局，所有商品详情统一展示） */
  notices: [
    "所有商品均为义卖商品。",
    "商品图片以实际样品展示为主。",
    "套餐内容按照商品详情页标注执行。",
    "如需购买多个商品，请在登记时统一说明商品名称及数量。",
    "商品相关具体领取方式以实际通知为准。",
  ],
  /** 关于学生新媒体社团 */
  aboutUs: {
    kicker: "ABOUT SCMC",
    title: "一群把校园拍下来的人",
    paragraphs: [
      "学生新媒体社团记录校园里正在发生的每一件小事：一场活动、一次日落、一句被镜头留住的话。我们也在一次次创作中形成自己的习惯——有人习惯站在镜头后，有人喜欢把故事藏进时间线。",
    ],
    /** 社团发展时间线（仅以下五项，勿增改） */
    timeline: [
      { time: "2022", event: "社团创立" },
      { time: "2023", event: "逐渐壮大" },
      { time: "2024", event: "社团组织更加完善" },
      { time: "2025", event: "五星社团" },
      { time: "2026", event: "未完待续……" },
    ],
  },
  /** XMTI 入口（信息来自 XMTI 线上页面已确认内容） */
  xmti: {
    kicker: "FROM SCMC ARCHIVE",
    title: "你的新媒体人格是什么？",
    sub: "XMTI｜天津一中新媒体中心出品的新媒体人格测试。",
    desc: [
      "我们记录校园，也在一次次创作中形成自己的习惯。",
      "有人习惯站在镜头后，有人喜欢把故事藏进时间线；有人追逐现场，有人反复打磨最后一帧。",
      "那么，你是哪一种新媒体人？",
    ],
    tagline: "回答一组有趣的问题，发现你的新媒体人格。",
    cta: "进入 XMTI →",
    url: "https://chentheo13-tech.github.io/XMTI-New-Project/",
  },
  /** 联名企划（Coming Soon） */
  collabs: {
    kicker: "COLLABORATION",
    title: "联名企划",
    status: "联名企划 · 即将上线",
    statusEn: "COMING SOON",
    list: [
      { id: "choir", name: "歌艺社", en: "MUSIC CLUB", image: asset("/images/branding/collab-choir.webp") },
      { id: "etiquette", name: "礼仪公关社", en: "ETIQUETTE CLUB", image: asset("/images/branding/collab-etiquette.webp") },
      { id: "album", name: "原创专辑社", en: "ALBUM CLUB", image: asset("/images/branding/collab-album.webp") },
    ],
    note: "具体联名内容尚未确定，敬请期待。",
  },
  /** 免责声明 */
  disclaimer: {
    pending: "小夜灯、万年历当前展示版本尚未最终确定，仅供参考。",
    preview: "网页中的产品图片及效果展示仅供参考，一切以实物为准。",
    rights: "最终解释权归学生新媒体社团所有。",
  },
  footer: {
    note: "本页面为学生新媒体社团义卖活动线上展厅",
    contact: [
      "购买方式：添加负责人微信 → 发送商品名称 + 数量 → 登记确认 → 付款",
      "公益方向：四川凉山",
    ],
  },
};

/** 二维码位（可直接替换 public/images/branding/ 下同名文件） */
export const QR_SLOTS = [
  { id: "wechat", label: "负责人微信", file: asset("/images/branding/qr-wechat.webp"), real: true },
  { id: "account", label: "公众号", file: asset("/images/branding/qr-account.webp"), real: true },
  { id: "info", label: "义卖商品展示", file: asset("/images/branding/sale-goods.webp"), real: true },
];
