"use client";

import { useEffect, useMemo, useState } from "react";

import { useCart } from "@/components/cart-provider";
import { formatPrice, type Product } from "@/lib/api";

export function ProductPurchase({ product }: { product: Product }) {
  const variants = product.variants || [];

  const colors = useMemo(
    () => Array.from(new Set(variants.map((v) => v.color).filter(Boolean))),
    [variants],
  );
  const sizes = useMemo(
    () => Array.from(new Set(variants.map((v) => v.size).filter(Boolean))),
    [variants],
  );

  const [color, setColor] = useState(colors[0] || "");
  const [size, setSize] = useState(sizes[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const { addItem } = useCart();

  useEffect(() => {
    if (!colors.includes(color)) setColor(colors[0] || "");
  }, [colors, color]);

  useEffect(() => {
    if (!sizes.includes(size)) setSize(sizes[0] || "");
  }, [sizes, size]);

  const selected = variants.find((v) => v.color === color && v.size === size);
  const maxQty = selected?.stock ?? 1;

  function isColorAvailable(nextColor: string) {
    return variants.some((v) => v.color === nextColor && v.stock > 0);
  }

  function isSizeAvailable(nextSize: string) {
    return variants.some((v) => v.size === nextSize && v.stock > 0);
  }

  async function onAdd() {
    if (!selected) return;
    setBusy(true);
    setMessage("");
    try {
      await addItem(product.id, selected.id, quantity);
      setMessage(`${quantity} عدد به سبد اضافه شد`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "خطا در افزودن به سبد");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs tracking-[0.28em] text-plum/50 uppercase">
          {product.category_name_fa}
        </p>
        <h1 className="font-display text-4xl leading-tight text-plum md:text-5xl">
          {product.name_fa}
        </h1>
        <p className="text-plum/55">{product.name}</p>
        <div className="flex items-baseline gap-3 pt-2">
          <span className="text-2xl font-semibold text-plum">
            {formatPrice(product.price)}
          </span>
          {product.compare_at_price ? (
            <span className="text-plum/40 line-through">
              {formatPrice(product.compare_at_price)}
            </span>
          ) : null}
        </div>
      </div>

      <p className="max-w-xl text-base leading-8 text-plum/75 rtl">
        {product.description_fa || product.description}
      </p>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-plum">رنگ</p>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => {
            const available = isColorAvailable(c);
            const comboOk = !size
              ? available
              : Boolean(
                  variants.find((v) => v.color === c && v.size === size && v.stock > 0),
                );
            return (
              <button
                key={c}
                type="button"
                disabled={!available}
                onClick={() => {
                  setColor(c);
                  setQuantity(1);
                }}
                className={`min-w-14 rounded-full border px-4 py-2 text-sm transition ${
                  color === c
                    ? "border-plum bg-plum text-cream"
                    : "border-line bg-cream/80 text-plum"
                } disabled:cursor-not-allowed disabled:opacity-35 ${
                  color === c || comboOk ? "" : "opacity-60"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-plum">سایز</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => {
            const available = isSizeAvailable(s);
            const combo = variants.find((v) => v.color === color && v.size === s);
            const comboOk = Boolean(combo && combo.stock > 0);
            return (
              <button
                key={s}
                type="button"
                disabled={!available}
                onClick={() => {
                  setSize(s);
                  setQuantity(1);
                }}
                className={`min-w-14 rounded-full border px-4 py-2 text-sm transition ${
                  size === s
                    ? "border-plum bg-plum text-cream"
                    : "border-line bg-cream/80 text-plum"
                } disabled:cursor-not-allowed disabled:opacity-35 ${
                  size === s || comboOk ? "" : "opacity-60"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="inline-flex items-center rounded-full border border-line bg-cream/80">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center text-xl text-plum disabled:opacity-35"
            disabled={!selected || quantity <= 1 || busy}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="کاهش تعداد"
          >
            −
          </button>
          <span className="min-w-8 text-center text-base font-semibold text-plum">
            {quantity}
          </span>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center text-xl text-plum disabled:opacity-35"
            disabled={!selected || quantity >= maxQty || busy}
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            aria-label="افزایش تعداد"
          >
            +
          </button>
        </div>
        <button
          type="button"
          className="btn-primary"
          disabled={!selected || selected.stock <= 0 || busy}
          onClick={() => void onAdd()}
        >
          {busy ? "در حال افزودن..." : "افزودن به سبد"}
        </button>
        {selected ? (
          <p className="text-sm text-plum/55">
            {selected.stock > 0 ? `${selected.stock} عدد موجود` : "ناموجود"}
          </p>
        ) : (
          <p className="text-sm text-plum/55">سایز و رنگ را انتخاب کنید</p>
        )}
      </div>
      {message ? <p className="text-sm font-medium text-plum">{message}</p> : null}
    </div>
  );
}
