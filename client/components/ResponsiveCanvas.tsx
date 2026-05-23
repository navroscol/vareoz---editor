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
  const [scale, setScale] = React.useState(1);

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

  return (
    <div
      ref={frameRef}
      className={className}
      style={{
        width: "100%",
        height: Math.round(height * scale),
        position: "relative",
        overflow: "hidden",
        background,
      }}
    >
      <div
        style={{
          width,
          height,
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
