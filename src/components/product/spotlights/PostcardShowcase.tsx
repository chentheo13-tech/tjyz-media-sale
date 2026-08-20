import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { POSTCARDS, POSTCARD_COUNT } from "@/data/postcards";
import { productById, priceText } from "@/data/products";
import type { Product } from "@/data/products";
import { ProductImage } from "@/components/ui/ProductImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/utils/cn";
import { useFinePointer, useViewport } from "@/hooks/useMedia";

/* ==================================================================
 * 明信片展区（实体明信片堆叠 + 点击驱动展开）
 * 默认：10 张自然堆叠（每张轻微位移 / 角度差 / 层级 / 阴影）
 * hover（仅反馈）：整叠轻微扇形 + 悬停卡轻微放大提示可点击
 * 点击：抽出当前卡 → 放大进入展示位（主视觉），后方卡片模糊、背景压暗
 * 点击另一张：立即切换（不依赖 hover / mouseleave）
 * 关闭：点空白 / ✕ / ESC / 再点当前卡
 * ================================================================== */

const N = POSTCARDS.length; // 10

type Mode = "stack" | "fan";

/** 三种状态下的卡片变换（gap：扇形间距，按容器宽度适配） */
function cardTransform(
  i: number,
  mode: Mode,
  focused: number | null,
  gap: number,
): { x: number; y: number; rotate: number; zIndex: number } {
  if (mode === "stack") {
    /* 自然堆叠：轻微位移 + 角度差 + 层级 */
    return {
      x: (i - (N - 1) / 2) * 2.6,
      y: i * 5,
      rotate: (i - (N - 1) / 2) * 0.8,
      zIndex: i + 1,
    };
  }
  /* 扇形（hover 反馈）：轻微展开，间距足够避免误点 */
  const base = {
    x: (i - (N - 1) / 2) * gap,
    y: Math.abs(i - (N - 1) / 2) * 3,
    rotate: (i - (N - 1) / 2) * 3.2,
    zIndex: i + 1,
  };
  if (focused === null) return base;
  if (i === focused) return { ...base, zIndex: 100 };
  const dir = i < focused ? -1 : 1;
  return { x: base.x + dir * 14, y: base.y, rotate: base.rotate + dir * 1.2, zIndex: i + 1 };
}

function PostcardFanStack({ onOpen }: { onOpen: (p: Product) => void }) {
  const fine = useFinePointer();
  const { isMobile } = useViewport();
  const reduced = useReducedMotion();
  const [stageHover, setStageHover] = useState(false);
  const [focused, setFocused] = useState<number | null>(null);
  const [extracted, setExtracted] = useState<number | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  /* 触屏没有 hover：默认轻度扇形以便点选；PC 默认自然堆叠 */
  const mode: Mode = stageHover || (!fine && extracted === null) ? "fan" : "stack";

  /* ESC 放回 */
  useEffect(() => {
    if (extracted === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExtracted(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [extracted]);

  const cardW = isMobile ? 104 : 148;
  const cardH = cardW * 1.25;
  /* 扇形间距：保证展开总宽不超出容器（手机 24 / 桌面 30） */
  const fanGap = isMobile ? 24 : 30;
  const extractedCard = extracted !== null ? POSTCARDS[extracted] : null;

  /** 点击卡片：打开 / 切换 / 再次点击当前卡关闭 */
  const pick = (i: number) => {
    setHasInteracted(true);
    setExtracted((cur) => (cur === i ? null : i));
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
      {/* 左：文案 + 购买入口 */}
      <div className="lg:col-span-4">
        <div className="tc-label flex items-center gap-3 text-mute">
          <span className="h-1.5 w-1.5 rounded-full bg-rec" />
          实体明信片堆叠 · POSTCARD STACK
        </div>
        <h3 className="mt-3 font-display text-3xl leading-snug text-paper md:text-4xl">
          十张明信片，
          <br />
          像一叠刚洗好的照片
        </h3>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-mute">
          悬停会轻微展开，点击取出查看正面；再点另一张即可切换，点空白处或 ESC 放回。共 {N}{" "}
          款，单张 ¥{POSTCARD_COUNT.pricePerCard}，十张套装 ¥{POSTCARD_COUNT.priceSet}。
        </p>

        <div className="mt-6 space-y-3 border border-line bg-ink-2/70 p-4">
          <button
            onClick={() => {
              const p = productById("postcard");
              if (p) onOpen(p);
            }}
            data-cursor="VIEW"
            className="flex w-full items-center justify-between border border-paper/40 px-4 py-3 tc-label text-paper transition-colors hover:border-rec hover:bg-rec/10"
          >
            <span>单张选购</span>
            <span className="text-rec">{priceText(productById("postcard")!)}</span>
          </button>
          <button
            onClick={() => {
              const p = productById("postcard-set");
              if (p) onOpen(p);
            }}
            data-cursor="VIEW"
            className="flex w-full items-center justify-between border border-rec/60 bg-rec/10 px-4 py-3 tc-label text-rec transition-colors hover:bg-rec/20"
          >
            <span>十张套装 · SET</span>
            <span>{priceText(productById("postcard-set")!)}</span>
          </button>
        </div>

        {/* 重置按钮：无操作时不显示；点击过明信片后出现 */}
        <AnimatePresence>
          {hasInteracted && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => {
                setExtracted(null);
                setFocused(null);
              }}
              data-cursor="RESET"
              className="mt-4 border border-line px-6 py-3 tc-label text-mute transition-colors hover:border-rec hover:text-rec"
              aria-label="重置明信片叠放状态"
            >
              ↺ 重置叠放
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* 右：展示区（槽位 + 堆叠） */}
      <div
        className="relative mx-auto w-full max-w-[440px] lg:col-span-8"
        onMouseEnter={() => fine && setStageHover(true)}
        onMouseMove={() => fine && extracted === null && setStageHover(true)}
        onMouseLeave={() => {
          setStageHover(false);
          setFocused(null);
        }}
      >
        {/* 展开时的压暗 + 模糊背景（点击关闭） */}
        <AnimatePresence>
          {extracted !== null && (
            <motion.div
              key="stage-dim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute -inset-x-8 -inset-y-10 z-[2] rounded-xl bg-ink/55 backdrop-blur-md"
              onClick={() => setExtracted(null)}
              aria-label="点击空白处关闭"
            />
          )}
        </AnimatePresence>

        {/* 展示槽位（主视觉，保持清晰） */}
        <div
          className={cn(
            "relative z-20 mx-auto aspect-square w-[78%] overflow-hidden border bg-ink-3 transition-colors duration-500",
            extracted !== null ? "border-paper/40" : "border-dashed border-paper/20",
          )}
        >
          <AnimatePresence>
            {extractedCard ? (
              <motion.div
                key={extractedCard.id}
                initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <ProductImage src={extractedCard.img} alt={extractedCard.name} className="h-full w-full" eager />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/85 to-transparent p-3 pt-10">
                  <div>
                    <div className="font-display text-lg text-paper">{extractedCard.name}</div>
                    {extractedCard.tag && (
                      <span className="mt-0.5 inline-block tc-label border border-rec/50 bg-rec/15 px-1.5 py-0.5 text-rec">
                        {extractedCard.tag}
                      </span>
                    )}
                  </div>
                  <span className="tc-label text-mute">
                    {extractedCard.no} · ¥{POSTCARD_COUNT.pricePerCard} / 张
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="slot-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center"
              >
                <span className="tc-label text-mute-2">DISPLAY · 展示位</span>
                <span className="text-xs text-mute-2">
                  点击下方任意一张明信片
                  <br />
                  取出查看正面
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 关闭按钮 */}
          {extracted !== null && (
            <button
              onClick={() => setExtracted(null)}
              data-cursor="CLOSE"
              className="absolute top-2.5 right-2.5 z-10 flex h-9 w-9 items-center justify-center border border-paper/40 bg-ink/70 text-paper backdrop-blur transition-colors hover:border-rec hover:bg-rec/15"
              aria-label="放回明信片"
            >
              ✕
            </button>
          )}
        </div>

        {/* 堆叠区：hover 就近聚焦（仅视觉反馈），点击驱动展开 */}
        <motion.div
          className="relative z-[5] mt-8 h-[190px] md:h-[220px]"
          style={{ minHeight: cardH + 24 }}
          animate={
            extracted !== null && !reduced
              ? { filter: "blur(7px)", opacity: 0.55 }
              : { filter: "blur(0px)", opacity: 1 }
          }
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          onMouseMove={(e) => {
            if (!fine) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const center = rect.width / 2;
            const idx = Math.round((x - center) / fanGap + (N - 1) / 2);
            setFocused(Math.min(N - 1, Math.max(0, idx)));
          }}
          onMouseLeave={() => fine && setFocused(null)}
        >
          {POSTCARDS.map((c, i) => {
            const t = cardTransform(i, mode, focused, fanGap);
            const isExtracted = extracted === i;
            return (
              <motion.button
                key={c.id}
                onPointerDown={() => setFocused(i)}
                onClick={() => pick(i)}
                data-cursor="PICK"
                aria-label={extracted === i ? `放回${c.name}` : `取出${c.name}`}
                aria-pressed={extracted === i}
                className="absolute bottom-0 left-1/2"
                initial={false}
                animate={
                  isExtracted
                    ? { x: -cardW / 2 + t.x, y: -(cardH * 2.3), rotate: 0, scale: 1.7, opacity: 0, zIndex: 99 }
                    : { x: -cardW / 2 + t.x, y: -t.y, rotate: t.rotate, scale: 1, opacity: 1, zIndex: t.zIndex }
                }
                transition={reduced ? { duration: 0.1 } : { type: "spring", stiffness: 130, damping: 18 }}
                style={{
                  width: cardW,
                  height: cardH,
                  transformOrigin: "50% 100%",
                  pointerEvents: isExtracted ? "none" : "auto",
                }}
                whileHover={extracted === null && fine ? { scale: 1.05 } : undefined}
                whileTap={{ scale: 0.96 }}
              >
                <span
                  className={cn(
                    "block h-full w-full overflow-hidden border bg-ink-3 shadow-lg shadow-black/60 transition-colors duration-300",
                    focused === i ? "border-rec" : "border-paper/25",
                  )}
                >
                  <ProductImage src={c.thumb} alt={c.name} className="h-full w-full" eager />
                </span>
                <span className="pointer-events-none absolute bottom-1 left-1 tc-label bg-ink/70 px-1 py-0.5 text-paper/85">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        <div className="relative z-[5] mt-4 flex items-center justify-between tc-label text-mute-2">
          <span>共 {N} 款 · 点击取出 / 再点切换</span>
          <span>
            {extracted === null
              ? "尚未取出"
              : `已取出 ${String(extracted + 1).padStart(2, "0")} / 10 · 点空白处放回`}
          </span>
        </div>
      </div>
    </div>
  );
}

export function PostcardShowcase({ onOpen }: { onOpen: (p: Product) => void }) {
  return (
    <section id="postcards" className="relative mx-auto max-w-[1680px] px-5 py-16 md:px-10 md:py-24">
      <div className="mb-10 lg:mb-14">
        <SectionHeading
          kicker="SPOTLIGHT · PAPER"
          title="明信片"
          en={`POSTCARDS · ${POSTCARD_COUNT.total} DESIGNS`}
        />
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-mute">
            共 {POSTCARD_COUNT.total} 款明信片。每款的具体介绍将随实物画面补充。
          </p>
        </Reveal>
      </div>

      <Reveal>
        <PostcardFanStack onOpen={onOpen} />
      </Reveal>
    </section>
  );
}
