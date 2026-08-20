import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { SITE } from "@/data/site";
import { productById } from "@/data/products";
import { useFinePointer } from "@/hooks/useMedia";
import { asset } from "@/utils/paths";

const EASE = [0.16, 1, 0.3, 1] as const;

function Line({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className="origin-top"
    >
      <div className="h-px w-full bg-line" />
    </motion.div>
  );
}

/** 首页首屏：时间码 + 大标题 + 影像画框组合 + 鼠标视差 */
export function Hero({ booted }: { booted: boolean }) {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  /* 鼠标视差（仅桌面） */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 18 });
  const sy = useSpring(my, { stiffness: 40, damping: 18 });
  const imgX = useTransform(sx, (v) => v * 22);
  const imgY = useTransform(sy, (v) => v * 16);
  const imgX2 = useTransform(sx, (v) => v * -14);
  const imgY2 = useTransform(sy, (v) => v * -10);

  useEffect(() => {
    if (!fine || reduced) return;
    const on = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", on, { passive: true });
    return () => window.removeEventListener("mousemove", on);
  }, [fine, reduced, mx, my]);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden scanlines"
    >
      {/* 背景装饰大字 */}
      <div className="pointer-events-none absolute inset-x-0 top-[12%] select-none overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={booted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.4, ease: EASE, delay: 0.5 }}
          className="stroke-text whitespace-nowrap text-center font-mono text-[11vw] leading-none font-bold tracking-tight"
        >
          CHARITY SALE {SITE.year}
        </motion.div>
      </div>

      {/* 缓慢扫描光束 */}
      {!reduced && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ y: "-20%" }}
            animate={{ y: "120vh" }}
            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
            className="h-40 w-full bg-gradient-to-b from-transparent via-paper/[0.03] to-transparent"
          />
        </div>
      )}

      <motion.div
        style={reduced ? undefined : { y: parallaxY, opacity: heroOpacity }}
        className="relative mx-auto grid w-full max-w-[1680px] gap-10 px-5 pt-28 pb-16 md:px-10 lg:grid-cols-12 lg:items-center lg:gap-6"
      >
        {/* 左：文案 */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0 }}
            animate={booted ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-wrap items-center gap-3 tc-label text-mute"
          >
            <span className="flex items-center gap-2 text-rec">
              <span className="h-1.5 w-1.5 rounded-full bg-rec animate-blink" />
              REC
            </span>
            <span className="text-paper/70">
              {SITE.nameEn} · {SITE.eventEn} {SITE.year}
            </span>
          </motion.div>

          <h1 className="mt-6">
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={booted ? { y: 0 } : {}}
                transition={{ duration: 1, ease: EASE, delay: 0.25 }}
                className="block font-display text-[13.5vw] leading-[1.08] text-paper sm:text-6xl md:text-7xl xl:text-[84px]"
              >
                {SITE.heroTitle}
              </motion.span>
            </span>
            <span className="mt-2 block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={booted ? { y: 0 } : {}}
                transition={{ duration: 1, ease: EASE, delay: 0.38 }}
                className="block font-display text-[9vw] leading-[1.15] text-paper sm:text-4xl md:text-5xl xl:text-6xl"
              >
                校园义卖<span className="text-rec">线上展厅</span>
              </motion.span>
            </span>
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={booted ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-6 max-w-xl"
          >
            <Line />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={booted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.65, ease: EASE }}
            className="mt-6 max-w-xl text-sm leading-relaxed text-mute md:text-base"
          >
            一场关于「记录」的校园义卖。17 件校园纪念品，
            把日常的校园记忆做成可以带走的小物——欢迎进入这间线上展厅。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={booted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() => go("products")}
              data-cursor="ENTER"
              className="group relative overflow-hidden bg-rec px-8 py-4 tc-label text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
            >
              <span className="relative z-10">进入展厅</span>
              <span className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-500 group-hover:translate-x-0" />
            </button>
            <button
              onClick={() => go("about-sale")}
              data-cursor="ABOUT"
              className="border border-line px-8 py-4 tc-label text-paper transition-colors duration-300 hover:border-paper/50"
            >
              关于义卖
            </button>
          </motion.div>
        </div>

        {/* 右：影像画框组合（桌面） */}
        <div className="relative hidden lg:col-span-5 lg:block" aria-hidden>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={booted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: EASE, delay: 0.55 }}
            style={fine && !reduced ? { x: imgX, y: imgY } : undefined}
            className="relative ml-auto w-[82%]"
          >
            <div className="corner-frame relative aspect-[4/5] overflow-hidden border border-line">
              <img
                src={productById("jacket")!.cover}
                alt="冲锋衣"
                className="media-img media-img--contain transition-transform duration-[1.6s] hover:scale-105"
                draggable={false}
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-ink/80 to-transparent px-4 py-3">
                <span className="tc-label text-paper/80">SM-002 · JACKET</span>
                <span className="tc-label text-rec">00:00:02:05</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={booted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: EASE, delay: 0.75 }}
            style={fine && !reduced ? { x: imgX2, y: imgY2 } : undefined}
            className="absolute -bottom-10 left-0 w-[46%] border border-line shadow-2xl shadow-black/60"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={asset("/images/products/postcard/cards/card-01.webp")}
                alt="明信片"
                className="media-img media-img--contain"
                draggable={false}
              />
              <span className="absolute top-2 left-2 tc-label bg-ink/70 px-2 py-1 text-paper/80 backdrop-blur">
                PC-01 · 明信片
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={booted ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: EASE, delay: 0.9 }}
            style={fine && !reduced ? { x: imgX, y: imgY2 } : undefined}
            className="absolute -top-8 right-0 w-[34%] border border-line shadow-xl shadow-black/60"
          >
            <div className="relative aspect-square overflow-hidden">
              <img
                src={productById("night-light")!.cover}
                alt="小夜灯"
                className="media-img media-img--contain"
                draggable={false}
              />
              <span className="absolute right-2 bottom-2 tc-label bg-ink/70 px-2 py-1 text-paper/80 backdrop-blur">
                SM-005 · 小夜灯
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={booted ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1.05 }}
            className="absolute top-1/2 -left-2 -translate-y-1/2 tc-label text-mute"
            style={{ writingMode: "vertical-rl" }}
          >
            FRAME 001 — 003 · ON AIR
          </motion.div>
        </div>
      </motion.div>

      {/* 底部状态条 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={booted ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute inset-x-0 bottom-0 border-t border-line bg-ink/60 backdrop-blur"
      >
        <div className="mx-auto flex max-w-[1680px] items-center justify-between px-5 py-3 md:px-10">
          <div className="flex items-center gap-3 tc-label text-mute">
            <span className="hidden sm:inline">SCROLL</span>
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block text-rec"
            >
              ↓
            </motion.span>
            <span className="hidden text-mute-2 sm:inline">TO EXPLORE THE EXHIBITION</span>
          </div>
          <div className="flex items-center gap-5 tc-label text-mute">
            <span>17 PRODUCTS</span>
            <span className="hidden md:inline">05 SERIES</span>
            <span className="text-rec">公益方向 · 凉山</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
