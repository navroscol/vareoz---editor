// Single source of truth for rendering a canvas shape. Shared by the live
// preview route (/preview) and the codegen-emitted pages so the deployed
// site is pixel-identical to the canvas.
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";

type Shape = any;

function svgDBbox(d: string) {
  const nums = d.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi);
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  if (nums) {
    for (let i = 0; i + 1 < nums.length; i += 2) {
      const x = parseFloat(nums[i]);
      const y = parseFloat(nums[i + 1]);
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  return Number.isFinite(minX)
    ? { x: minX, y: minY, w: Math.max(1, maxX - minX), h: Math.max(1, maxY - minY) }
    : { x: 0, y: 0, w: 1, h: 1 };
}

export type RenderComponent = (
  s: Shape,
  opts: { interactive?: boolean },
) => React.ReactNode;

export function ShapeView({
  s,
  renderComponent,
  interactive = true,
}: {
  s: Shape;
  renderComponent?: RenderComponent;
  interactive?: boolean;
}) {
  if (!s.visible) return null;
  const transforms: string[] = [];
  if (s.rotation) transforms.push(`rotate(${s.rotation}deg)`);
  if (s.flipX) transforms.push("scaleX(-1)");
  if (s.flipY) transforms.push("scaleY(-1)");
  const base: React.CSSProperties = {
    position: "absolute",
    left: s.x,
    top: s.y,
    width: s.w,
    height: s.h,
    transform: transforms.length
      ? `translate(calc(50% - ${s.w / 2}px), calc(50% - ${s.h / 2}px)) ${transforms.join(" ")} translate(calc(-50% + ${s.w / 2}px), calc(-50% + ${s.h / 2}px))`
      : undefined,
    transformOrigin: "0 0",
    opacity: s.opacity ?? 1,
  };

  if (s.type === "component" && s.componentName?.startsWith("el-") && renderComponent) {
    // Wrappers idénticos al editor: scope CSS para "domar" viewport units.
    return (
      <div
        data-shape-id={s.id}
        data-shape-container
        style={{
          ...base,
          ...(s.containerStyle || {}),
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          data-shape-container
          style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}
        >
          {renderComponent(s, { interactive })}
        </div>
      </div>
    );
  }
  if (s.type === "rect" || s.type === "circle" || s.type === "component") {
    return (
      <div
        data-shape-id={s.id}
        style={{
          ...base,
          backgroundColor: s.color,
          borderRadius: s.type === "circle" ? "50%" : s.cornerRadius,
        }}
      />
    );
  }
  if (s.type === "image") {
    if (s.clipD) {
      const bb = svgDBbox(s.clipD);
      const off = `translate(${-bb.x} ${-bb.y})`;
      const cid = `pvclip-${s.id}`;
      return (
        <svg
          data-shape-id={s.id}
          style={{ ...base, overflow: "visible" }}
          viewBox={`0 0 ${bb.w} ${bb.h}`}
          preserveAspectRatio="none"
        >
          <defs>
            <clipPath id={cid} clipPathUnits="userSpaceOnUse">
              <path d={s.clipD} transform={off} clipRule={(s.clipRule as any) || "nonzero"} />
            </clipPath>
          </defs>
          <image
            href={s.src}
            x={0}
            y={0}
            width={bb.w}
            height={bb.h}
            preserveAspectRatio="none"
            clipPath={`url(#${cid})`}
          />
        </svg>
      );
    }
    return (
      <img
        data-shape-id={s.id}
        src={s.src}
        alt={s.label || ""}
        draggable={false}
        style={{ ...base, objectFit: "fill" }}
      />
    );
  }
  if (s.type === "path" && s.d) {
    const bb = svgDBbox(s.d);
    const off = `translate(${-bb.x} ${-bb.y})`;
    const cid = `pvclip-${s.id}`;
    const fillCol = s.fill == null ? "none" : s.color || s.fill;
    const strokeCol = s.stroke == null ? "none" : s.stroke;
    return (
      <svg
        data-shape-id={s.id}
        style={{ ...base, overflow: "visible" }}
        viewBox={`0 0 ${bb.w} ${bb.h}`}
        preserveAspectRatio="none"
      >
        {s.clipD && (
          <defs>
            <clipPath id={cid} clipPathUnits="userSpaceOnUse">
              <path
                d={s.clipD}
                transform={off}
                clipRule={(s.clipRule as any) || "nonzero"}
              />
            </clipPath>
          </defs>
        )}
        <path
          d={s.d}
          transform={off}
          fill={fillCol}
          stroke={strokeCol}
          strokeWidth={s.strokeWidth || 0}
          clipPath={s.clipD ? `url(#${cid})` : undefined}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  }
  // text
  return (
    <div
      data-shape-id={s.id}
      style={{
        ...base,
        color: s.color,
        fontFamily: s.fontFamily
          ? String(s.fontFamily).includes(",")
            ? s.fontFamily
            : `'${s.fontFamily}', system-ui, sans-serif`
          : undefined,
        fontWeight: s.fontWeight ?? 500,
        fontStyle: s.italic ? "italic" : undefined,
        fontSize: s.fontSize ?? 18,
        lineHeight:
          s.lineHeight === "auto" || !s.lineHeight
            ? "normal"
            : `${s.lineHeight}px`,
        letterSpacing: s.letterSpacing != null ? `${s.letterSpacing}px` : undefined,
        display: "flex",
        alignItems:
          s.verticalAlign === "middle"
            ? "center"
            : s.verticalAlign === "bottom"
              ? "flex-end"
              : "flex-start",
        justifyContent:
          s.textAlign === "center"
            ? "center"
            : s.textAlign === "right"
              ? "flex-end"
              : "flex-start",
        whiteSpace: "pre",
      }}
    >
      <span style={{ width: "100%" }}>{s.label}</span>
    </div>
  );
}

export default ShapeView;
