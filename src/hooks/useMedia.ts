import { useEffect, useState } from "react";

/** 是否为可精细指针设备（桌面，支持自定义光标 / hover 动画） */
export function useFinePointer(): boolean {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setFine(mq.matches);
    const on = (e: MediaQueryListEvent) => setFine(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return fine;
}

/** 视口断点（与设计稿对应：390 / 768 / 1280 / 1440） */
export function useViewport() {
  const [w, setW] = useState(() =>
    typeof window === "undefined" ? 1280 : window.innerWidth,
  );
  useEffect(() => {
    const on = () => setW(window.innerWidth);
    window.addEventListener("resize", on, { passive: true });
    return () => window.removeEventListener("resize", on);
  }, []);
  return {
    width: w,
    isMobile: w < 768,
    isTablet: w >= 768 && w < 1280,
    isDesktop: w >= 1280,
  };
}
