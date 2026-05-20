// Vite shim for `next/link` — renders a plain <a>.
import * as React from "react";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function NextLinkShim(
  { href, prefetch, replace, scroll, shallow, children, ...rest },
  ref,
) {
  return (
    <a ref={ref} href={href} {...rest}>
      {children}
    </a>
  );
});

export default Link;
