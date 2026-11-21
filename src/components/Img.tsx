interface Props {
  name: string;
  widths: number[];
  alt: string;
  w: number;
  h: number;
  sizes?: string;
  className?: string;
  eager?: boolean;
}

const base = import.meta.env.BASE_URL;
export const imgUrl = (name: string, width: number) => `${base}img/${name}-${width}.webp`;

/** Responsive WebP image. Lazy by default; pass `eager` for images in the first screen. */
export default function Img({ name, widths, alt, w, h, sizes, className, eager }: Props) {
  const sorted = [...widths].sort((a, b) => a - b);
  return (
    <img
      className={className}
      src={imgUrl(name, sorted[sorted.length - 1])}
      srcSet={sorted.length > 1 ? sorted.map((x) => `${imgUrl(name, x)} ${x}w`).join(', ') : undefined}
      sizes={sorted.length > 1 ? sizes ?? '100vw' : undefined}
      alt={alt}
      width={w}
      height={h}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      {...(eager ? { fetchpriority: 'high' } : {})}
    />
  );
}
