import { ScrollTrigger } from "gsap/ScrollTrigger";

let timer: ReturnType<typeof setTimeout> | null = null;

/**
 * 布局变化后（分类切换 / resize / 图片加载）延迟刷新 ScrollTrigger，
 * 避免 pin spacer 沿用旧高度导致的长空白或跳动。
 * 多次调用会合并为一次刷新（防抖）。
 */
export function refreshScrollTrigger(ms = 160) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    ScrollTrigger.refresh();
    timer = null;
  }, ms);
}

/** 绑定一个 ResizeObserver，元素尺寸变化时刷新 ScrollTrigger */
export function observeScrollTrigger(el: Element | null): (() => void) | undefined {
  if (!el || typeof ResizeObserver === "undefined") return undefined;
  const ro = new ResizeObserver(() => refreshScrollTrigger(140));
  ro.observe(el);
  return () => ro.disconnect();
}
