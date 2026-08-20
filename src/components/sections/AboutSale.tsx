import { SITE } from "@/data/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProductImage } from "@/components/ui/ProductImage";
import { useTimecode } from "@/utils/timecode";
import { asset } from "@/utils/paths";

/**
 * 关于义卖：
 * 公益方向——四川凉山。文案不虚构受助人数、物资、学校或资金用途。
 * 购买方式唯一：添加社长微信 → 登记所需产品 → 完成付款。
 */
export function AboutSale() {
  const tc = useTimecode();
  const { aboutSale, purchase } = SITE;

  return (
    <section id="about-sale" className="relative overflow-hidden border-t border-line bg-ink-2/50">
      {/* 背景装饰时间轴 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 opacity-40">
        <div className="mx-auto flex h-full max-w-[1680px] items-center px-5 md:px-10">
          <span className="tc-label mr-3 text-rec">{tc}</span>
          <div className="relative h-px flex-1 bg-line">
            {Array.from({ length: 13 }).map((_, i) => (
              <span
                key={i}
                className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-paper/30"
                style={{ left: `${(i / 12) * 100}%` }}
              />
            ))}
            <span
              className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-rec animate-blink"
              style={{ left: "78%" }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1680px] gap-10 px-5 py-12 md:px-10 md:py-16 lg:grid-cols-12">
        {/* 左：标题 + 数据 + 购买方式 */}
        <div className="flex flex-col lg:col-span-5">
            <SectionHeading
              kicker={aboutSale.kicker}
              title={
                <>
                  {aboutSale.title.split("，")[0]}，
                  <br />
                  {aboutSale.title.split("，")[1]}
                </>
              }
              en="FOR LIANGSHAN"
            />
            <Reveal delay={0.14}>
              <div className="mt-6 grid grid-cols-2 gap-px border border-line bg-line">
                {aboutSale.stats.map((s) => (
                  <div key={s.label} className="bg-ink px-4 py-3.5">
                    <div className="font-display text-2xl text-rec md:text-3xl">{s.value}</div>
                    <div className="tc-label mt-1 text-mute">{s.label}</div>
                    <div className="tc-label text-mute-2">{s.en}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* 购买方式 */}
            <Reveal delay={0.18}>
              <div className="mt-5 border border-line bg-ink-2/70 p-3.5">
                <div className="tc-label mb-2.5 text-mute">GOODS · 义卖商品展示</div>
                <ProductImage
                  src={asset("/images/branding/sale-goods.webp")}
                  alt="义卖商品展示"
                  className="mx-auto aspect-square w-full max-w-[220px]"
                />
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-5 border border-line bg-ink-2 p-5">
                <div className="tc-label text-mute">HOW TO BUY · 购买方式</div>
                <div className="mt-3.5 flex items-center gap-5">
                  <div className="h-24 w-24 shrink-0 border border-line bg-paper">
                    <ProductImage
                      src={purchase.qrImage}
                      alt={purchase.qrLabel}
                      className="h-full w-full"
                      placeholderBg="#f2efe6"
                    />
                  </div>
                  <div>
                    <ol className="space-y-1.5">
                      {purchase.steps.map((step, i) => (
                        <li key={step} className="flex items-center gap-2.5 text-sm text-paper">
                          <span className="flex h-5 w-5 items-center justify-center border border-rec/60 tc-label text-rec">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                    <p className="mt-2.5 tc-label text-mute-2">{purchase.note}</p>
                  </div>
                </div>
              </div>
            </Reveal>
        </div>

        {/* 右：正文（底部与左侧购买模块对齐） */}
        <div className="flex flex-col lg:col-span-7">
          {aboutSale.paragraphs.map((text, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <p
                className={
                  i === aboutSale.paragraphs.length - 1
                    ? "mb-0 font-display text-xl leading-relaxed text-paper md:text-2xl"
                    : "mb-4 max-w-xl font-display text-xl leading-relaxed text-paper-dim md:text-2xl"
                }
              >
                {text}
              </p>
            </Reveal>
          ))}

          <Reveal delay={0.3} className="mt-auto">
            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-line pt-5 tc-label text-mute">
              <span className="flex items-center gap-2 text-rec">
                <span className="h-1.5 w-1.5 rounded-full bg-rec animate-blink" />
                {SITE.status.text}
              </span>
              <span>公益方向：四川凉山</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
