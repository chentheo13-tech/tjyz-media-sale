import { useEffect, useRef, useState } from "react";

const pad = (n: number, l = 2) => String(n).padStart(l, "0");

/** 根据性能时间生成 时间码 HH:MM:SS:FF（24fps），并自动每帧更新 */
export function useTimecode(active = true, speed = 1): string {
  const [tc, setTc] = useState("00:00:00:00");
  const raf = useRef(0);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) / 1000 * speed;
      const totalFrames = Math.floor(t * 24);
      const ff = totalFrames % 24;
      const ss = Math.floor(totalFrames / 24) % 60;
      const mm = Math.floor(totalFrames / 1440) % 60;
      const hh = Math.floor(totalFrames / 86400) % 24;
      setTc(`${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active, speed]);

  return tc;
}

/** 实时时钟 HH:MM:SS */
export function useClock(active = true): string {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, [active]);
  return `${pad(t.getHours())}:${pad(t.getMinutes())}:${pad(t.getSeconds())}`;
}
