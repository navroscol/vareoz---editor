// Pixel-perfect responsive wrapper for the design canvas. The inner div
// stays at the design's native dimensions (so absolute-positioned shapes
// keep exact coords); the outer frame is fluid and a CSS transform scales
// the inner to fit, preserving the aspect ratio.
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";

export function ResponsiveCanvas({
  width,
  height,
  children,
  className,
  background = "white",
  maxScale = 1.6,
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
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w > 0 && Number.isFinite(w)) {
        setScale(Math.min(w / width, maxScale));
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, maxScale]);

  return (
    <div
      ref={frameRef}
      className={className}
      style={{
        width: "100%",
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
        aspectRatio: `${width} / ${height}`,
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
