import { useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { priceText } from "@/data/products";
import { ProductImage } from "@/components/ui/ProductImage";

/**
 * 统一商品卡片：
 * - 全部卡片同一尺寸（aspect 4:5）、同一对齐系统（名称 / 价格 / 说明行位置一致）
 * - 图片区 object-fit: contain，商品主体绝不裁切、不拉伸
 * - 图片未加载时容器尺寸不变（不塌陷、不跳动）
 * - 套餐卡片带 SET 角标；样张 / 版本待定带提示角标
 */
export interface ProductCardProps {
  product: Product;
  onOpen: (p: Product) => void;
}

function CardBadges({ p }: { p: Product }) {
  return (
    <div className="pointer-events-none absolute top-2.5 left-2.5 z-10 flex flex-wrap items-center gap-1.5">
      <span className="tc-label bg-ink/60 px-2 py-1 text-paper/85 backdrop-blur-sm">{p.no}</span>
      {p.badge && (
        <span className="tc-label bg-rec px-2 py-1 text-white">{p.badge}</span>
      )}
    </div>
  );
}

/** 挂件：BOY / GIRL 对摆（拍摄 / 剪辑） */
function DuoContent({ p }: { p: Product }) {
  const side = p.id === "keychain-boy" ? "boy" : "girl";
  const dir = side === "boy" ? -1 : 1;
  return (
    <>
      <motion.div
        className="absolute inset-0"
        whileHover={{ rotate: 4 * dir, scale: 1.04 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
        style={{ transformOrigin: "50% 12%" }}
      >
        <ProductImage src={p.cover} alt={p.name} className="h-full w-full" />
      </motion.div>
      <span className="pointer-events-none absolute top-2.5 right-2.5 z-10 tc-label bg-ink/60 px-2 py-1 text-paper/85 backdrop-blur-sm">
        {side === "boy" ? "BOY · 拍摄" : "GIRL · 剪辑"}
      </span>
    </>
  );
}

/** 光栅闪卡：点击翻面（正面实物 / 背面信息） */
function FlipContent({ p }: { p: Product }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className="absolute inset-0 [perspective:1200px]"
      onClick={(e) => {
        e.stopPropagation();
        setFlipped((v) => !v);
      }}
      role="button"
      aria-label={flipped ? "翻回正面" : "翻到背面"}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0.24, 1] }}
      >
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <ProductImage src={p.cover} alt={p.name} className="h-full w-full" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-between bg-[#14141a] p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="tc-label text-mute">SM-016 · 背面</div>
          <div className="font-display text-lg leading-relaxed text-paper">
            光栅闪卡
            <br />
            <span className="text-base text-paper-dim">学校主题 · 不同角度呈现变化</span>
          </div>
          <div className="tc-label text-mute-2">点击翻回</div>
        </div>
      </motion.div>
      <span className="pointer-events-none absolute top-2.5 right-2.5 z-10 tc-label bg-ink/60 px-2 py-1 text-paper/85 backdrop-blur-sm">
        TAP · 翻面
      </span>
    </div>
  );
}

/** 小夜灯：点击点亮（网页演示） */
function LampContent({ p }: { p: Product }) {
  const [lit, setLit] = useState(false);
  return (
    <div
      className="absolute inset-0"
      onClick={(e) => {
        e.stopPropagation();
        setLit((v) => !v);
      }}
      role="button"
      aria-label={lit ? "熄灭夜灯演示" : "点亮夜灯演示"}
    >
      {lit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.9 }}
          className="pointer-events-none absolute left-1/2 top-[44%] h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255,188,120,0.9) 0%, rgba(255,120,60,0.4) 42%, transparent 70%)",
          }}
        />
      )}
      <ProductImage src={p.cover} alt={p.name} className="absolute inset-0" />
      <span className="pointer-events-none absolute top-2.5 right-2.5 z-10 tc-label bg-ink/60 px-2 py-1 text-paper/85 backdrop-blur-sm">
        {lit ? "● 演示点亮" : "○ 点击点亮"}
      </span>
    </div>
  );
}

/** 万年历：日期数字（仅装饰） */
function WheelContent({ p }: { p: Product }) {
  const d = new Date();
  const s = `${d.getFullYear()}·${String(d.getMonth() + 1).padStart(2, "0")}·${String(d.getDate()).padStart(2, "0")}`;
  return (
    <div className="absolute inset-0">
      <ProductImage src={p.cover} alt={p.name} className="absolute inset-0 opacity-60" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="font-mono text-3xl font-medium tracking-[0.25em] text-paper tabular-nums md:text-4xl">
          {s}
        </div>
      </div>
      <span className="pointer-events-none absolute top-2.5 right-2.5 z-10 tc-label bg-ink/60 px-2 py-1 text-paper/85 backdrop-blur-sm">
        TODAY
      </span>
    </div>
  );
}

export function ProductCard({ product: p, onOpen }: ProductCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="group relative col-span-1 sm:col-span-1"
    >
      <button
        onClick={() => onOpen(p)}
        data-cursor="VIEW"
        className="flex h-full w-full flex-col overflow-hidden border border-line bg-ink-2 text-left transition-colors duration-300 hover:border-paper/30"
        aria-label={`查看${p.name}详情`}
      >
        {/* 图片区：固定比例 contain，绝不裁切 */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink-3">
          <CardBadges p={p} />
          {p.interaction === "duo" && <DuoContent p={p} />}
          {p.interaction === "flip" && <FlipContent p={p} />}
          {p.interaction === "lamp" && <LampContent p={p} />}
          {p.interaction === "wheel" && <WheelContent p={p} />}
          {p.interaction === "plain" && (
            <ProductImage
              src={p.cover}
              alt={p.name}
              className="h-full w-full"
              imgClassName="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
            />
          )}
          {p.note && (
            <span className="pointer-events-none absolute right-2.5 bottom-2.5 z-10 tc-label max-w-[70%] border border-rec/50 bg-rec/15 px-2 py-1 text-right leading-relaxed text-rec backdrop-blur-sm">
              {p.note}
            </span>
          )}
        </div>

        {/* 信息区：固定结构，全站对齐 */}
        <div className="flex flex-1 flex-col justify-between gap-2 border-t border-line p-3.5">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-2 font-display text-lg leading-snug text-paper">
                {p.name}
              </h3>
            </div>
            <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-paper-dim/90">
              {p.description}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span
              className={`tc-label ${p.price == null ? "text-mute" : "text-rec"}`}
            >
              {priceText(p)}
            </span>
            <span className="tc-label text-mute-2 transition-colors group-hover:text-paper/80">
              查看详情 +
            </span>
          </div>
        </div>
      </button>
    </motion.article>
  );
}
