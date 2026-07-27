import Link from "next/link";

import { ShopImage } from "@/components/shop-image";
import { formatPrice, type Product } from "@/lib/api";

export function ProductCardCompact({ product }: { product: Product }) {
  const image = product.images[0] || "/logo.jpg";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block w-[7.75rem] shrink-0 sm:w-[9.5rem] md:w-[11rem] lg:w-[12.5rem]"
    >
      <article className="overflow-hidden rounded-2xl bg-cream ring-1 ring-line transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_16px_36px_rgba(63,18,48,0.12)] md:rounded-[1.35rem]">
        <div className="relative aspect-[3/4] overflow-hidden bg-mist">
          <ShopImage
            src={image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 200px, (min-width: 768px) 176px, 140px"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          {product.discount_percent ? (
            <span className="absolute left-1.5 top-1.5 rounded-full bg-plum px-1.5 py-0.5 text-[9px] font-bold text-white md:left-2.5 md:top-2.5 md:px-2.5 md:text-[11px]">
              {product.discount_percent}٪
            </span>
          ) : null}
        </div>
        <div className="space-y-0.5 px-2 py-2 md:space-y-1 md:px-3 md:py-3">
          <h3 className="line-clamp-2 min-h-[2.1em] font-display text-[0.78rem] leading-snug text-plum md:text-[0.95rem]">
            {product.name_fa}
          </h3>
          <div className="flex flex-wrap items-baseline gap-1 md:gap-1.5">
            <span className="text-[11px] font-semibold text-plum md:text-sm">
              {formatPrice(product.price)}
            </span>
            {product.compare_at_price ? (
              <span className="text-[9px] text-plum/40 line-through md:text-[11px]">
                {formatPrice(product.compare_at_price)}
              </span>
            ) : null}
          </div>
        </div>
      </article>
    </Link>
  );
}

export function ProductRail({
  title,
  eyebrow,
  products,
  emptyLabel = "محصولی نیست",
  href,
}: {
  title: string;
  eyebrow?: string;
  products: Product[];
  emptyLabel?: string;
  href?: string;
}) {
  return (
    <section className="mx-auto max-w-6xl xl:max-w-7xl">
      <div className="mb-4 flex items-end justify-between gap-3 px-4 sm:mb-5 sm:px-5 md:mb-6 md:px-8">
        <div>
          {eyebrow ? (
            <p className="text-[10px] tracking-[0.3em] text-plum/45 uppercase sm:text-xs">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-1 font-display text-2xl text-plum sm:text-3xl md:text-4xl">
            {title}
          </h2>
        </div>
        {href ? (
          <Link
            href={href}
            className="hidden shrink-0 text-sm font-semibold text-plum underline-offset-4 hover:underline md:inline"
          >
            مشاهده همه
          </Link>
        ) : null}
      </div>

      {products.length === 0 ? (
        <p className="px-4 text-sm text-plum/50 sm:px-5 md:px-8">{emptyLabel}</p>
      ) : (
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 sm:px-5 md:gap-5 md:px-8 md:pb-3 [&::-webkit-scrollbar]:hidden">
            {products.map((product) => (
              <ProductCardCompact key={product.id} product={product} />
            ))}
            <div className="w-1 shrink-0" aria-hidden />
          </div>
        </div>
      )}
    </section>
  );
}
