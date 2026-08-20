import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/** 返回顶部悬浮按钮（滚动一段距离后出现） */
export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const on = () => setShow(window.scrollY > 900);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          data-cursor="TOP"
          className="fixed bottom-6 right-5 z-[95] flex h-12 w-12 items-center justify-center border border-line bg-ink-2/90 backdrop-blur transition-colors hover:border-rec md:right-10"
          aria-label="返回顶部"
        >
          <span className="tc-label text-paper">↑</span>
          <span className="absolute -top-5 tc-label text-mute-2 opacity-0 transition-opacity hover:opacity-100">
            TOP
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
