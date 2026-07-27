"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Category,
  Product,
  deleteProduct,
  formatPrice,
  getCategories,
  getProducts,
} from "@/lib/api";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  async function refresh(cat = category, q = search) {
    const data = await getProducts({
      category: cat || undefined,
      search: q || undefined,
    });
    setProducts(data);
  }

  useEffect(() => {
    Promise.all([getProducts(), getCategories()])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "خطا"));
  }, []);

  async function onDelete(id: number) {
    if (!confirm("این محصول حذف شود؟")) return;
    try {
      await deleteProduct(id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حذف ناموفق");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-plum">محصولات</h1>
          <p className="mt-2 text-plum/65">افزودن لباس با عکس، دسته، سایز و رنگ‌بندی</p>
        </div>
        <Link href="/products/new" className="btn btn-primary">
          محصول جدید
        </Link>
      </div>

      {error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="card flex flex-wrap gap-3">
        <input
          className="field max-w-xs"
          placeholder="جستجو…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="field max-w-xs"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">همه دسته‌ها</option>
          {categories.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name_fa}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => refresh().catch((err) => setError(err.message))}
        >
          اعمال فیلتر
        </button>
      </div>

      <div className="grid gap-3">
        {products.map((p) => (
          <div key={p.id} className="card flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {p.images?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.images[0]}
                  alt=""
                  className="h-16 w-16 rounded-xl object-cover"
                />
              ) : (
                <div className="grid h-16 w-16 place-items-center rounded-xl bg-pink-soft text-xs text-plum/50">
                  بدون عکس
                </div>
              )}
              <div>
                <p className="font-semibold text-plum">{p.name_fa || p.name}</p>
                <p className="text-sm text-plum/55">
                  {p.category_name_fa} · {formatPrice(p.price)} ·{" "}
                  {p.is_active ? "فعال" : "غیرفعال"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/products/${p.id}`} className="btn btn-ghost text-sm">
                ویرایش
              </Link>
              <button
                type="button"
                className="btn btn-danger text-sm"
                onClick={() => onDelete(p.id)}
              >
                حذف
              </button>
            </div>
          </div>
        ))}
        {!products.length ? (
          <p className="text-center text-plum/55">محصولی نیست — یکی اضافه کنید.</p>
        ) : null}
      </div>
    </div>
  );
}
