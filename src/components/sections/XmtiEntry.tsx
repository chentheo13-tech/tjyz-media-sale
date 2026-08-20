import { motion, useReducedMotion } from "framer-motion";
import { SITE } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { useTimecode } from "@/utils/timecode";

/**
 * XMTI 宣传入口（社团创作彩蛋）：
 * 从社团时间线（2026 · 未完待续……）自然过渡而来。
 * 仅使用 XMTI 线上页面已确认的信息，不虚构其界面视觉。
 * 整卡可点击，新窗口打开，带安全属性。
 */
export function XmtiEntry() {
  const reduced = useReducedMotion();
  const tc = useTimecode();
  const { xmti } = SITE;

  return (
    <section
      id="xmti"
      className="relative overflow-hidden border-t border-line bg-gradient-to-b from-ink-2/60 to-ink"
      aria-label="XMTI 新媒体人格测试"
    >
      {/* 过渡装饰：时间线继续延伸 */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-16 w-px -translate-x-1/2 bg-line" />

      <div className="relative mx-auto max-w-[1680px] px-5 py-16 md:px-10 md:py-24">
        <Reveal>
          <a
            href={xmti.url}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="ENTER"
            className="group relative block overflow-hidden border border-line bg-ink-2/80 transition-colors duration-500 hover:border-rec/60"
            aria-label={`${xmti.title}（新窗口打开）`}
          >
            {/* 背景装饰：扫描线与微光 */}
            <div className="scanlines pointer-events-none absolute inset-0 opacity-60" />
            {!reduced && (
              <motion.div
                className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-paper/[0.04] to-transparent"
                animate={{ y: ["-120%", "520%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
            )}

            <div className="relative grid gap-8 p-7 md:grid-cols-12 md:items-center md:p-12">
              {/* 左：文案 */}
              <div className="md:col-span-8">
                <div className="tc-label flex items-center gap-3 text-mute">
                  <span className="h-1.5 w-1.5 rounded-full bg-rec animate-blink" />
                  {xmti.kicker} · {tc}
                </div>
                <h3 className="mt-4 font-display text-3xl leading-tight text-paper transition-colors duration-500 group-hover:text-rec md:text-5xl">
                  {xmti.title}
                </h3>
                <div className="tc-label mt-3 text-mute">{xmti.sub}</div>
                <div className="mt-5 max-w-xl space-y-2.5">
                  {xmti.desc.map((line) => (
                    <p key={line} className="text-sm leading-relaxed text-paper-dim">
                      {line}
                    </p>
                  ))}
                </div>
                <div className="mt-5 tc-label text-mute-2">{xmti.tagline}</div>
              </div>

              {/* 右：CTA */}
              <div className="md:col-span-4 md:text-right">
                <div className="relative inline-block">
                  {/* 取景框装饰 */}
                  <div className="corner-frame mb-5 hidden border border-line bg-ink p-5 md:block">
                    <div className="stroke-text font-mono text-5xl font-bold tracking-widest">
                      XMTI
                    </div>
                    <div className="tc-label mt-2 text-mute">新媒体人格测试</div>
                  </div>
                  <span className="inline-flex items-center gap-3 border border-paper/40 px-8 py-4 tc-label text-paper transition-all duration-300 group-hover:border-rec group-hover:bg-rec group-hover:text-white md:px-10">
                    {xmti.cta}
                  </span>
                </div>
              </div>
            </div>

            {/* 底部状态条 */}
            <div className="relative flex items-center justify-between border-t border-line px-5 py-2.5 tc-label text-mute-2 md:px-12">
              <span>SCMC ARCHIVE · LINK</span>
              <span className="transition-colors duration-300 group-hover:text-rec">
                {xmti.url.replace("https://", "")}
              </span>
            </div>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
