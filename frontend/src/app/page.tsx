import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { ShopImage } from "@/components/shop-image";
import {
  getCategories,
  getFeaturedProducts,
  type Category,
  type Product,
} from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let featured: Product[] = [];
  let categories: Category[] = [];

  try {
    const [featuredRaw, categoriesRaw] = await Promise.all([
      getFeaturedProducts(),
      getCategories(),
    ]);
    featured = Array.isArray(featuredRaw) ? featuredRaw : [];
    categories = Array.isArray(categoriesRaw) ? categoriesRaw : [];
  } catch {
    featured = [];
    categories = [];
  }

  return (
    <>
      <section className="relative min-h-[100svh] overflow-hidden">
        <div className="hero-atmosphere absolute inset-0" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
          aria-hidden
        >
          <span className="font-display text-[42vw] leading-none tracking-[-0.06em] text-plum/[0.07] select-none sm:text-[48vw] md:text-[22rem]">
            MN
          </span>
        </div>

        <div className="relative mx-auto flex min-h-[100svh] max-w-3xl flex-col items-center justify-center px-4 pb-16 pt-[7.5rem] text-center sm:px-5 sm:pb-20 sm:pt-28 md:px-8">
          <div className="reveal flex items-center gap-3 text-plum/45 sm:gap-4">
            <span className="h-px w-6 bg-plum/30 sm:w-10 md:w-16" />
            <p className="text-[9px] tracking-[0.28em] uppercase sm:text-[11px] sm:tracking-[0.42em]">
              Lingerie & Underwear
            </p>
            <span className="h-px w-6 bg-plum/30 sm:w-10 md:w-16" />
          </div>

          <h1 className="reveal reveal-delay-1 mt-5 font-display text-plum sm:mt-8">
            <span className="block text-[clamp(2.75rem,12vw,6rem)] leading-[0.92] tracking-[0.1em] sm:tracking-[0.14em]">
              MIDNIGHT
            </span>
            <span className="mt-2 block text-[clamp(1.5rem,6.5vw,3rem)] tracking-[0.36em] text-plum-soft sm:mt-3 sm:tracking-[0.48em]">
              SHOP
            </span>
          </h1>

          <div className="reveal reveal-delay-2 silk-divider mt-6 w-16 sm:mt-10 sm:w-24" />

          <div
            dir="ltr"
            className="reveal reveal-delay-2 font-editorial mt-5 max-w-lg px-1 text-plum sm:mt-8"
          >
            <p className="text-[clamp(1.55rem,6.5vw,2.75rem)] italic leading-[1.15] tracking-[0.03em]">
              After Midnight …
            </p>
            <p className="mt-2 text-[clamp(1.2rem,5vw,1.875rem)] font-medium tracking-[0.06em] text-plum-soft sm:mt-3 sm:tracking-[0.08em]">
              its just us
            </p>
            <p className="mt-3 text-[clamp(0.95rem,3.8vw,1.25rem)] italic leading-snug tracking-[0.04em] text-plum/65 sm:mt-4 sm:tracking-[0.06em]">
              enjoy your midnights with us
            </p>
          </div>

          <div className="reveal reveal-delay-3 mt-8 flex w-full max-w-sm flex-col items-stretch gap-2.5 sm:mt-10 sm:max-w-none sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
            <Link href="/shop" className="btn-primary w-full sm:w-auto">
              ورود به فروشگاه
            </Link>
            <Link href="/shop?tag=new" className="btn-ghost w-full sm:w-auto">
              جدیدها
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-5 sm:py-20 md:px-8">
        <div className="mb-7 flex items-end justify-between gap-3 sm:mb-10 sm:gap-4">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-plum/50 uppercase sm:text-xs">
              Collections
            </p>
            <h2 className="mt-1.5 font-display text-3xl text-plum sm:mt-2 sm:text-4xl">
              دسته‌بندی‌ها
            </h2>
          </div>
          <Link
            href="/shop"
            className="shrink-0 pb-1 text-xs font-semibold text-plum underline-offset-4 hover:underline sm:text-sm"
          >
            همه محصولات
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((cat, index) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-line sm:aspect-[4/5] sm:rounded-[1.75rem]"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <ShopImage
                src={cat.image || "/logo.jpg"}
                alt={cat.name}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-plum/85 via-plum/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-cream sm:p-5">
                <p className="font-display text-base leading-snug sm:text-2xl">
                  {cat.name_fa}
                </p>
                <p className="mt-0.5 text-[11px] text-pink/90 sm:mt-1 sm:text-sm">
                  {cat.product_count} محصول
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="silk-divider mx-auto max-w-3xl" />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-5 sm:py-20 md:px-8">
        <div className="mb-7 max-w-xl sm:mb-10">
          <p className="text-[10px] tracking-[0.3em] text-plum/50 uppercase sm:text-xs">
            Featured
          </p>
          <h2 className="mt-1.5 font-display text-3xl text-plum sm:mt-2 sm:text-4xl">
            انتخاب‌های ویژه
          </h2>
          <p className="mt-2 text-sm leading-7 text-plum/65 sm:mt-3 sm:text-base">
            قطعاتی با بافت نرم، برش دقیق و حس شبانه — برای کشویی که فقط کاربردی نیست.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-16 sm:px-5 sm:py-24 md:px-8">
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-5 text-center md:flex-row md:items-center md:justify-between md:text-start">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl tracking-wide text-plum sm:text-4xl md:text-5xl">
              midnightshop.ir
            </h2>
          </div>
          <Link href="/shop" className="btn-primary w-full max-w-xs float-soft sm:w-auto">
            شروع خرید
          </Link>
        </div>
      </section>
    </>
  );
}
