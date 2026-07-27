import { Suspense } from "react";
import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { ShopSortButton } from "@/components/shop-sort-button";
import { getCategories, getProducts } from "@/lib/api";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  category?: string;
  search?: string;
  tag?: string;
  sort?: string;
}>;

function buildShopHref(params: {
  category?: string;
  search?: string;
  tag?: string;
  sort?: string;
}) {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.search) qs.set("search", params.search);
  if (params.tag) qs.set("tag", params.tag);
  if (params.sort) qs.set("sort", params.sort);
  const query = qs.toString();
  return query ? `/shop?${query}` : "/shop";
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const sort =
    params.sort === "newest" ||
    params.sort === "bestsellers" ||
    params.sort === "discount"
      ? params.sort
      : undefined;

  let products = {
    count: 0,
    results: [] as Awaited<ReturnType<typeof getProducts>>["results"],
  };
  let categories: Awaited<ReturnType<typeof getCategories>> = [];

  try {
    const [productsRaw, categoriesRaw] = await Promise.all([
      getProducts({
        category: params.category,
        search: params.search,
        tag: params.tag,
        sort,
        discounted: sort === "discount",
        limit: 48,
      }),
      getCategories(),
    ]);
    products = productsRaw;
    categories = Array.isArray(categoriesRaw) ? categoriesRaw : [];
  } catch {
    // keep empty
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-[7.25rem] sm:px-5 sm:pb-20 sm:pt-28 md:px-8 xl:max-w-7xl">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
        <div className="max-w-2xl">
          <p className="text-[10px] tracking-[0.3em] text-plum/50 uppercase sm:text-xs">
            Shop
          </p>
          <h1 className="mt-1.5 font-display text-4xl text-plum sm:mt-2 sm:text-5xl md:text-6xl">
            فروشگاه
          </h1>
          <p className="mt-2 text-sm leading-7 text-plum/65 sm:mt-3 sm:text-base md:max-w-xl">
            فیلتر بر اساس دسته، یا جستجو در نام و تگ‌ها.
          </p>
        </div>
      </div>

      <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:mt-8 sm:flex-wrap sm:overflow-visible sm:px-0 md:gap-2.5">
        <Link
          href={buildShopHref({
            search: params.search,
            tag: params.tag,
            sort,
          })}
          className={`shrink-0 rounded-full px-4 py-2 text-sm transition md:px-5 md:py-2.5 ${
            !params.category
              ? "bg-plum text-white"
              : "bg-white text-plum ring-1 ring-line hover:bg-cream"
          }`}
        >
          همه
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={buildShopHref({
              category: cat.slug,
              search: params.search,
              tag: params.tag,
              sort,
            })}
            className={`shrink-0 rounded-full px-4 py-2 text-sm transition md:px-5 md:py-2.5 ${
              params.category === cat.slug
                ? "bg-plum text-white"
                : "bg-white text-plum ring-1 ring-line hover:bg-cream"
            }`}
          >
            {cat.name_fa}
          </Link>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2 sm:mt-6 sm:gap-3 md:max-w-2xl lg:max-w-3xl">
        <form className="min-w-0 flex-1" action="/shop" method="get">
          {params.category ? (
            <input type="hidden" name="category" value={params.category} />
          ) : null}
          {params.tag ? (
            <input type="hidden" name="tag" value={params.tag} />
          ) : null}
          {sort ? <input type="hidden" name="sort" value={sort} /> : null}
          <input
            type="search"
            name="search"
            defaultValue={params.search || ""}
            placeholder="جستجو..."
            className="w-full rounded-full border border-line bg-cream/80 px-5 py-3 text-sm text-plum outline-none ring-plum/20 placeholder:text-plum/40 focus:ring-2 md:py-3.5 md:text-base"
          />
        </form>
        <Suspense
          fallback={
            <div className="h-[2.875rem] w-28 shrink-0 rounded-full bg-cream ring-1 ring-line" />
          }
        >
          <ShopSortButton />
        </Suspense>
      </div>

      <p className="mt-6 text-sm text-plum/55 sm:mt-8">{products.count} محصول</p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-5 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {products.results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.results.length === 0 ? (
        <p className="mt-16 text-center text-plum/60">محصولی پیدا نشد.</p>
      ) : null}
    </div>
  );
}
