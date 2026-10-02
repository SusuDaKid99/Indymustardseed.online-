import Image, { type ImageProps } from "next/image";

/**
 * Image wrapper used for all catalog imagery.
 * - Real photos go through Next's optimizer (responsive srcset, AVIF/WebP, lazy loading).
 * - SVG placeholder artwork is served as-is (it's already tiny and vector).
 */
export function CatalogImage(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  const isSvg = src.endsWith(".svg");
  return <Image {...props} unoptimized={isSvg || props.unoptimized} alt={props.alt} />;
}
