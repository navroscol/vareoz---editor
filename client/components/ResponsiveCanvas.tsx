// Pixel-perfect responsive wrapper. The inner div keeps the design's native
// dimensions (absolute-positioned shapes stay exact); a CSS transform scales
// it to FIT the available box on BOTH axes (like object-fit: contain) and
// centers it, so it never overflows or gets cut off — on any screen.
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";

export function ResponsiveCanvas({
  width,
  height,
  children,
  className,
  background = "white",
  maxScale = 2,
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
    const measure = (w: number, h: number) => {
      if (w > 0 && h > 0 && Number.isFinite(w) && Number.isFinite(h)) {
        setScale(Math.min(w / width, h / height, maxScale));
      }
    };
    const ro = new ResizeObserver(([entry]) => {
      const cr = entry.contentRect;
      measure(cr.width, cr.height);
    });
    ro.observe(el);
    // initial
    const r = el.getBoundingClientRect();
    measure(r.width, r.height);
    return () => ro.disconnect();
  }, [width, height, maxScale]);

  return (
    <div
      ref={frameRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width,
          height,
          flex: "0 0 auto",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          background,
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default ResponsiveCanvas;
