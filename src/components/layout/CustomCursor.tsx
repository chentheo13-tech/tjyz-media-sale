/**
 * 自定义光标（仅桌面精细指针设备启用）
 * 点 + 拖尾圆环；悬停带 [data-cursor] 的元素时，圆环放大并显示标签文字。
 */
import { useEffect, useRef, useState } from "react";
import { useFinePointer } from "@/hooks/useMedia";

export function CustomCursor() {
  const fine = useFinePointer();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!fine) return;
    document.documentElement.classList.add("cursor-none-all");

    const pos = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) setVisible(true);
      const t = e.target as HTMLElement | null;
      const tagged = t?.closest?.("[data-cursor]") as HTMLElement | null;
      setLabel(tagged?.dataset.cursor ?? "");
    };
    const onLeave = () => setVisible(false);

    const loop = () => {
      ring.x += (pos.x - ring.x) * 0.16;
      ring.y += (pos.y - ring.y) * 0.16;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%,-50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%,-50%)`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%,-50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      document.documentElement.classList.remove("cursor-none-all");
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [fine, visible]);

  if (!fine) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[180] h-1.5 w-1.5 rounded-full bg-rec"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[179] flex items-center justify-center rounded-full border border-paper/40 transition-[width,height,background-color,border-color] duration-300"
        style={{
          width: label ? 76 : 34,
          height: label ? 76 : 34,
          opacity: visible ? 1 : 0,
          backgroundColor: label ? "rgba(255,77,46,0.1)" : "transparent",
          borderColor: label ? "rgba(255,77,46,0.75)" : undefined,
        }}
      />
      <div
        ref={labelRef}
        className="pointer-events-none fixed top-0 left-0 z-[181] tc-label text-paper"
        style={{ opacity: label && visible ? 1 : 0, fontSize: 10 }}
      >
        {label}
      </div>
    </>
  );
}
