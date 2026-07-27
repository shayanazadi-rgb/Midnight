import Link from "next/link";

import { ShopImage } from "@/components/shop-image";
import { formatPrice, type Product } from "@/lib/api";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0] || "/logo.jpg";

  return (
    <Link href={`/product/${product.slug}`} className="product-glow group block">
      <article className="overflow-hidden rounded-2xl bg-cream/60 ring-1 ring-line sm:rounded-[1.5rem]">
        <div className="relative aspect-[3/4] overflow-hidden bg-mist sm:aspect-[4/5]">
          <ShopImage
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          {product.discount_percent ? (
            <span className="absolute left-2 top-2 rounded-full bg-plum px-2 py-0.5 text-[10px] font-semibold text-cream sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-xs">
              {product.discount_percent}٪
            </span>
          ) : null}
          {product.featured ? (
            <span className="absolute right-2 top-2 rounded-full bg-pink/90 px-2 py-0.5 text-[10px] font-semibold text-plum sm:right-3 sm:top-3 sm:px-3 sm:py-1 sm:text-xs">
              ویژه
            </span>
          ) : null}
        </div>
        <div className="space-y-1 px-2.5 py-3 sm:space-y-2 sm:px-4 sm:py-4">
          <p className="text-[10px] tracking-[0.16em] text-plum/55 uppercase sm:text-xs sm:tracking-[0.2em]">
            {product.category_name_fa}
          </p>
          <h3 className="font-display text-[0.95rem] leading-snug text-plum sm:text-xl">
            {product.name_fa}
          </h3>
          <p className="hidden text-sm text-plum/55 sm:block">{product.name}</p>
          <div className="flex flex-wrap items-baseline gap-1.5 pt-0.5 sm:gap-2 sm:pt-1">
            <span className="text-sm font-semibold text-plum sm:text-base">
              {formatPrice(product.price)}
            </span>
            {product.compare_at_price ? (
              <span className="text-[11px] text-plum/40 line-through sm:text-sm">
                {formatPrice(product.compare_at_price)}
              </span>
            ) : null}
          </div>
        </div>
      </article>
    </Link>
  );
}
