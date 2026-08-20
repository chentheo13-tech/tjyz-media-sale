import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Product } from "@/data/products";
import { priceText } from "@/data/products";
import { ProductImage } from "@/components/ui/ProductImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { SITE } from "@/data/site";

/**
 * 小夜灯 · 明暗演示：
 * 点击点亮 / 熄灭（仅为网页演示效果）。
 * 产品当前展示版本尚未最终确定，仅供参考，一切以实物为准。
 */
export function LampSpotlight({ product, onOpen }: { product: Product; onOpen: (p: Product) => void }) {
  const [lit, setLit] = useState(false);
  const reduced = useReducedMotion();


  return (
    <section id="nightlight" className="relative overflow-hidden border-y border-line">
      {/* 环境明暗：灯亮时四周变暗，突出灯光（演示） */}
      <AnimatePresence>
        {lit && (
          <motion.div
            key="dim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="pointer-events-none absolute inset-0 z-10 bg-ink/60"
          />
        )}
      </AnimatePresence>

      {/* 光晕 */}
      <AnimatePresence>
        {lit && (
          <motion.div
            key="glow"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.55, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(255,188,120,0.9) 0%, rgba(255,120,60,0.45) 40%, transparent 68%)",
            }}
          />
        )}
      </AnimatePresence>

      {lit && !reduced && (
        <motion.div
          className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-[140vmin] w-[140vmin] -translate-x-1/2 -translate-y-1/2"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(255,170,90,0.05) 8deg, transparent 16deg, transparent 90deg, rgba(255,170,90,0.05) 98deg, transparent 106deg, transparent 180deg, rgba(255,170,90,0.05) 188deg, transparent 196deg, transparent 270deg, rgba(255,170,90,0.05) 278deg, transparent 286deg)",
          }}
        />
      )}

      <div className="relative z-20 mx-auto grid max-w-[1680px] gap-12 px-5 py-16 md:px-10 md:py-24 lg:grid-cols-12 lg:items-center">
        {/* 文案 */}
        <div className="order-2 lg:order-1 lg:col-span-4">
          <SectionHeading kicker="SPOTLIGHT · LIGHT" title="小夜灯" en="NIGHT LIGHT" />
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-mute">
              学校主题定制小夜灯（{priceText(product)}）。点击图片可预览点亮效果——这是网页演示，并非产品功能说明。
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-5 border border-rec/50 bg-rec/10 px-4 py-3">
              <div className="tc-label text-rec">⚠ {SITE.disclaimer.pending}</div>
              <div className="tc-label mt-1 text-mute">{SITE.disclaimer.preview}</div>
            </div>
          </Reveal>
          <Reveal delay={0.22}>
            <div className="mt-7 flex gap-3">
              <button
                onClick={() => setLit((v) => !v)}
                data-cursor="LIGHT"
                className="bg-rec px-7 py-3 tc-label text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
              >
                {lit ? "熄灭演示" : "点亮演示"}
              </button>
              <button
                onClick={() => onOpen(product)}
                data-cursor="VIEW"
                className="border border-paper/40 px-7 py-3 tc-label text-paper transition-colors hover:border-rec"
              >
                产品详情 →
              </button>
            </div>
          </Reveal>
        </div>

        {/* 灯体 */}
        <div className="order-1 lg:order-2 lg:col-span-8">
          <Reveal>
            <div className="relative mx-auto max-w-lg">
              <button
                onClick={() => setLit((v) => !v)}
                data-cursor={lit ? "OFF" : "LIGHT"}
                className="corner-frame relative block w-full overflow-hidden border border-line bg-ink-2"
                aria-label="点击预览夜灯点亮效果"
              >
                <ProductImage
                  src={product.cover}
                  alt={product.name}
                  className="aspect-[3/2] w-full"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-ink/80 transition-opacity duration-1000"
                  style={{ opacity: lit ? 0 : 1 }}
                />
                <div
                  className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
                  style={{
                    opacity: lit ? 0.18 : 0,
                    background:
                      "radial-gradient(circle at 50% 42%, rgba(255,210,150,0.9), transparent 60%)",
                    mixBlendMode: "screen",
                  }}
                />
                <span className="absolute top-3 left-3 tc-label bg-ink/70 px-2 py-1 text-paper/80 backdrop-blur">
                  {product.no}
                </span>
                <span className="absolute right-3 bottom-3 tc-label bg-ink/70 px-2 py-1 backdrop-blur">
                  {lit ? "● 演示点亮中" : "○ 点击预览点亮"}
                </span>
              </button>
              <div className="mx-auto mt-2 h-3 w-2/3 rounded-[2px] bg-ink-3 shadow-lg" />
              <div className="tc-label mt-3 text-center text-mute">
                {SITE.disclaimer.preview}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
