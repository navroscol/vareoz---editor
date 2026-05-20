// Vite shim for `next/image` — renders a plain <img>. Supports the common
// next/image props (fill, sizes, width, height, priority) by mapping them to
// equivalent plain-DOM behaviour.
import * as React from "react";

export interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "width" | "height"> {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: string;
  blurDataURL?: string;
  loader?: unknown;
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(function NextImageShim(
  { src, alt = "", width, height, fill, priority, sizes, quality, placeholder, blurDataURL, loader, style, ...rest },
  ref,
) {
  const fillStyle: React.CSSProperties = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }
    : {};
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      width={width as number | undefined}
      height={height as number | undefined}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      style={{ ...fillStyle, ...style }}
      {...rest}
    />
  );
});

export default Image;
