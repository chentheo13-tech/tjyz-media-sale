import { useEffect, useRef } from "react";

/**
 * 鼠标拖拽横向滚动包装器：
 * - 触控板 / 触摸：使用原生滚动（自然跟手、自然惯性）
 * - 鼠标：pointer 按下后 1:1 拖动 scrollLeft，不附加惯性（避免阻力感）
 * 拖动过程中抑制内部点击，避免"点一张抽到另一张"。
 */
export function DragScroll({
  children,
  className,
  ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef({ dragging: false, startX: 0, startLeft: 0, moved: false, pointerId: -1 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return; // 触控板/触摸交给原生滚动
      state.current = {
        dragging: true,
        startX: e.clientX,
        startLeft: el.scrollLeft,
        moved: false,
        pointerId: e.pointerId,
      };
      el.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      const s = state.current;
      if (!s.dragging || e.pointerId !== s.pointerId) return;
      const dx = e.clientX - s.startX;
      if (Math.abs(dx) > 4) s.moved = true;
      el.scrollLeft = s.startLeft - dx;
    };
    const onUp = (e: PointerEvent) => {
      const s = state.current;
      if (!s.dragging || e.pointerId !== s.pointerId) return;
      s.dragging = false;
      /* 拖过则吞掉随后的 click，避免误触卡片 */
      if (s.moved) {
        const kill = (ev: MouseEvent) => {
          ev.stopPropagation();
          ev.preventDefault();
          el.removeEventListener("click", kill, true);
        };
        el.addEventListener("click", kill, { capture: true, once: true });
      }
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      role="region"
      aria-label={ariaLabel}
      style={{ cursor: "grab" }}
    >
      {children}
    </div>
  );
}
