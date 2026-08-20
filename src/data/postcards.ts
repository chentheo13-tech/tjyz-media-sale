/**
 * 明信片数据：共 10 款（真实图片，文件名即款式信息）。
 * 每款介绍待用户提供真实画面说明后再补充，当前不虚构。
 */

export interface Postcard {
  id: string;
  no: string;
  /** 款式名（来自文件名：学校内容 / 天津特色 / 学校特色） */
  name: string;
  /** 文件名备注标签（没有备注则为空） */
  tag: string | null;
  desc: string;
  img: string;
  /** 小尺寸缩略图（缩略条用） */
  thumb: string;
}

import { asset } from "@/utils/paths";

const pc = (n: string) => asset(`/images/products/postcard/cards/${n}.webp`);
const pct = (n: string) => asset(`/images/products/postcard/cards/thumb-${n}.webp`);

export const POSTCARDS: Postcard[] = [
  { id: "pc-01", no: "PC-01", name: "明信片 01", tag: null, desc: "款式介绍待更新。", img: pc("card-01"), thumb: pct("01") },
  { id: "pc-02", no: "PC-02", name: "明信片 02", tag: "学校内容", desc: "款式介绍待更新。", img: pc("card-02"), thumb: pct("02") },
  { id: "pc-03", no: "PC-03", name: "明信片 03", tag: "天津特色", desc: "款式介绍待更新。", img: pc("card-03"), thumb: pct("03") },
  { id: "pc-04", no: "PC-04", name: "明信片 04", tag: "学校内容", desc: "款式介绍待更新。", img: pc("card-04"), thumb: pct("04") },
  { id: "pc-05", no: "PC-05", name: "明信片 05", tag: null, desc: "款式介绍待更新。", img: pc("card-05"), thumb: pct("05") },
  { id: "pc-06", no: "PC-06", name: "明信片 06", tag: null, desc: "款式介绍待更新。", img: pc("card-06"), thumb: pct("06") },
  { id: "pc-07", no: "PC-07", name: "明信片 07", tag: "学校特色", desc: "款式介绍待更新。", img: pc("card-07"), thumb: pct("07") },
  { id: "pc-08", no: "PC-08", name: "明信片 08", tag: null, desc: "款式介绍待更新。", img: pc("card-08"), thumb: pct("08") },
  { id: "pc-09", no: "PC-09", name: "明信片 09", tag: null, desc: "款式介绍待更新。", img: pc("card-09"), thumb: pct("09") },
  { id: "pc-10", no: "PC-10", name: "明信片 10", tag: null, desc: "款式介绍待更新。", img: pc("card-10"), thumb: pct("10") },
];

export const POSTCARD_COUNT = { total: 10, pricePerCard: 3, priceSet: 23 };

/** 明信片合集展示图（不属于任何一款） */
export const POSTCARD_COLLECTION_IMAGES = [
  asset("/images/products/postcard/collection-01.webp"),
  asset("/images/products/postcard/collection-02.webp"),
];
