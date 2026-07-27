"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  Category,
  createCategory,
  deleteCategory,
  getCategories,
  uploadImage,
} from "@/lib/api";

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [nameFa, setNameFa] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setItems(await getCategories());
  }

  useEffect(() => {
    refresh().catch((err) => setError(err instanceof Error ? err.message : "خطا"));
  }, []);

  async function onUpload(file: File | null) {
    if (!file) return;
    const res = await uploadImage(file, "categories");
    setImage(res.url);
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createCategory({
        name_fa: nameFa,
        name: name || nameFa,
        description,
        image,
        sort_order: items.length,
      });
      setNameFa("");
      setName("");
      setDescription("");
      setImage("");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ذخیره");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id: number) {
    if (!confirm("این دسته حذف شود؟")) return;
    try {
      await deleteCategory(id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حذف ناموفق");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-plum">دسته‌بندی‌ها</h1>
        <p className="mt-2 text-plum/65">افزودن یا حذف دسته‌های لباس</p>
      </div>

      {error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <form onSubmit={onCreate} className="card grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span>نام فارسی</span>
          <input className="field" value={nameFa} onChange={(e) => setNameFa(e.target.value)} required />
        </label>
        <label className="space-y-2 text-sm">
          <span>نام انگلیسی</span>
          <input className="field" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="space-y-2 text-sm md:col-span-2">
          <span>توضیح</span>
          <textarea className="field min-h-24" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label className="space-y-2 text-sm md:col-span-2">
          <span>عکس دسته (ذخیره محلی)</span>
          <input
            className="field"
            type="file"
            accept="image/*"
            onChange={(e) => onUpload(e.target.files?.[0] || null)}
          />
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="mt-2 h-24 w-24 rounded-xl object-cover" />
          ) : null}
        </label>
        <div className="md:col-span-2">
          <button className="btn btn-primary" disabled={loading} type="submit">
            {loading ? "در حال ذخیره…" : "افزودن دسته"}
          </button>
        </div>
      </form>

      <div className="grid gap-3">
        {items.map((cat) => (
          <div key={cat.id} className="card flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {cat.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cat.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
              ) : (
                <div className="grid h-14 w-14 place-items-center rounded-xl bg-pink-soft text-xs text-plum/50">
                  بدون عکس
                </div>
              )}
              <div>
                <p className="font-semibold text-plum">{cat.name_fa}</p>
                <p className="text-sm text-plum/55">
                  {cat.name} · {cat.product_count} محصول
                </p>
              </div>
            </div>
            <button type="button" className="btn btn-danger text-sm" onClick={() => onDelete(cat.id)}>
              حذف
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
