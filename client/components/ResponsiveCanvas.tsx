// Fill-the-whole-viewport responsive wrapper.
// The inner layer keeps the design's native pixel dimensions (so every
// absolutely-positioned shape keeps its relative layout). Two INDEPENDENT
// scale factors (scaleX, scaleY) stretch the design to cover the ENTIRE
// available box — full width AND full height — leaving NO empty margins on
// any screen (large desktop, small laptop, or phone). Elements shift/stretch
// a little so the page always fills the browser view completely. A
// ResizeObserver recomputes on every viewport change for true responsiveness.
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";

export function ResponsiveCanvas({
  width,
  height,
  children,
  className,
  background = "white",
}: {
  width: number;
  height: number;
  children: React.ReactNode;
  className?: string;
  background?: string;
  /** kept for API compatibility; ignored in fill mode */
  maxScale?: number;
}) {
  const frameRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [scaleX, setScaleX] = React.useState(1);
  const [scaleY, setScaleY] = React.useState(1);
  // The true rendered height of the content. The design's declared `height`
  // (e.g. canvasH from a PDF page) is only a hint — shapes / full-bleed
  // 21st.dev components can render BELOW it. We measure the real layout height
  // so the vertical stretch covers ALL the content.
  const [contentH, setContentH] = React.useState(height);

  const recompute = React.useCallback(() => {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cw = r.width;
    const ch = r.height;
    const h = Math.max(height, contentH);
    if (cw > 0 && ch > 0 && Number.isFinite(cw) && Number.isFinite(ch)) {
      setScaleX(cw / width);
      setScaleY(ch / h);
    }
  }, [width, height, contentH]);

  React.useEffect(() => {
    const el = frameRef.current;
    if (!el || typeof ResizeObserver === "undefined") {
      recompute();
      return;
    }
    const ro = new ResizeObserver(() => recompute());
    ro.observe(el);
    recompute();
    return () => ro.disconnect();
  }, [recompute]);

  // Track the real (unscaled) content height. scrollHeight captures any
  // absolutely-positioned children that overflow the declared design height.
  React.useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const measure = () => {
      const h = Math.max(height, el.scrollHeight);
      setContentH((prev) => (Math.abs(prev - h) > 0.5 ? h : prev));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [height, width, children]);

  return (
    <div
      ref={frameRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background,
      }}
    >
      <div
        ref={contentRef}
        style={{
          width,
          minHeight: height,
          transform: `scale(${scaleX}, ${scaleY})`,
          transformOrigin: "top left",
          position: "absolute",
          top: 0,
          left: 0,
          background,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default ResponsiveCanvas;
