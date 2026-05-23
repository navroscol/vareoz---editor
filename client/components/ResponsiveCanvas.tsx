// Pixel-perfect responsive wrapper (fill-width mode, like a real website).
// The inner div keeps the design's native dimensions (absolute-positioned
// shapes stay exact); a CSS transform scales it to fill the available WIDTH,
// and the frame's height is set to the scaled height so nothing is cut off —
// the page just scrolls vertically if the design is taller than the viewport.
// No side gaps, no clipping, aspect ratio preserved.
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";

export function ResponsiveCanvas({
  width,
  height,
  children,
  className,
  background = "white",
  maxScale = 4,
}: {
  width: number;
  height: number;
  children: React.ReactNode;
  className?: string;
  background?: string;
  maxScale?: number;
}) {
  const frameRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);
  // The true rendered height of the content. The design's declared `height`
  // (e.g. canvasH from a PDF page) is only a hint — shapes or full-bleed
  // 21st.dev components can render BELOW it. We measure the real layout height
  // so the frame grows to fit and the bottom is never clipped.
  const [contentH, setContentH] = React.useState(height);

  React.useEffect(() => {
    const el = frameRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const apply = (w: number) => {
      if (w > 0 && Number.isFinite(w)) setScale(Math.min(w / width, maxScale));
    };
    const ro = new ResizeObserver(([entry]) => apply(entry.contentRect.width));
    ro.observe(el);
    apply(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, [width, maxScale]);

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
        height: Math.round(contentH * scale),
        position: "relative",
        overflow: "hidden",
        background,
      }}
    >
      <div
        ref={contentRef}
        style={{
          width,
          // let the layer grow with its content (min = declared design height)
          minHeight: height,
          transform: `scale(${scale})`,
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
