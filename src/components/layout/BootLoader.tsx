import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTimecode } from "@/utils/timecode";
import { productById } from "@/data/products";
import { SITE } from "@/data/site";
import { asset } from "@/utils/paths";

const FLASH_FRAMES = [
  { src: productById("badge")!.cover, label: "FRAME 001" },
  { src: asset("/images/products/postcard/cards/card-01.webp"), label: "FRAME 002" },
  { src: productById("jacket")!.cover, label: "FRAME 003" },
];

/**
 * 片头 Loading：
 * 黑屏 → 时间码跳动 → 产品帧快速闪过 → 标题 → 揭开进入主页。
 * 全程约 1.5s，可点击跳过，不允许长时间阻塞。
 */
export function BootLoader({ onDone }: { onDone: () => void }) {
  const [skipped, setSkipped] = useState(false);
  const tc = useTimecode(!skipped, 12);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (skipped) return;
    const f = setInterval(() => setFrame((v) => (v + 1) % FLASH_FRAMES.length), 220);
    const done = setTimeout(finish, 1500);
    return () => {
      clearInterval(f);
      clearTimeout(done);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipped]);

  const finish = () => {
    if (!skipped) {
      setSkipped(true);
      onDone();
    }
  };

  return (
    <AnimatePresence>
      {!skipped && (
        <motion.div
          key="boot"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-ink scanlines"
          onClick={finish}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden
        >
          {/* 顶栏信息 */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between tc-label text-mute">
            <span>SCMC · INITIALIZING</span>
            <span className="text-paper">{tc}</span>
          </div>

          {/* 中央画面 */}
          <div className="relative w-[min(72vw,260px)]">
            {/* 快速闪过的产品帧 */}
            <motion.div
              key={frame}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="relative aspect-[4/5] overflow-hidden border border-line"
            >
              <img
                src={FLASH_FRAMES[frame].src}
                alt=""
                className="media-img media-img--contain"
                draggable={false}
              />
              <div className="absolute bottom-2 left-2 tc-label text-paper/70">
                {FLASH_FRAMES[frame].label}
              </div>
              <span className="absolute top-2 right-2 flex items-center gap-1.5 tc-label text-paper/80">
                <span className="h-1.5 w-1.5 rounded-full bg-rec animate-blink" />
                REC
              </span>
            </motion.div>

            <div className="mt-6 text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="tc-label text-mute"
              >
                {SITE.nameEn}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, letterSpacing: "0.6em" }}
                animate={{ opacity: 1, letterSpacing: "0.28em" }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-2 font-display text-xl text-paper"
              >
                {SITE.name}
              </motion.div>
            </div>

            {/* 进度条 */}
            <motion.div
              className="absolute -bottom-8 left-0 h-px w-full bg-line"
              initial={{ opacity: 1 }}
            >
              <motion.div
                className="h-px bg-rec"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.35, ease: "linear" }}
              />
            </motion.div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 tc-label text-mute-2">
            点击跳过 · CLICK TO SKIP
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
