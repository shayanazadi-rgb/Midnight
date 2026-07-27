import Link from "next/link";

import { ProductRail } from "@/components/product-rail";
import { ShopImage } from "@/components/shop-image";
import { getCategories, getProducts, type Category, type Product } from "@/lib/api";

export const dynamic = "force-dynamic";

async function loadSection(
  params: Parameters<typeof getProducts>[0],
): Promise<Product[]> {
  try {
    const data = await getProducts(params);
    return Array.isArray(data?.results) ? data.results : [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  let newest: Product[] = [];
  let bestsellers: Product[] = [];
  let discounted: Product[] = [];
  let categories: Category[] = [];

  try {
    const [newestRaw, bestsellersRaw, discountedRaw, categoriesRaw] =
      await Promise.all([
        loadSection({ sort: "newest", limit: 16 }),
        loadSection({ sort: "bestsellers", limit: 16 }),
        loadSection({ sort: "discount", discounted: true, limit: 16 }),
        getCategories().catch(() => [] as Category[]),
      ]);
    newest = newestRaw;
    bestsellers = bestsellersRaw;
    discounted = discountedRaw;
    categories = Array.isArray(categoriesRaw) ? categoriesRaw : [];
  } catch {
    newest = [];
    bestsellers = [];
    discounted = [];
    categories = [];
  }

  return (
    <>
      <section className="relative overflow-hidden md:min-h-[min(72vh,40rem)]">
        <div className="hero-atmosphere absolute inset-0" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
          aria-hidden
        >
          <span className="font-display text-[42vw] leading-none tracking-[-0.06em] text-plum/[0.07] select-none sm:text-[36vw] md:text-[18rem] lg:text-[20rem]">
            MN
          </span>
        </div>

        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 pb-10 pt-[7.5rem] text-center sm:px-5 sm:pb-12 sm:pt-28 md:max-w-4xl md:px-8 md:pb-16 md:pt-32 lg:pb-20">
          <div className="reveal flex items-center gap-3 text-plum/45 sm:gap-4 md:gap-5">
            <span className="h-px w-6 bg-plum/30 sm:w-10 md:w-20" />
            <p className="text-[9px] tracking-[0.28em] uppercase sm:text-[11px] sm:tracking-[0.42em] md:text-xs">
              Lingerie & Underwear
            </p>
            <span className="h-px w-6 bg-plum/30 sm:w-10 md:w-20" />
          </div>

          <h1 className="reveal reveal-delay-1 mt-5 font-display text-plum sm:mt-7 md:mt-9">
            <span className="block text-[clamp(2.75rem,12vw,6rem)] leading-[0.92] tracking-[0.1em] sm:tracking-[0.14em]">
              MIDNIGHT
            </span>
            <span className="mt-2 block text-[clamp(1.5rem,6.5vw,3rem)] tracking-[0.36em] text-plum-soft sm:mt-2.5 sm:tracking-[0.48em]">
              SHOP
            </span>
          </h1>

          <div className="reveal reveal-delay-2 silk-divider mt-5 w-16 sm:mt-7 sm:w-20 md:mt-8 md:w-28" />

          <div
            dir="ltr"
            className="reveal reveal-delay-2 font-editorial mt-4 max-w-lg px-1 text-plum sm:mt-6 md:mt-8 md:max-w-xl"
          >
            <p className="text-[clamp(1.55rem,6.5vw,2.75rem)] italic leading-[1.15] tracking-[0.03em]">
              After Midnight …
            </p>
            <p className="mt-2 text-[clamp(1.2rem,5vw,1.875rem)] font-medium tracking-[0.06em] text-plum-soft sm:mt-2.5 sm:tracking-[0.08em]">
              its just us
            </p>
            <p className="mt-3 text-[clamp(0.95rem,3.8vw,1.3rem)] italic leading-snug tracking-[0.04em] text-plum/65 sm:mt-3 sm:tracking-[0.06em]">
              enjoy your midnights with us
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-12 pb-10 sm:space-y-14 sm:pb-14 md:space-y-16 md:pb-16 lg:space-y-20">
        {categories.length > 0 ? (
          <section className="mx-auto max-w-6xl xl:max-w-7xl">
            <div className="mb-3 flex items-end justify-between gap-3 px-4 sm:mb-4 sm:px-5 md:mb-6 md:px-8">
              <div>
                <p className="text-[10px] tracking-[0.3em] text-plum/45 uppercase sm:text-xs">
                  Collections
                </p>
                <h2 className="mt-1 font-display text-2xl text-plum sm:text-3xl md:text-4xl">
                  دسته‌بندی‌ها
                </h2>
              </div>
              <Link
                href="/shop"
                className="shrink-0 rounded-full border-2 border-plum/35 bg-cream px-3.5 py-2 text-xs font-bold text-plum shadow-[0_4px_16px_rgba(104,32,80,0.08)] transition hover:border-plum/55 hover:bg-white sm:px-4 sm:text-sm md:px-5 md:py-2.5"
              >
                همه محصولات
              </Link>
            </div>
            <div className="flex gap-2.5 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-3.5 sm:px-5 md:gap-5 md:px-8 md:pb-2 [&::-webkit-scrollbar]:hidden">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="group flex w-[9rem] shrink-0 flex-col items-center gap-2 sm:w-[10rem] md:w-[11.5rem] lg:w-[12.5rem]"
                >
                  <span className="relative block aspect-square w-full overflow-hidden rounded-[1.25rem] bg-mist ring-1 ring-line transition duration-300 group-hover:ring-plum/35 group-hover:shadow-[0_12px_28px_rgba(63,18,48,0.12)] md:rounded-[1.5rem]">
                    <ShopImage
                      src={cat.image || "/logo.jpg"}
                      alt={cat.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 200px, (min-width: 768px) 184px, 160px"
                    />
                  </span>
                  <span className="line-clamp-2 text-center text-xs font-semibold leading-snug text-plum sm:text-sm md:text-base">
                    {cat.name_fa}
                  </span>
                </Link>
              ))}
              <div className="w-1 shrink-0" aria-hidden />
            </div>
          </section>
        ) : null}

        <ProductRail
          eyebrow="New"
          title="جدید‌ترین‌ها"
          products={newest}
          emptyLabel="هنوز محصول جدیدی نیست."
          href="/shop?sort=newest"
        />
        <ProductRail
          eyebrow="Bestsellers"
          title="پرفروش‌ترین‌ها"
          products={bestsellers}
          emptyLabel="هنوز فروشی ثبت نشده."
          href="/shop?sort=bestsellers"
        />
        <ProductRail
          eyebrow="Sale"
          title="تخفیف‌دارها"
          products={discounted}
          emptyLabel="فعلاً محصول تخفیف‌داری نیست."
          href="/shop?sort=discount"
        />
      </div>
    </>
  );
}
