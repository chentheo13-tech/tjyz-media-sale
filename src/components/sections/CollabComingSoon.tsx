import { useReducedMotion } from "framer-motion";
import { SITE } from "@/data/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProductImage } from "@/components/ui/ProductImage";

/**
 * 联名企划 Coming Soon：
 * 三个联名对象均为「联名企划 · 即将上线」。
 * 具体产品未确定——只营造期待感，不虚构联名内容与产品。
 */
export function CollabComingSoon() {
  const reduced = useReducedMotion();
  const { collabs } = SITE;

  return (
    <section id="collabs" className="relative mx-auto max-w-[1680px] px-5 py-16 md:px-10 md:py-24">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading kicker={collabs.kicker} title={collabs.title} en="COMING SOON" />
        <Reveal delay={0.1}>
          <div className="flex items-center gap-3 border border-rec/50 bg-rec/10 px-4 py-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-rec animate-blink" />
            <span className="tc-label text-rec">{collabs.status}</span>
          </div>
        </Reveal>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {collabs.list.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.08}>
            <div
              className="group relative aspect-[4/3] overflow-hidden border border-line bg-ink-2"
              data-cursor="COMING SOON"
            >
              {/* 真实合作视觉：默认半透明轻模糊，悬停时清晰 */}
              <div className="absolute inset-0">
                <ProductImage
                  src={c.image}
                  alt={`${SITE.name} × ${c.name} 合作视觉`}
                  className="h-full w-full transition-[filter,opacity] duration-700 group-hover:blur-0 group-hover:opacity-90"
                  imgClassName="!opacity-70 blur-[2px] transition-all duration-700 group-hover:!opacity-100 group-hover:blur-0"
                  eager={i === 0}
                />
              </div>

              {/* 半透明遮罩 + 信息 */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="tc-label text-mute">
                  {SITE.name} <span className="text-rec">×</span> {c.name}
                </div>
                <div className="mt-1.5 font-display text-2xl text-paper">{c.name}</div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="tc-label text-mute-2 transition-colors duration-500 group-hover:text-rec">
                    {collabs.statusEn}
                  </span>
                  <span className="tc-label text-rec opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    敬请期待 →
                  </span>
                </div>
              </div>

              {/* hover 微扫光 */}
              {!reduced && (
                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-paper/[0.05] to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              )}
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <p className="mt-6 tc-label text-mute-2">{collabs.note}</p>
      </Reveal>
    </section>
  );
}
