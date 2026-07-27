import Image, { type ImageProps } from "next/image";

const API_ORIGIN =
  process.env.NEXT_PUBLIC_MEDIA_ORIGIN?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

/** Turn relative /media paths into absolute URLs the browser can load. */
export function resolveMediaUrl(src?: string | null): string {
  if (!src) return "/logo.jpg";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    if (src.startsWith("/media/")) return `${API_ORIGIN}${src}`;
    return src;
  }
  if (src.startsWith("media/")) return `${API_ORIGIN}/${src}`;
  return src;
}

function isLocalMedia(src: string) {
  return (
    src.includes("127.0.0.1") ||
    src.includes("localhost") ||
    src.startsWith("/media/") ||
    src.includes("/media/")
  );
}

type Props = Omit<ImageProps, "src"> & {
  src?: string | null;
};

export function ShopImage({ src, alt, ...rest }: Props) {
  const resolved = resolveMediaUrl(src);
  const local = isLocalMedia(resolved);

  return (
    <Image
      {...rest}
      src={resolved}
      alt={alt}
      unoptimized={local || rest.unoptimized}
    />
  );
}
