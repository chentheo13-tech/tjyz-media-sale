import { sortedProducts } from "@/data/products";
import { ProductImage } from "@/components/ui/ProductImage";

/**
 * 胶片传送带：产品封面横向滚动（纯 CSS transform 动画，暂停于 hover）。
 * 商品图 contain，不裁切。
 */
export function FilmstripMarquee() {
  const row = [...sortedProducts, ...sortedProducts]; // 复制一份实现无缝循环

  return (
    <section className="relative border-y border-line bg-ink-2/60 py-5 overflow-hidden" aria-label="产品胶片带">
      {/* 齿孔带 */}
      <div
        className="pointer-events-none absolute top-0 left-0 h-2.5 w-full"
        style={{
          background:
            "repeating-linear-gradient(to right, rgba(242,239,230,0.85) 0 14px, transparent 14px 30px)",
          opacity: 0.22,
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-2.5 w-full"
        style={{
          background:
            "repeating-linear-gradient(to right, rgba(242,239,230,0.85) 0 14px, transparent 14px 30px)",
          opacity: 0.22,
        }}
      />

      <div className="group flex w-max animate-marquee-slow hover:[animation-play-state:paused]">
        {row.map((p, i) => (
          <a
            key={`${p.id}-${i}`}
            href="#products"
            data-cursor={p.nameEn.toUpperCase()}
            className="relative mx-2 block h-36 w-28 shrink-0 overflow-hidden border border-line bg-ink-3 transition-colors duration-300 hover:border-rec/70 md:h-44 md:w-36"
            aria-label={p.name}
          >
            <ProductImage src={p.cover} alt={p.name} className="h-full w-full" eager />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent px-2 pt-6 pb-1.5">
              <span className="block truncate text-[11px] text-paper/90">{p.name}</span>
              <span className="tc-label text-mute">{p.no}</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
