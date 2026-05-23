// Fit-to-viewport responsive wrapper.
// The inner layer keeps the design's native pixel dimensions (so every
// absolutely-positioned shape stays exact). A CSS transform scales the WHOLE
// design to fit INSIDE the available box on BOTH axes (width AND height), so
// the entire page is always fully visible — no scrolling, no zooming out —
// on any screen (large desktop, small laptop, or phone). The design is never
// reflowed (layout preserved exactly); it just shrinks/grows to fit. Any
// leftover margin from a mismatched aspect ratio is filled with the page
// background and the design is centered, like a centered page on a backdrop.
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
  // so the fit calculation accounts for ALL the content.
  const [contentH, setContentH] = React.useState(height);

  // Recompute the scale that makes the whole design fit inside the frame on
  // both axes. Driven by a ResizeObserver on the frame (true responsiveness:
  // it recomputes on every viewport change — resize, rotate, devtools, etc.).
  const recompute = React.useCallback(() => {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cw = r.width;
    const ch = r.height;
    if (cw > 0 && ch > 0 && Number.isFinite(cw) && Number.isFinite(ch)) {
      setScale(Math.min(cw / width, ch / Math.max(height, contentH), maxScale));
    }
  }, [width, height, contentH, maxScale]);

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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        ref={contentRef}
        style={{
          width,
          minHeight: height,
          flex: "none",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          background,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default ResponsiveCanvas;
