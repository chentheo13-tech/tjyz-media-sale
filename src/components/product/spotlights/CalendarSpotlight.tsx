import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/data/products";
import { priceText } from "@/data/products";
import { ProductImage } from "@/components/ui/ProductImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { SITE } from "@/data/site";

const pad = (n: number) => String(n).padStart(2, "0");
const WEEK = ["日", "一", "二", "三", "四", "五", "六"];

/** 把日期拆成逐位数字：2026 / 08 / 19 */
function toDigits(y: number, m: number, d: number) {
  const s = `${y}${pad(m)}${pad(d)}`;
  return { chars: s.split(""), year: y, month: m, day: d };
}

/**
 * 万年历 · 日期轮盘（网页演示）：
 * 滚轮 / 点击箭头拨动日期，数字逐位滚动切换。
 * 产品当前展示版本尚未最终确定，仅供参考，一切以实物为准。
 */
export function CalendarSpotlight({ product, onOpen }: { product: Product; onOpen: (p: Product) => void }) {
  const today = new Date();
  const [date, setDate] = useState(() => ({
    y: today.getFullYear(),
    m: today.getMonth() + 1,
    d: today.getDate(),
  }));
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const wheelLock = useRef(0);


  const digits = useMemo(() => toDigits(date.y, date.m, date.d), [date]);
  const weekday = new Date(date.y, date.m - 1, date.d).getDay();

  const shift = (delta: number) => {
    setDate((prev) => {
      const t = new Date(prev.y, prev.m - 1, prev.d + delta);
      return { y: t.getFullYear(), m: t.getMonth() + 1, d: t.getDate() };
    });
  };

  const wheelBoxRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  /* 触摸：横向滑动翻日期，纵向滑动交给页面（不阻塞滚动） */
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const start = touchStart.current;
    if (!start) return;
    const t = e.touches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      const now = performance.now();
      if (now - wheelLock.current < 160) return;
      wheelLock.current = now;
      shift(dx > 0 ? 1 : -1);
      touchStart.current = { x: t.clientX, y: t.clientY }; // 以当前位置为基准继续
    }
  };
  const onTouchEnd = () => {
    touchStart.current = null;
  };

  /* 滚轮只在轮盘区域内生效：
     - preventDefault 阻止整页滚动（非 passive）
     - 按 delta 幅度换算天数，连续滚动持续翻动，可前可后，不锁死 */
  useEffect(() => {
    const el = wheelBoxRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = performance.now();
      if (now - wheelLock.current < 70) return; // 短节流：合并高频事件
      wheelLock.current = now;
      const raw = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY; // 行模式换算
      const days = Math.max(1, Math.round(Math.abs(raw) / 50));
      shift(raw > 0 ? days : -days);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groups = [
    { label: "年", span: 4, from: 0, to: 4 },
    { label: "月", span: 2, from: 4, to: 6 },
    { label: "日", span: 2, from: 6, to: 8 },
  ];

  return (
    <section id="calendar" className="relative mx-auto max-w-[1680px] px-5 py-16 md:px-10 md:py-24">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
        {/* 产品图（3D 视差） */}
        <div className="order-2 lg:order-1 lg:col-span-6">
          <Reveal>
            <div
              className="relative mx-auto max-w-md [perspective:1100px]"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width - 0.5;
                const py = (e.clientY - r.top) / r.height - 0.5;
                setTilt({ x: py * -8, y: px * 10 });
              }}
              onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            >
              <motion.div
                animate={{ rotateX: tilt.x, rotateY: tilt.y }}
                transition={{ type: "spring", stiffness: 140, damping: 16 }}
                className="corner-frame border border-line bg-ink-2"
                style={{ transformStyle: "preserve-3d" }}
              >
                <ProductImage src={product.cover} alt={product.name} className="aspect-[3/2] w-full" />
                <span className="absolute top-3 left-3 tc-label bg-ink/70 px-2 py-1 text-paper/80 backdrop-blur">
                  {product.no}
                </span>
              </motion.div>
              <div className="mx-auto mt-2 h-3 w-2/3 rounded-[2px] bg-ink-3 shadow-lg" />
              <div className="tc-label mt-3 text-center text-mute">{SITE.disclaimer.preview}</div>
            </div>
          </Reveal>
        </div>

        {/* 日期轮盘 */}
        <div className="order-1 lg:order-2 lg:col-span-6">
          <SectionHeading kicker="SPOTLIGHT · TIME" title="万年历" en="CALENDAR" />
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-mute">
              学校主题定制万年历（{priceText(product)}）。下面是网页演示的日期轮盘，滚动鼠标或点击箭头即可拨动日期。
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-5 inline-block border border-rec/50 bg-rec/10 px-4 py-3">
              <div className="tc-label text-rec">⚠ {SITE.disclaimer.pending}</div>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <div
              ref={wheelBoxRef}
              className="mt-6 inline-block border border-line bg-ink-2/80 p-6 md:p-8"
              data-cursor="WHEEL"
              style={{ touchAction: "pan-y" }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div className="flex items-end gap-2 md:gap-3">
                {groups.map((g) => (
                  <div key={g.label} className="flex flex-col items-center">
                    <div className="flex overflow-hidden border-b border-paper/25 pb-1 font-mono text-5xl font-medium text-paper tabular-nums md:text-7xl">
                      {digits.chars.slice(g.from, g.to).map((c, i) => {
                        const pos = g.from + i;
                        return (
                          <span key={pos} className="relative h-[1.15em] w-[0.62em] overflow-hidden">
                            <AnimatePresence mode="popLayout" initial={false}>
                              <motion.span
                                key={c}
                                initial={{ y: "0.9em", opacity: 0, filter: "blur(3px)" }}
                                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                                exit={{ y: "-0.9em", opacity: 0, filter: "blur(3px)" }}
                                transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute inset-0 flex items-center justify-center"
                              >
                                {c}
                              </motion.span>
                            </AnimatePresence>
                          </span>
                        );
                      })}
                    </div>
                    <span className="tc-label mt-2 text-mute">{g.label}</span>
                  </div>
                ))}
                <div className="pb-6 pl-2 md:pb-7">
                  <div className="border border-line px-3 py-1.5 text-center">
                    <div className="tc-label text-mute">周</div>
                    <div className="font-display text-2xl text-rec md:text-3xl">{WEEK[weekday]}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
                <div className="flex gap-2">
                  <button
                    onClick={() => shift(-1)}
                    data-cursor="PREV"
                    className="flex h-10 w-10 items-center justify-center border border-paper/30 text-paper transition-colors hover:border-rec"
                    aria-label="前一天"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => shift(1)}
                    data-cursor="NEXT"
                    className="flex h-10 w-10 items-center justify-center border border-paper/30 text-paper transition-colors hover:border-rec"
                    aria-label="后一天"
                  >
                    →
                  </button>
                  <button
                    onClick={() =>
                      setDate({ y: today.getFullYear(), m: today.getMonth() + 1, d: today.getDate() })
                    }
                    data-cursor="TODAY"
                    className="border border-paper/30 px-4 tc-label text-paper transition-colors hover:border-rec"
                  >
                    回到今天
                  </button>
                </div>
                <span className="tc-label text-mute-2">演示用日期轮盘</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.22}>
            <button
              onClick={() => onOpen(product)}
              data-cursor="VIEW"
              className="mt-7 border border-paper/40 px-7 py-3 tc-label text-paper transition-colors hover:border-rec hover:bg-rec/15"
            >
              查看产品详情 →
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
