"use client";

import Link from "next/link";

import { useAuth } from "@/components/auth-provider";
import { useCart } from "@/components/cart-provider";
import { ShopImage } from "@/components/shop-image";
import { formatPrice } from "@/lib/api";

export default function CartPage() {
  const { cart, loading, setQuantity } = useCart();
  const { ready, isAuthenticated } = useAuth();

  if (loading || !ready) {
    return (
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-[7.25rem] text-plum/60 sm:px-5 sm:pb-20 sm:pt-28 md:px-8">
        در حال بارگذاری سبد...
      </div>
    );
  }

  const items = cart?.items || [];
  const continueHref = isAuthenticated ? "/checkout" : "/auth?next=/checkout";

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-[7.25rem] sm:px-5 sm:pb-20 sm:pt-28 md:px-8">
      <h1 className="font-display text-4xl text-plum sm:text-5xl">سبد خرید</h1>
      <p className="mt-2 text-plum/60">{cart?.item_count || 0} قلم</p>

      {items.length === 0 ? (
        <div className="mt-16 space-y-6 text-center">
          <p className="text-plum/65">سبد شما خالی است.</p>
          <Link href="/shop" className="btn-primary inline-flex">
            رفتن به فروشگاه
          </Link>
        </div>
      ) : (
        <div className="mt-10 space-y-6">
          {items.map((item) => (
            <article
              key={`${item.product_id}-${item.variant_id}`}
              className="flex flex-col gap-4 rounded-[1.5rem] bg-cream p-4 ring-1 ring-line sm:flex-row sm:items-center"
            >
              <div className="relative h-28 w-24 overflow-hidden rounded-2xl bg-mist">
                <ShopImage
                  src={item.image || "/logo.jpg"}
                  alt={item.product_name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div className="flex-1 space-y-1">
                <Link
                  href={`/product/${item.product_slug}`}
                  className="font-display text-2xl text-plum hover:underline"
                >
                  {item.product_name_fa}
                </Link>
                <p className="text-sm text-plum/55">
                  {item.color} · {item.size}
                </p>
                <p className="font-semibold text-plum">{formatPrice(item.line_total)}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="h-9 w-9 rounded-full border border-line text-plum"
                  onClick={() =>
                    void setQuantity(item.product_id, item.variant_id, item.quantity - 1)
                  }
                >
                  −
                </button>
                <span className="min-w-6 text-center font-semibold text-plum">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  className="h-9 w-9 rounded-full border border-line text-plum"
                  onClick={() =>
                    void setQuantity(item.product_id, item.variant_id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>
            </article>
          ))}

          <div className="flex flex-col items-start justify-between gap-4 rounded-[1.5rem] bg-plum p-6 text-cream sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-pink/80">جمع سبد</p>
              <p className="mt-1 text-2xl font-semibold">
                {formatPrice(cart?.subtotal || 0)}
              </p>
            </div>
            <Link
              href={continueHref}
              className="btn-primary bg-cream text-plum hover:bg-pink"
            >
              ادامه خرید
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
