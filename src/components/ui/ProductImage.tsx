import { useEffect, useState } from "react";

/**
 * 产品图片组件
 * - loading="lazy" 懒加载（首屏可传 eager）
 * - 加载中显示 shimmer 骨架（容器尺寸由调用方用 aspect-ratio 固定，不塌陷）
 * - 加载失败自动回退到内置占位图（不破图）
 * - 永不拉伸变形：默认 object-fit: contain，需要裁切时显式传 cover
 */
export interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** "cover" | "contain"（默认 contain，商品主体绝不裁切） */
  fit?: "cover" | "contain";
  eager?: boolean;
  placeholderBg?: string;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

function fallbackSvg(label: string, bg = "#16171d"): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
<rect width="800" height="1000" fill="${bg}"/>
<g stroke="#8a8a93" stroke-opacity="0.4" stroke-width="1.5" fill="none">
  <rect x="60" y="70" width="680" height="860"/>
  <line x1="400" y1="70" x2="400" y2="930" stroke-opacity="0.2"/>
  <line x1="60" y1="500" x2="740" y2="500" stroke-opacity="0.2"/>
</g>
<text x="400" y="495" text-anchor="middle" font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="34" fill="#8a8a93" letter-spacing="6">图片待替换</text>
<text x="400" y="545" text-anchor="middle" font-family="Courier New, monospace" font-size="16" fill="#5b5c66" letter-spacing="3">${label}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function ProductImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  fit = "contain",
  eager = false,
  placeholderBg = "#14151b",
  sizes,
  onLoad,
  onError,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ backgroundColor: placeholderBg }}>
      {/* shimmer 骨架（加载中） */}
      {!loaded && !failed && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-ink-3 via-ink-2 to-ink-3" aria-hidden />
      )}
      <img
        src={failed ? fallbackSvg(alt, placeholderBg) : src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        sizes={sizes}
        className={`media-img ${fit === "contain" ? "media-img--contain" : ""} transition-opacity duration-500 ${loaded || failed ? "opacity-100" : "opacity-0"} ${imgClassName}`}
        onError={() => {
          setFailed(true);
          onError?.();
        }}
        onLoad={() => {
          setLoaded(true);
          onLoad?.();
        }}
      />
    </div>
  );
}
