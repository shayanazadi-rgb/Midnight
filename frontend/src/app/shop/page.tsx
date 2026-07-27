import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { getCategories, getProducts } from "@/lib/api";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  category?: string;
  search?: string;
  tag?: string;
}>;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  let products = { count: 0, results: [] as Awaited<ReturnType<typeof getProducts>>["results"] };
  let categories: Awaited<ReturnType<typeof getCategories>> = [];

  try {
    const [productsRaw, categoriesRaw] = await Promise.all([
      getProducts({
        category: params.category,
        search: params.search,
        tag: params.tag,
        limit: 24,
      }),
      getCategories(),
    ]);
    products = productsRaw;
    categories = Array.isArray(categoriesRaw) ? categoriesRaw : [];
  } catch {
    // keep empty
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-[7.25rem] sm:px-5 sm:pb-20 sm:pt-28 md:px-8">
      <div className="max-w-2xl">
        <p className="text-[10px] tracking-[0.3em] text-plum/50 uppercase sm:text-xs">Shop</p>
        <h1 className="mt-1.5 font-display text-4xl text-plum sm:mt-2 sm:text-5xl">فروشگاه</h1>
        <p className="mt-2 text-sm leading-7 text-plum/65 sm:mt-3 sm:text-base">
          فیلتر بر اساس دسته، یا جستجو در نام و تگ‌ها.
        </p>
      </div>

      <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:mt-8 sm:flex-wrap sm:overflow-visible sm:px-0">
        <Link
          href="/shop"
          className={`shrink-0 rounded-full px-4 py-2 text-sm ${
            !params.category
              ? "bg-plum text-white"
              : "bg-white text-plum ring-1 ring-line"
          }`}
        >
          همه
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className={`shrink-0 rounded-full px-4 py-2 text-sm ${
              params.category === cat.slug
                ? "bg-plum text-white"
                : "bg-white text-plum ring-1 ring-line"
            }`}
          >
            {cat.name_fa}
          </Link>
        ))}
      </div>

      <form className="mt-5 sm:mt-6" action="/shop" method="get">
        {params.category ? (
          <input type="hidden" name="category" value={params.category} />
        ) : null}
        <input
          type="search"
          name="search"
          defaultValue={params.search || ""}
          placeholder="جستجو..."
          className="w-full max-w-md rounded-full border border-line bg-cream/80 px-5 py-3 text-sm text-plum outline-none ring-plum/20 placeholder:text-plum/40 focus:ring-2"
        />
      </form>

      <p className="mt-6 text-sm text-plum/55 sm:mt-8">{products.count} محصول</p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-6 lg:grid-cols-3">
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
