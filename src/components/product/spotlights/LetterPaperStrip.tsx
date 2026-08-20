import { ProductImage } from "@/components/ui/ProductImage";
import { productById, priceText } from "@/data/products";
import type { Product } from "@/data/products";

/**
 * 信纸专区（仅信纸单品，不包含其他产品结构）：
 * hover：轻微翻开预览（角度小、不穿模、平滑恢复）
 * click：打开详情查看完整信纸（放大 + 关闭）
 */
export function LetterPaperStrip({ onOpen }: { onOpen: (p: Product) => void }) {
  const letter = productById("letter-paper");
  if (!letter) return null;

  return (
    <section id="letter-paper" className="relative border-y border-line bg-ink-2/50">
      <div className="mx-auto max-w-[1680px] px-5 py-14 md:px-10 md:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-rec" />
              <span className="tc-label text-mute">PAPER · 信纸</span>
            </div>
            <h3 className="mt-3 font-display text-3xl text-paper md:text-4xl">
              信纸 · 单品
            </h3>
          </div>
          <div className="tc-label text-mute-2">单品 {priceText(letter)} · 悬停预览 · 点击查看</div>
        </div>

        <div className="mx-auto max-w-2xl">
          <button
            onClick={() => onOpen(letter)}
            data-cursor="OPEN"
            className="group relative block w-full text-left [perspective:1600px]"
            aria-label={`查看${letter.name}详情`}
          >
            <div className="relative aspect-[3/2] w-full overflow-hidden border border-line bg-[#efe9dc] shadow-lg shadow-black/40">
              {/* 底层纸页（翻开的"内页"暗示） */}
              <div className="absolute inset-0 flex flex-col justify-between bg-[#f7f2e7] p-5 md:p-7">
                <div className="tc-label text-[#8d8674]">LETTER · 内页</div>
                <div className="space-y-2 opacity-50">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-[3px] bg-[#b9b09b]"
                      style={{ width: `${92 - i * 7}%` }}
                    />
                  ))}
                </div>
                <div className="tc-label text-[#8d8674]">学校主题 · 印有学校名称</div>
              </div>

              {/* 上层纸页：hover 轻微翻开（小角度、无穿模），移开自然恢复 */}
              <div
                className="absolute inset-0 origin-left transition-transform duration-500 ease-out
                  group-hover:[transform:rotateY(-9deg)_translateX(-6px)]
                  [transform-style:preserve-3d] will-change-transform"
              >
                <ProductImage
                  src={letter.cover}
                  alt={letter.name}
                  className="h-full w-full shadow-xl shadow-black/40"
                />
                <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between bg-ink/45 p-2.5 tc-label text-paper/85 backdrop-blur-sm">
                  <span>悬停预览</span>
                  <span className="text-rec">点击查看完整信纸 →</span>
                </div>
              </div>
            </div>

            <div className="mt-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate font-display text-lg text-paper">{letter.name}</div>
                <div className="tc-label mt-1 text-mute">单品 · 学校主题</div>
              </div>
              <span className="shrink-0 tc-label text-rec">{priceText(letter)}</span>
            </div>
          </button>

          <p className="mt-5 text-xs leading-relaxed text-mute">
            {letter.description}
          </p>
        </div>
      </div>
    </section>
  );
}
