import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export interface RevealProps {
  children: ReactNode;
  /** 进入方向 */
  from?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  className?: string;
  /** 只播一次 */
  once?: boolean;
  amount?: number;
}

/** 滚动进入动画包装（transform/opacity，GPU 友好） */
export function Reveal({
  children,
  from = "up",
  delay = 0,
  duration = 0.8,
  className,
  once = true,
  amount = 0.25,
}: RevealProps) {
  const reduced = useReducedMotion();
  const offsets = {
    up: { y: 36 },
    down: { y: -36 },
    left: { x: 48 },
    right: { x: -48 },
    none: {},
  }[from];

  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, ...offsets }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
