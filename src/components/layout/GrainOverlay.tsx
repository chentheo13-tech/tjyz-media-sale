/** 全站胶片颗粒 + 暗角覆盖层（纯装饰，不拦截交互） */
export function GrainOverlay() {
  return (
    <>
      <div className="grain-overlay" aria-hidden />
      <div
        className="pointer-events-none fixed inset-0 z-[89]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 62%, rgba(0,0,0,0.28) 100%)",
        }}
        aria-hidden
      />
    </>
  );
}
