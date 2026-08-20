import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";

export interface SectionHeadingProps {
  kicker: string;
  title: React.ReactNode;
  en?: string;
  align?: "left" | "center";
  dark?: boolean;
}

/** 章节标题：kicker（技术标签）+ 中文大标题 + 描边英文装饰 */
export function SectionHeading({ kicker, title, en, align = "left" }: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <Reveal>
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-rec" />
          <span className="tc-label text-mute">{kicker}</span>
          {align === "center" && <span className="h-px flex-1 bg-line" />}
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-4 font-display text-4xl leading-tight text-paper md:text-6xl">
          {title}
        </h2>
      </Reveal>
      {en && (
        <Reveal delay={0.14}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="stroke-text mt-2 font-mono text-2xl font-bold tracking-[0.3em] uppercase md:text-3xl"
          >
            {en}
          </motion.div>
        </Reveal>
      )}
    </div>
  );
}
