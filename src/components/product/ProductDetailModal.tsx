import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CategoryId, Product } from "@/data/products";
import { CATEGORIES, priceText, sortedProducts } from "@/data/products";
import { POSTCARDS } from "@/data/postcards";
import { BOOKMARKS } from "@/data/bookmarks";
import { ProductImage } from "@/components/ui/ProductImage";
import { cn } from "@/utils/cn";
import { SITE } from "@/data/site";

export interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  /** 切换到另一个商品（相关推荐） */
  onSwitch: (p: Product) => void;
}

function InfoBlock({ title, en, children }: { title: string; en: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line py-5">
      <div className="tc-label mb-2 flex items-center gap-2 text-mute">
        <span className="h-1 w-1 rounded-full bg-rec" />
        {title} <span className="text-mute-2">{en}</span>
      </div>
      <div className="text-sm leading-relaxed text-paper-dim">{children}</div>
    </div>
  );
}

interface GalleryItem {
  src: string;
  /** 小图（缩略条用），默认与 src 相同 */
  thumb?: string;
  label?: string;
}

/** 详情画廊（固定高度 contain，切换不跳动）：
 *  - 明信片单张：10 款
 *  - 书签单张：5 款（校园 / 非校园）
 *  - 其他：product.images
 */
function galleryFor(product: Product): GalleryItem[] {
  if (product.id === "postcard") {
    return POSTCARDS.map((c) => ({
      src: c.img,
      thumb: c.thumb,
      label: c.tag ? `${c.name} · ${c.tag}` : c.name,
    }));
  }
  if (product.id === "bookmark") {
    return BOOKMARKS.map((b) => ({
      src: b.img,
      thumb: b.img.replace("school-", "thumb-school-").replace("non-", "thumb-non-"),
      label: b.name,
    }));
  }
  if (product.id === "leather-bag") {
    return product.images.map((src, i) => ({
      src,
      thumb: src.replace("/0", "/thumb-0"),
      label: `图 ${i + 1} / 3`,
    }));
  }
  return product.images.map((src, i) => ({
    src,
    label: product.imageLabels?.[i] ?? (product.images.length > 1 ? `图 ${i + 1}` : undefined),
  }));
}

/**
 * 商品详情弹窗（全站统一结构）：
 * 画廊 → 名称 → 价格 → 描述 → 规格/套餐内容 → 注意事项 → 如何购买 → 相关推荐
 * 返回时恢复进入前的滚动位置；切换分类状态保留在父级，不被重置。
 */
export function ProductDetailModal({ product, onClose, onSwitch }: ProductDetailModalProps) {
  const [index, setIndex] = useState(0);
  const savedScroll = useRef(0);
  const gallery = useMemo(() => (product ? galleryFor(product) : []), [product]);

  useEffect(() => setIndex(0), [product]);

  /* 打开：记录滚动位置 + 锁定滚动；关闭：恢复滚动位置 */
  useEffect(() => {
    if (!product) return;
    savedScroll.current = window.scrollY;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % gallery.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.scrollTo({ top: savedScroll.current, behavior: "instant" as ScrollBehavior });
    };
  }, [product, gallery.length, onClose]);

  const related = useMemo(() => {
    if (!product) return [];
    const primary = product.categories[0];
    return sortedProducts.filter((p) => p.id !== product.id && p.categories[0] === primary).slice(0, 4);
  }, [product]);

  const cats = CATEGORIES.filter((c) => c.id !== "all" && product?.categories.includes(c.id as CategoryId));

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          key="modal"
          className="fixed inset-0 z-[150] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name}详情`}
        >
          {/* 背板 */}
          <div className="absolute inset-0 bg-ink/85 backdrop-blur-md" onClick={onClose} />

          {/* 面板：fade + scale，稳定优先 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 16 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex h-[92svh] w-full flex-col overflow-hidden border border-line bg-ink-2 sm:h-[88vh] sm:max-w-6xl"
          >
            {/* 顶栏：返回商品列表 + 编号 */}
            <div className="flex items-center justify-between border-b border-line px-4 py-3 md:px-6">
              <div className="tc-label flex items-center gap-3 text-mute">
                <span className="flex items-center gap-1.5 text-rec">
                  <span className="h-1.5 w-1.5 rounded-full bg-rec animate-blink" />
                  REC
                </span>
                <span className="text-paper/80">
                  {product.no} · {product.nameEn.toUpperCase()}
                </span>
                {gallery.length > 1 && (
                  <span className="hidden sm:inline">
                    {String(index + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                data-cursor="CLOSE"
                className="flex items-center gap-2 border border-paper/30 px-3 py-2 tc-label text-paper transition-colors hover:border-rec hover:bg-rec/15"
                aria-label="返回商品列表"
              >
                ✕ <span className="hidden sm:inline">返回商品列表</span>
              </button>
            </div>

            {/* 内容 */}
            <div className="grid flex-1 min-h-0 grid-rows-[42%_1fr] sm:grid-rows-1 sm:grid-cols-12">
              {/* 左：画廊（固定高度 contain，图片切换不跳动） */}
              <div className="relative min-h-0 border-b border-line bg-black/40 sm:col-span-7 sm:border-r sm:border-b-0">
                <div className="absolute inset-0 p-3 sm:p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="h-full w-full"
                    >
                      <ProductImage
                        src={gallery[index].src}
                        alt={gallery[index].label ?? product.name}
                        className="h-full w-full"
                        fit="contain"
                        eager
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* 画廊标注 */}
                {gallery[index].label && (
                  <div className="pointer-events-none absolute bottom-12 left-1/2 -translate-x-1/2 tc-label bg-ink/70 px-2.5 py-1 text-paper/90 backdrop-blur-sm">
                    {gallery[index].label}
                  </div>
                )}

                {gallery.length > 1 && (
                  <>
                    <button
                      onClick={() => setIndex((i) => (i - 1 + gallery.length) % gallery.length)}
                      data-cursor="PREV"
                      className="absolute top-1/2 left-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-paper/25 bg-ink/60 text-paper backdrop-blur transition-colors hover:border-rec"
                      aria-label="上一张"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setIndex((i) => (i + 1) % gallery.length)}
                      data-cursor="NEXT"
                      className="absolute top-1/2 right-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-paper/25 bg-ink/60 text-paper backdrop-blur transition-colors hover:border-rec"
                      aria-label="下一张"
                    >
                      →
                    </button>
                  </>
                )}

                {/* 缩略条（桌面 Film Strip / 手机横滑） */}
                {gallery.length > 1 && (
                  <div className="absolute inset-x-0 bottom-0 flex justify-start gap-2 overflow-x-auto bg-gradient-to-t from-ink/90 to-transparent p-3 pt-8 md:justify-center">
                    {gallery.map((g, i) => (
                      <button
                        key={`${g.src}-${i}`}
                        onClick={() => setIndex(i)}
                        className={cn(
                          "h-12 w-10 shrink-0 overflow-hidden border transition-all sm:h-14 sm:w-12",
                          i === index
                            ? "border-rec opacity-100"
                            : "border-paper/20 opacity-50 hover:opacity-90",
                        )}
                        aria-label={`查看第 ${i + 1} 张`}
                      >
                        <ProductImage src={g.thumb ?? g.src} alt="" className="h-full w-full" eager />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 右：统一信息结构 */}
              <div className="min-h-0 overflow-y-auto sm:col-span-5">
                <div className="p-5 md:p-7">
                  {/* 分类 + 角标 */}
                  <div className="flex flex-wrap items-center gap-2 tc-label text-mute">
                    {cats.map((c) => (
                      <span key={c.id} className="border border-paper/25 px-2 py-0.5">
                        {c.label} / {c.en}
                      </span>
                    ))}
                    {product.badge && <span className="bg-rec px-2 py-0.5 text-white">{product.badge}</span>}
                  </div>

                  {/* 名称 */}
                  <h3 className="mt-4 font-display text-2xl leading-tight text-paper md:text-3xl">
                    {product.name}
                  </h3>
                  <div className="tc-label mt-2 text-mute">
                    {product.nameEn.toUpperCase()} · {product.no}
                  </div>

                  {/* 价格 */}
                  <div className="mt-4 flex items-baseline gap-3 border border-line bg-ink-3 px-4 py-3">
                    <span className="font-display text-3xl text-rec">{priceText(product)}</span>
                    {product.price == null && (
                      <span className="tc-label text-mute">（可咨询负责人）</span>
                    )}
                  </div>

                  {/* 描述 */}
                  <p className="mt-4 text-sm leading-relaxed text-paper-dim">{product.description}</p>

                  {product.note && (
                    <div className="mt-4 border border-rec/50 bg-rec/10 px-4 py-3">
                      <div className="tc-label text-rec">⚠ {product.note}</div>
                      <div className="tc-label mt-1 text-mute">{SITE.disclaimer.preview}</div>
                    </div>
                  )}

                  {/* 规格 / 特色 */}
                  {product.features.length > 0 && (
                    <InfoBlock title="规格 / 特色" en="DETAILS">
                      <ul className="space-y-1.5">
                        {product.features.map((f) => (
                          <li key={f} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1 w-3 shrink-0 bg-rec/70" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </InfoBlock>
                  )}

                  {/* 套餐内容 */}
                  {product.bundle && product.bundleItems && (
                    <InfoBlock title="套餐内容" en="BUNDLE">
                      <div className="space-y-1.5">
                        {product.bundleItems.map((item) => (
                          <div key={item} className="flex items-center gap-2">
                            <span className="tc-label bg-rec/15 px-2 py-0.5 text-rec">SET</span>
                            {item}
                          </div>
                        ))}
                      </div>
                    </InfoBlock>
                  )}

                  {/* 注意事项（商品专属 + 全局购买须知） */}
                  <InfoBlock title="注意事项" en="NOTICE">
                    <ul className="space-y-1.5">
                      {[...product.notices, ...SITE.notices].map((n) => (
                        <li key={n} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1 w-3 shrink-0 bg-rec/70" />
                          {n}
                        </li>
                      ))}
                    </ul>
                  </InfoBlock>

                  {/* 如何购买 */}
                  <div className="mt-2 border border-dashed border-paper/25 bg-ink-3 p-4">
                    <div className="tc-label mb-3 text-mute">HOW TO BUY · 如何购买</div>
                    <div className="flex items-center gap-4">
                      <div className="h-24 w-20 shrink-0 border border-line bg-paper">
                        <ProductImage
                          src={SITE.purchase.qrImage}
                          alt={SITE.purchase.qrLabel}
                          className="h-full w-full"
                          placeholderBg="#f2efe6"
                        />
                      </div>
                      <div className="text-xs leading-relaxed text-mute">
                        <ol className="space-y-1">
                          {SITE.purchase.steps.map((step, i) => (
                            <li key={step} className="flex items-start gap-2 text-paper">
                              <span className="tc-label text-rec">STEP 0{i + 1}</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                    <p className="mt-3 tc-label text-mute-2">{SITE.purchase.note}</p>
                  </div>

                  {/* 相关推荐 */}
                  {related.length > 0 && (
                    <div className="border-t border-line py-5">
                      <div className="tc-label mb-3 flex items-center gap-2 text-mute">
                        <span className="h-1 w-1 rounded-full bg-rec" />
                        其他商品推荐 <span className="text-mute-2">MORE</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {related.map((r) => (
                          <button
                            key={r.id}
                            onClick={() => onSwitch(r)}
                            data-cursor="VIEW"
                            className="group text-left"
                            aria-label={`查看${r.name}`}
                          >
                            <div className="aspect-[4/5] overflow-hidden border border-line bg-ink-3 transition-colors group-hover:border-paper/40">
                              <ProductImage src={r.cover} alt={r.name} className="h-full w-full" />
                            </div>
                            <div className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-paper-dim group-hover:text-paper">
                              {r.name}
                            </div>
                            <div className="tc-label mt-0.5 text-rec">{priceText(r)}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
