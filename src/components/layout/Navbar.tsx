import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SITE } from "@/data/site";
import { useTimecode } from "@/utils/timecode";
import { cn } from "@/utils/cn";
import { useViewport } from "@/hooks/useMedia";

/**
 * 顶部导航：极简 + 时间码时钟 + REC 状态；移动端全屏菜单。
 */
export function Navbar({ booted }: { booted: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const tc = useTimecode();
  const { isMobile, width } = useViewport();
  const showDesktopNav = width >= 1024;

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={booted ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className={cn(
          "fixed inset-x-0 top-0 z-[100] transition-colors duration-500",
          scrolled ? "bg-ink/80 backdrop-blur-md border-b border-line" : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-[68px] max-w-[1680px] items-center justify-between px-5 md:px-10">
          {/* Logo：学生新媒体中心徽章（组织视觉素材） */}
          <button
            onClick={() => go("home")}
            className="flex items-center gap-3 text-left"
            data-cursor="TOP"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-paper/15 bg-white p-1">
              <img
                src={SITE.badge}
                alt={SITE.name}
                className="h-full w-full object-contain"
                draggable={false}
              />
            </span>
            <span className="hidden flex-col items-start sm:flex">
              <span className="text-sm font-semibold tracking-wide text-paper">{SITE.name}</span>
              <span className="tc-label text-mute-2">{SITE.nameEn}</span>
            </span>
          </button>

          {/* 桌面导航（≥1024 显示，避免 6 项拥挤） */}
          {showDesktopNav && (
            <nav className="flex items-center gap-8">
              {SITE.nav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  data-cursor={item.en}
                  className="group relative py-1 text-sm text-paper/80 transition-colors hover:text-paper"
                >
                  {item.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-rec transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </nav>
          )}

          {/* 状态区 */}
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 tc-label text-mute sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-rec animate-blink" />
              <span className="text-paper/80">{SITE.status.text}</span>
              <span className="hidden text-mute lg:inline">{tc}</span>
            </div>
            {isMobile ? (
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 border border-line"
                aria-label="菜单"
              >
                <span
                  className={cn(
                    "block h-px w-5 bg-paper transition-transform duration-300",
                    menuOpen && "translate-y-[3.5px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "block h-px w-5 bg-paper transition-transform duration-300",
                    menuOpen && "-translate-y-[3.5px] -rotate-45",
                  )}
                />
              </button>
            ) : (
              <button
                onClick={() => go("products")}
                data-cursor="SHOP"
                className="hidden border border-line px-4 py-2 tc-label text-paper transition-colors hover:border-rec hover:bg-rec/10 md:block"
              >
                进入展厅 →
              </button>
            )}
          </div>
        </div>
      </motion.header>

      {/* 移动端全屏菜单 */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            data-menu
            className="fixed inset-0 z-[99] flex flex-col bg-ink scanlines"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex flex-1 flex-col justify-center gap-2 px-8">
              {SITE.nav.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ x: -32, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => go(item.id)}
                  className="group flex items-baseline gap-4 py-3 text-left"
                >
                  <span className="tc-label text-rec">0{i + 1}</span>
                  <span className="font-display text-4xl text-paper group-active:text-rec">
                    {item.label}
                  </span>
                  <span className="tc-label text-mute-2">{item.en}</span>
                </motion.button>
              ))}
            </div>
            <div className="border-t border-line px-8 py-6">
              <div className="flex items-center justify-between tc-label text-mute">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rec animate-blink" />
                  {SITE.status.text}
                </span>
                <span>{tc}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
