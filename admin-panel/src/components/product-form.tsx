"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Category,
  createProduct,
  getCategories,
  getProduct,
  updateProduct,
  uploadImage,
} from "@/lib/api";

const DEFAULT_HEX = "#efcce3";
const DEFAULT_STOCK = 10;

type Props = {
  productId?: number;
};

function uniqueNonEmpty(values: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of values) {
    const value = raw.trim();
    if (!value) continue;
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(value);
  }
  return out;
}

export function ProductForm({ productId }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [nameFa, setNameFa] = useState("");
  const [name, setName] = useState("");
  const [descriptionFa, setDescriptionFa] = useState("");
  const [price, setPrice] = useState("890000");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [sizes, setSizes] = useState<string[]>(["S", "M", "L"]);
  const [colors, setColors] = useState<string[]>(["مشکی", "سفید"]);
  const [stockMap, setStockMap] = useState<Record<string, number>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const cleanSizes = useMemo(() => uniqueNonEmpty(sizes), [sizes]);
  const cleanColors = useMemo(() => uniqueNonEmpty(colors), [colors]);

  useEffect(() => {
    getCategories()
      .then((cats) => {
        setCategories(cats);
        if (!productId && cats[0]) setCategory(String(cats[0].id));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "خطا"));

    if (productId) {
      getProduct(productId)
        .then((p) => {
          setNameFa(p.name_fa);
          setName(p.name);
          setDescriptionFa(p.description_fa || p.description);
          setPrice(String(p.price));
          setCategory(String(p.category));
          setImages(p.images || []);
          setFeatured(p.featured);
          setIsActive(p.is_active);

          const nextSizes = uniqueNonEmpty(p.variants?.map((v) => v.size) || []);
          const nextColors = uniqueNonEmpty(p.variants?.map((v) => v.color) || []);
          setSizes(nextSizes.length ? nextSizes : ["M"]);
          setColors(nextColors.length ? nextColors : ["مشکی"]);

          const nextStock: Record<string, number> = {};
          for (const v of p.variants || []) {
            nextStock[`${v.size}||${v.color}`] = v.stock;
          }
          setStockMap(nextStock);
        })
        .catch((err) => setError(err instanceof Error ? err.message : "خطا"));
    }
  }, [productId]);

  async function onUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const res = await uploadImage(file, "products");
        uploaded.push(res.url);
      }
      setImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "آپلود ناموفق");
    } finally {
      setUploading(false);
    }
  }

  function setMainImage(url: string) {
    setImages((prev) => {
      if (prev[0] === url) return prev;
      return [url, ...prev.filter((u) => u !== url)];
    });
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((u) => u !== url));
  }

  function stockKey(size: string, color: string) {
    return `${size}||${color}`;
  }

  function getStock(size: string, color: string) {
    const key = stockKey(size, color);
    return stockMap[key] ?? DEFAULT_STOCK;
  }

  function setStock(size: string, color: string, stock: number) {
    const key = stockKey(size, color);
    setStockMap((prev) => ({ ...prev, [key]: stock }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!category) {
      setError("دسته را انتخاب کنید");
      return;
    }
    if (!cleanSizes.length) {
      setError("حداقل یک سایز اضافه کنید");
      return;
    }
    if (!cleanColors.length) {
      setError("حداقل یک رنگ اضافه کنید");
      return;
    }

    const variants = cleanSizes.flatMap((size) =>
      cleanColors.map((color) => ({
        size,
        color,
        color_hex: DEFAULT_HEX,
        stock: getStock(size, color),
      })),
    );

    setLoading(true);
    setError("");
    const payload = {
      name_fa: nameFa,
      name: name || nameFa,
      description_fa: descriptionFa,
      description: descriptionFa,
      price: Number(price) || 0,
      category: Number(category),
      images,
      featured,
      is_active: isActive,
      tags: "",
      variants,
    };
    try {
      if (productId) {
        await updateProduct(productId, payload);
      } else {
        await createProduct(payload);
      }
      router.push("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ذخیره ناموفق");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="card grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span>نام محصول (فارسی)</span>
          <input
            className="field"
            value={nameFa}
            onChange={(e) => setNameFa(e.target.value)}
            required
          />
        </label>
        <label className="space-y-2 text-sm">
          <span>نام انگلیسی</span>
          <input className="field" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="space-y-2 text-sm">
          <span>دسته‌بندی لباس</span>
          <select
            className="field"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">انتخاب دسته</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_fa}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm">
          <span>قیمت (تومان)</span>
          <input
            className="field"
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        <label className="space-y-2 text-sm md:col-span-2">
          <span>توضیحات</span>
          <textarea
            className="field min-h-28"
            value={descriptionFa}
            onChange={(e) => setDescriptionFa(e.target.value)}
            required
          />
        </label>
        <div className="space-y-2 text-sm md:col-span-2">
          <span className="block">عکس‌های محصول</span>
          <p className="text-xs text-plum/55">
            چند عکس آپلود کنید. عکس اصلی در کارت‌ها و سبد نمایش داده می‌شود — با دکمه
            «اصلی» انتخابش کنید.
          </p>
          <input
            className="field"
            type="file"
            accept="image/*"
            multiple
            disabled={uploading}
            onChange={(e) => {
              void onUpload(e.target.files);
              e.target.value = "";
            }}
          />
          {uploading ? (
            <p className="text-xs text-plum/60">در حال آپلود…</p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-3">
            {images.map((url, index) => (
              <div
                key={url}
                className={`relative rounded-xl ring-2 ${
                  index === 0 ? "ring-plum" : "ring-transparent"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-28 w-28 rounded-xl object-cover" />
                {index === 0 ? (
                  <span className="absolute bottom-1 right-1 rounded-full bg-plum px-2 py-0.5 text-[10px] font-semibold text-cream">
                    اصلی
                  </span>
                ) : (
                  <button
                    type="button"
                    className="absolute bottom-1 right-1 rounded-full bg-cream/95 px-2 py-0.5 text-[10px] font-semibold text-plum ring-1 ring-plum/25"
                    onClick={() => setMainImage(url)}
                  >
                    اصلی
                  </button>
                )}
                <button
                  type="button"
                  className="absolute -left-2 -top-2 rounded-full bg-plum px-2 text-xs text-cream"
                  onClick={() => removeImage(url)}
                  aria-label="حذف عکس"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          ویژه در صفحه اصلی
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          فعال در فروشگاه
        </label>
      </div>

      <div className="card space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-plum">سایز و رنگ</h2>
          <p className="mt-1 text-sm text-plum/55">
            سایزها و رنگ‌ها را جدا اضافه کنید. در فروشگاه مشتری یکی از هر کدام را انتخاب
            می‌کند.
          </p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-plum">سایزها</p>
            <div className="flex flex-wrap items-center gap-2">
              {sizes.map((size, index) => (
                <div key={index} className="group relative">
                  <input
                    className="field !w-16 !px-2 !py-2 text-center text-sm"
                    placeholder="M"
                    maxLength={8}
                    value={size}
                    onChange={(e) =>
                      setSizes((prev) =>
                        prev.map((item, i) => (i === index ? e.target.value : item)),
                      )
                    }
                  />
                  {sizes.length > 1 ? (
                    <button
                      type="button"
                      className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-plum text-[10px] leading-none text-cream opacity-0 transition group-hover:opacity-100"
                      onClick={() =>
                        setSizes((prev) => prev.filter((_, i) => i !== index))
                      }
                      aria-label="حذف سایز"
                    >
                      ×
                    </button>
                  ) : null}
                </div>
              ))}
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-plum/35 text-lg font-semibold text-plum transition hover:border-plum hover:bg-pink/40"
                onClick={() => setSizes((prev) => [...prev, ""])}
                aria-label="افزودن سایز"
              >
                +
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-plum">رنگ‌ها</p>
            <div className="flex flex-wrap items-center gap-2">
              {colors.map((color, index) => (
                <div key={index} className="group relative">
                  <input
                    className="field !w-24 !px-2 !py-2 text-center text-sm"
                    placeholder="مشکی"
                    maxLength={20}
                    value={color}
                    onChange={(e) =>
                      setColors((prev) =>
                        prev.map((item, i) => (i === index ? e.target.value : item)),
                      )
                    }
                  />
                  {colors.length > 1 ? (
                    <button
                      type="button"
                      className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-plum text-[10px] leading-none text-cream opacity-0 transition group-hover:opacity-100"
                      onClick={() =>
                        setColors((prev) => prev.filter((_, i) => i !== index))
                      }
                      aria-label="حذف رنگ"
                    >
                      ×
                    </button>
                  ) : null}
                </div>
              ))}
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-plum/35 text-lg font-semibold text-plum transition hover:border-plum hover:bg-pink/40"
                onClick={() => setColors((prev) => [...prev, ""])}
                aria-label="افزودن رنگ"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {cleanSizes.length > 0 && cleanColors.length > 0 ? (
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-plum">موجودی هر ترکیب</p>
              <p className="text-xs text-plum/55">
                برای هر سایز و رنگ، موجودی جداگانه تنظیم کنید.
              </p>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-line">
              <table className="min-w-full text-sm">
                <thead className="bg-mist/70 text-plum">
                  <tr>
                    <th className="px-3 py-2 text-right font-semibold">سایز / رنگ</th>
                    {cleanColors.map((color) => (
                      <th key={color} className="px-3 py-2 text-center font-semibold">
                        {color}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cleanSizes.map((size) => (
                    <tr key={size} className="border-t border-line">
                      <td className="px-3 py-2 font-medium text-plum">{size}</td>
                      {cleanColors.map((color) => (
                        <td key={`${size}-${color}`} className="px-2 py-2">
                          <input
                            className="field !w-20 mx-auto !px-2 !py-2 text-center"
                            type="number"
                            min={0}
                            value={getStock(size, color)}
                            onChange={(e) =>
                              setStock(size, color, Number(e.target.value) || 0)
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>

      <button className="btn btn-primary" disabled={loading} type="submit">
        {loading ? "در حال ذخیره…" : productId ? "بروزرسانی محصول" : "انتشار محصول"}
      </button>
    </form>
  );
}
