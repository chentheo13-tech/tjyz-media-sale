import { SITE, QR_SLOTS } from "@/data/site";
import { ProductImage } from "@/components/ui/ProductImage";

/**
 * 页脚：购买方式（社长微信）+ 二维码位 + 免责声明 + 大字标。
 * 二维码图片直接覆盖 public/images/branding/ 下同名文件即可替换。
 */
export function Footer() {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer id="footer" className="relative border-t border-line bg-ink-2">
      <div className="mx-auto max-w-[1680px] px-5 py-14 md:px-10 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          {/* 标语 + 购买方式 */}
          <div className="md:col-span-6">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-paper/15 bg-white p-1">
                <img
                  src={SITE.badge}
                  alt={SITE.name}
                  className="h-full w-full object-contain"
                  draggable={false}
                />
              </span>
              <div>
                <div className="tc-label text-mute">SCMC · {SITE.year}</div>
                <div className="mt-0.5 text-sm text-paper">{SITE.name}</div>
              </div>
            </div>
            <h2 className="mt-5 font-display text-4xl leading-tight text-paper md:text-5xl">
              让校园里的创意，
              <br />
              <span className="text-rec">走得更远。</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-mute">
              {SITE.footer.note}
            </p>

            {/* 购买方式 */}
            <div className="mt-7 border border-line bg-ink p-5">
              <div className="tc-label text-mute">HOW TO BUY · 购买方式</div>
              <ol className="mt-3 space-y-1.5">
                {SITE.purchase.steps.map((step, i) => (
                  <li key={step} className="flex items-center gap-2.5 text-sm text-paper">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center border border-rec/60 tc-label text-rec">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <p className="mt-2.5 tc-label text-mute-2">{SITE.purchase.note}</p>
            </div>
          </div>

          {/* 二维码区：统一视觉模块，与左列购买模块底部对齐 */}
          <div className="flex flex-col md:col-span-6">
            <div className="mt-auto border border-line bg-ink-2 p-5 md:p-6">
              <div className="tc-label mb-1 text-mute">SCAN · 扫码此处</div>
              <p className="mb-4 text-xs leading-relaxed text-mute-2">
                负责人微信与公众号为真实二维码；义卖商品展示为实拍图片
              </p>
              <div className="grid grid-cols-3 gap-4">
                {QR_SLOTS.map((qr) => (
                  <div key={qr.id} className="border border-line bg-ink p-3 text-center">
                    <ProductImage
                      src={qr.file}
                      alt={qr.label}
                      className="aspect-square w-full"
                      fit="cover"
                      placeholderBg="#f2efe6"
                    />
                    <div className="tc-label mt-2 text-mute">{qr.label}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* 免责声明 */}
        <div className="mt-12 border border-line bg-ink p-5 md:p-6">
          <div className="tc-label mb-3 text-rec">DISCLAIMER · 免责声明</div>
          <ul className="space-y-1.5 text-xs leading-relaxed text-mute">
            <li>· {SITE.disclaimer.pending}</li>
            <li>· {SITE.disclaimer.preview}</li>
            <li>· {SITE.disclaimer.rights}</li>
          </ul>
        </div>

        {/* 导航 + 公益方向 */}
        <div className="mt-12 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {SITE.nav.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className="text-sm text-paper/70 transition-colors hover:text-rec"
              >
                {n.label}
              </button>
            ))}
          </div>
          <div className="space-y-1 text-right">
            {SITE.footer.contact.map((c) => (
              <div key={c} className="tc-label text-mute">
                {c}
              </div>
            ))}
          </div>
        </div>

        {/* 大字标：完整展示不截断，超出时可横向滚动 */}
        <div className="mt-10 select-none overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <div className="stroke-text-strong whitespace-nowrap text-center font-mono text-[9vw] leading-none font-bold tracking-tight md:text-[8.5vw]">
            STUDENT MEDIA CENTER
          </div>
          <div className="mt-4 flex items-center justify-between tc-label text-mute-2">
            <span>© {SITE.year} {SITE.name}</span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-rec" />
              MADE WITH CAMERAS & KINDNESS
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
