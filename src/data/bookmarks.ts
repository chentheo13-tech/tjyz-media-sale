/**
 * 书签数据：共 5 款（校园系列 2 款 / 非校园系列 3 款）。
 * 另附 3 张总样张展示图（不属于任何一款，用于套装展示）。
 */

export interface BookmarkVariant {
  id: string;
  no: string;
  group: "school" | "other";
  name: string;
  img: string;
}

import { asset } from "@/utils/paths";

const bm = (n: string) => asset(`/images/products/bookmark/${n}.webp`);

export const BOOKMARKS: BookmarkVariant[] = [
  { id: "bm-01", no: "BM-01", group: "school", name: "校园系列 01", img: bm("school-01") },
  { id: "bm-02", no: "BM-02", group: "school", name: "校园系列 02", img: bm("school-02") },
  { id: "bm-03", no: "BM-03", group: "other", name: "非校园系列 01", img: bm("non-01") },
  { id: "bm-04", no: "BM-04", group: "other", name: "非校园系列 02", img: bm("non-02") },
  { id: "bm-05", no: "BM-05", group: "other", name: "非校园系列 03", img: bm("non-03") },
];

export const BOOKMARK_COUNT = {
  total: 5,
  school: 2,
  other: 3,
  pricePerCard: 2,
  priceSet: 10,
};

/** 总样张展示图 */
export const BOOKMARK_OVERVIEWS = [
  bm("overview-01"),
  bm("overview-02"),
  bm("overview-03"),
];
