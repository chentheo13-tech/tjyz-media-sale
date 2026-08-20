import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Product } from "@/data/products";
import { priceText } from "@/data/products";
import { ProductImage } from "@/components/ui/ProductImage";
import { useViewport } from "@/hooks/useMedia";
import { SITE } from "@/data/site";

gsap.registerPlugin(ScrollTrigger);

/**
 * 冲锋衣 · 全屏 Lookbook：
 * 桌面端 GSAP 钉住 + 横向滚动；移动端回退为横滑 snap 容器。
 * 学校主题定制产品，不虚构面料与性能参数，质感以实物为准。
 */
export function JacketLookbook({ product, onOpen }: { product: Product; onOpen: (p: Product) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useViewport();


  useLayoutEffect(() => {
    if (isMobile) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const track = trackRef.current!;
        const distance = () =>
          Math.max(0, Math.min(track.scrollWidth - window.innerWidth, window.innerHeight * 2.2));
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }, sectionRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, [isMobile]);

  /* 真实样张仅一张 */
  const panels = [{ src: product.cover, label: "LOOK 01", note: "样张展示 · 以实物为准" }];

  return (
    <section
      ref={sectionRef}
      id="lookbook"
      className="relative overflow-hidden border-y border-line bg-ink-2"
      aria-label="冲锋衣 Lookbook"
    >
      {/* 桌面：横向滚动轨道 */}
      {!isMobile && (
        <div ref={trackRef} className="flex h-screen w-max">
          {/* 引导面板 */}
          <div className="relative flex h-full w-screen shrink-0 items-center justify-center">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
              <span className="stroke-text-strong whitespace-nowrap font-mono text-[13vw] leading-none font-bold tracking-tight">
                LOOKBOOK
              </span>
            </div>
            <div className="relative text-center">
              <div className="tc-label flex items-center justify-center gap-3 text-mute">
                <span className="h-1.5 w-1.5 rounded-full bg-rec animate-blink" />
                {product.no} · JACKET · 冲锋衣
              </div>
              <h3 className="mt-4 font-display text-5xl leading-tight text-paper md:text-7xl">
                学校主题定制，
                <br />
                <span className="text-rec">质感以实物为准。</span>
              </h3>
              <div className="tc-label mt-4 text-mute">样张展示 · {priceText(product)}</div>
              <button
                onClick={() => onOpen(product)}
                data-cursor="DETAIL"
                className="mt-8 border border-paper/40 px-8 py-3 tc-label text-paper transition-colors hover:border-rec hover:bg-rec/15"
              >
                查看产品详情 →
              </button>
            </div>
          </div>

          {/* 画面面板（60vw，整体更紧凑） */}
          {panels.map((pn) => (
            <div key={pn.label} className="relative h-full w-screen shrink-0 md:w-[60vw]">
              <ProductImage src={pn.src} alt={pn.label} className="absolute inset-0" eager />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/30" />
              <div className="absolute bottom-10 left-8 md:left-14">
                <div className="tc-label text-rec">{pn.label}</div>
                <div className="mt-2 font-display text-2xl text-paper md:text-4xl">{pn.note}</div>
              </div>
              <div className="absolute top-6 right-8 tc-label text-paper/70">
                {product.no} · {String(panels.indexOf(pn) + 1).padStart(2, "0")}/{String(panels.length).padStart(2, "0")}
              </div>
            </div>
          ))}

          {/* 收尾面板 */}
          <div className="flex h-full w-screen shrink-0 items-center justify-center">
            <div className="text-center">
              <div className="tc-label text-mute">END OF LOOKBOOK</div>
              <div className="tc-label mt-3 text-mute-2">{SITE.disclaimer.preview}</div>
              <button
                onClick={() => onOpen(product)}
                data-cursor="DETAIL"
                className="mt-5 border border-rec px-10 py-4 tc-label text-rec transition-colors hover:bg-rec hover:text-white"
              >
                查看冲锋衣详情
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 移动端：横滑 snap（弱吸附、大间距） */}
      {isMobile && (
        <div className="snap-prox flex gap-5 overflow-x-auto py-8 pl-5">
          <div className="flex h-[62vw] w-[76vw] shrink-0 flex-col items-start justify-center border border-line bg-ink p-6">
            <div className="tc-label flex items-center gap-2 text-mute">
              <span className="h-1.5 w-1.5 rounded-full bg-rec animate-blink" />
              {product.no} · 冲锋衣
            </div>
            <h3 className="mt-3 font-display text-3xl leading-snug text-paper">
              学校主题定制，
              <br />
              <span className="text-rec">质感以实物为准。</span>
            </h3>
            <div className="tc-label mt-2 text-mute">样张展示 · {priceText(product)}</div>
            <button
              onClick={() => onOpen(product)}
              className="mt-6 border border-paper/40 px-6 py-3 tc-label text-paper"
            >
              查看详情 →
            </button>
          </div>
          {panels.map((pn) => (
            <div
              key={pn.label}
              className="relative h-[62vw] w-[76vw] shrink-0 overflow-hidden border border-line"
            >
              <ProductImage src={pn.src} alt={pn.label} className="absolute inset-0" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-4 pt-10">
                <div className="tc-label text-rec">{pn.label}</div>
                <div className="mt-1 font-display text-lg text-paper">{pn.note}</div>
              </div>
            </div>
          ))}
          <div className="h-[62vw] w-[40vw] shrink-0" />
        </div>
      )}

      {/* 进度提示（桌面） */}
      {!isMobile && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 tc-label text-mute">
          横向滚动继续浏览 · SCROLL →
        </div>
      )}
    </section>
  );
}
