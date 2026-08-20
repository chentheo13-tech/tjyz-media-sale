import { SITE } from "@/data/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProductImage } from "@/components/ui/ProductImage";
import { useTimecode } from "@/utils/timecode";
import { asset } from "@/utils/paths";

const FRAMES = [
  { src: asset("/images/backgrounds/campus-01.webp"), label: "SCENE 01", note: "校园风景 · 实拍" },
  { src: asset("/images/backgrounds/campus-02.webp"), label: "SCENE 02", note: "校园风景 · 实拍" },
  { src: asset("/images/backgrounds/campus-03.webp"), label: "SCENE 03", note: "校园风景 · 实拍" },
];

/**
 * 关于学生新媒体社团：
 * 简短介绍 + 校园影像帧（占位，待真实照片）+ 社团时间线（2022–2026）。
 */
export function AboutUs() {
  const tc = useTimecode();
  const { aboutUs } = SITE;

  return (
    <section id="about-us" className="relative mx-auto max-w-[1680px] px-5 py-16 md:px-10 md:py-24">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionHeading kicker={aboutUs.kicker} title={aboutUs.title} en="OUR ARCHIVE" />
          {aboutUs.paragraphs.map((text, i) => (
            <Reveal key={i} delay={0.1 + i * 0.08}>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-mute md:text-base">
                {text}
              </p>
            </Reveal>
          ))}
        </div>
        <div className="flex items-end justify-start lg:col-span-5 lg:justify-end">
          <Reveal delay={0.15}>
            <div className="border border-line bg-ink-2/70 px-6 py-5 tc-label text-mute">
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-rec animate-blink" />
                <span className="text-paper/80">ARCHIVE · 影像档案</span>
              </div>
              <div className="mt-3 space-y-1.5 text-mute-2">
                <div>校园影像帧：3 张真实校园风景</div>
                <div>当前时间码：{tc}</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* 素材帧画廊（占位） */}
      <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {FRAMES.map((f, i) => (
          <Reveal key={f.src} delay={i * 0.07}>
            <div
              className="group relative aspect-[16/10] overflow-hidden border border-line bg-ink-2"
              data-cursor="SCENE"
            >
              <ProductImage
                src={f.src}
                alt={f.note}
                className="h-full w-full"
                imgClassName="transition-transform duration-[1200ms] group-hover:scale-[1.07]"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/85 to-transparent p-3 pt-8">
                <div>
                  <div className="tc-label text-rec">{f.label}</div>
                  <div className="mt-0.5 text-xs text-paper/85">{f.note}</div>
                </div>
                <span className="tc-label text-mute-2">FRM {String(i + 1).padStart(3, "0")}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* 社团时间线：2022 → 2026 */}
      <div className="mt-14 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <div className="tc-label text-mute">TIMELINE · 社团时间线</div>
        </div>
        <div className="lg:col-span-9">
          <div className="relative border-l border-line pl-8">
            {aboutUs.timeline.map((ev, i) => {
              const isLast = i === aboutUs.timeline.length - 1;
              return (
                <Reveal key={ev.time} delay={i * 0.06} from="none" className="relative pb-9 last:pb-0">
                  <span className="absolute top-1 -left-[37px] flex h-4 w-4 items-center justify-center">
                    <span
                      className={
                        isLast
                          ? "h-2.5 w-2.5 rounded-full bg-rec animate-blink"
                          : "h-2 w-2 rounded-full border border-paper/40 bg-ink"
                      }
                    />
                  </span>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
                    <span className="font-mono text-xl text-rec">{ev.time}</span>
                    <span
                      className={
                        isLast
                          ? "font-display text-xl text-paper md:text-2xl"
                          : "text-sm text-paper-dim md:text-base"
                      }
                    >
                      {ev.event}
                    </span>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
