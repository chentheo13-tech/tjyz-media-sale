import { useEffect, useRef } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import type { CategoryId, Product } from "@/data/products";
import { CATEGORIES, sortedProducts } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/utils/cn";
import { refreshScrollTrigger, observeScrollTrigger } from "@/utils/scrollTrigger";
import { SITE } from "@/data/site";

export interface ExhibitionGridProps {
  cat: CategoryId | "all";
  onCatChange: (c: CategoryId | "all") => void;
  onOpen: (p: Product) => void;
}

/**
 * 义卖产品展厅：分类筛选 + 统一卡片网格。
 * - 套餐商品同时出现在"商品分类"和"套餐"筛选（多分类）
 * - 切换分类：旧卡片淡出 → 数据更新 → 布局高度重算 → 新卡片淡入
 * - 布局动画结束后刷新 ScrollTrigger，防止高度残留 / 长空白
 */
export function ExhibitionGrid({ cat, onCatChange, onOpen }: ExhibitionGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const list =
    cat === "all" ? sortedProducts : sortedProducts.filter((p) => p.categories.includes(cat));

  /* 分类切换：等待布局动画结束后刷新 ScrollTrigger */
  useEffect(() => {
    const t = setTimeout(() => refreshScrollTrigger(120), 820);
    return () => clearTimeout(t);
  }, [cat]);

  /* 网格尺寸变化（resize / 图片加载）→ 重新计算 */
  useEffect(() => observeScrollTrigger(gridRef.current), []);

  return (
    <section id="products" className="relative mx-auto max-w-[1680px] px-5 py-16 md:px-10 md:py-24">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          kicker="THE COLLECTION · 义卖产品"
          title="线上展厅"
          en="EXHIBITION"
        />
        {/* 分类筛选 */}
        <Reveal delay={0.15} className="shrink-0">
          <LayoutGroup id="cats">
            <div
              className="flex max-w-full flex-wrap gap-1 border border-line bg-ink-2/60 p-1"
              role="tablist"
              aria-label="产品分类"
            >
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onCatChange(c.id)}
                  role="tab"
                  aria-selected={cat === c.id}
                  className={cn(
                    "relative px-3 py-2 tc-label transition-colors md:px-4",
                    cat === c.id ? "text-ink" : "text-mute hover:text-paper",
                  )}
                >
                  {cat === c.id && (
                    <motion.span
                      layoutId="cat-bg"
                      className="absolute inset-0 bg-paper"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">
                    {c.label}
                    <span className="ml-1.5 hidden opacity-60 sm:inline">{c.en}</span>
                  </span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </Reveal>
      </div>

      {/* 统一网格：桌面 4 列 / 平板 3 列 / 手机 2 列，卡片 4:5 全部对齐 */}
      <motion.div
        ref={gridRef}
        layout
        className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 xl:grid-cols-4"
      >
        <AnimatePresence initial={false} mode="sync">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} onOpen={onOpen} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* 网格脚注 */}
      <Reveal className="mt-8">
        <div className="flex flex-col gap-2 border-t border-line pt-4 tc-label text-mute-2 sm:flex-row sm:items-center sm:justify-between">
          <span>共 {list.length} 件展品 · 点击卡片查看详情与购买方式</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-rec animate-blink" />
            {SITE.disclaimer.preview}
          </span>
        </div>
      </Reveal>
    </section>
  );
}
