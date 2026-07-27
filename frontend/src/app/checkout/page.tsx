"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/components/cart-provider";
import { checkout, formatPrice } from "@/lib/api";

const CART_KEY = "midnightshop_cart_id";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, loading } = useCart();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && (!cart || cart.items.length === 0)) {
      router.replace("/cart");
    }
  }, [loading, cart, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const cartId = localStorage.getItem(CART_KEY);
    if (!cartId) {
      setError("سبد خرید پیدا نشد.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const order = await checkout(cartId, {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        postal_code: postalCode.trim(),
      });
      router.push(`/payment/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ثبت اطلاعات ناموفق بود");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-5 pb-20 pt-28 text-plum/60 md:px-8">
        در حال بارگذاری…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pb-20 pt-28 md:px-8">
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] text-plum/50 uppercase">Checkout</p>
        <h1 className="mt-2 font-display text-4xl text-plum md:text-5xl">اطلاعات ارسال</h1>
        <p className="mt-3 text-plum/65">
          جمع سبد: {formatPrice(cart?.subtotal || 0)} — بعد از ثبت به صفحه پرداخت می‌روید.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5 rounded-[1.75rem] bg-cream/70 p-6 ring-1 ring-line">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2 text-sm text-plum">
            <span>نام</span>
            <input
              className="w-full rounded-2xl border border-line bg-cream/80 px-4 py-3 outline-none focus:border-plum"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoComplete="given-name"
            />
          </label>
          <label className="block space-y-2 text-sm text-plum">
            <span>نام خانوادگی</span>
            <input
              className="w-full rounded-2xl border border-line bg-cream/80 px-4 py-3 outline-none focus:border-plum"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              autoComplete="family-name"
            />
          </label>
        </div>

        <label className="block space-y-2 text-sm text-plum">
          <span>شماره تماس</span>
          <input
            className="w-full rounded-2xl border border-line bg-cream/80 px-4 py-3 outline-none focus:border-plum"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            inputMode="tel"
            autoComplete="tel"
            placeholder="09xxxxxxxxx"
          />
        </label>

        <label className="block space-y-2 text-sm text-plum">
          <span>آدرس</span>
          <textarea
            className="min-h-28 w-full rounded-2xl border border-line bg-cream/80 px-4 py-3 outline-none focus:border-plum"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            autoComplete="street-address"
          />
        </label>

        <label className="block space-y-2 text-sm text-plum">
          <span>
            کد پستی <span className="text-plum/45">(اختیاری)</span>
          </span>
          <input
            className="w-full rounded-2xl border border-line bg-cream/80 px-4 py-3 outline-none focus:border-plum"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            inputMode="numeric"
            autoComplete="postal-code"
          />
        </label>

        {error ? (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}

        <div className="flex flex-wrap gap-3 pt-2">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "در حال ثبت…" : "ادامه به پرداخت"}
          </button>
          <Link href="/cart" className="btn-ghost">
            بازگشت به سبد
          </Link>
        </div>
      </form>
    </div>
  );
}
