"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";

import { formatPrice, getOrder, type Order } from "@/lib/api";

export default function PaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrder(Number(orderId))
      .then(setOrder)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "سفارش پیدا نشد"),
      );
  }, [orderId]);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-5 pb-20 pt-28 md:px-8">
        <p className="text-plum/70">{error}</p>
        <Link href="/cart" className="btn-primary inline-flex">
          بازگشت به سبد
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-5 pb-20 pt-28 text-plum/60 md:px-8">
        در حال بارگذاری سفارش…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pb-20 pt-28 md:px-8">
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] text-plum/50 uppercase">Payment</p>
        <h1 className="mt-2 font-display text-4xl text-plum md:text-5xl">پرداخت</h1>
        <p className="mt-3 text-plum/65">سفارش #{order.id} — هنوز درگاه پرداخت وصل نشده است.</p>
      </div>

      <div className="space-y-6 rounded-[1.75rem] bg-cream p-6 ring-1 ring-line">
        <div className="space-y-2 text-sm text-plum/80">
          <p>
            <span className="text-plum/50">گیرنده: </span>
            {order.full_name || `${order.first_name} ${order.last_name}`}
          </p>
          <p>
            <span className="text-plum/50">تلفن: </span>
            {order.customer_phone}
          </p>
          <p>
            <span className="text-plum/50">آدرس: </span>
            {order.customer_address}
          </p>
          {order.postal_code ? (
            <p>
              <span className="text-plum/50">کد پستی: </span>
              {order.postal_code}
            </p>
          ) : null}
        </div>

        <div className="silk-divider" />

        <ul className="space-y-3 text-sm text-plum">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4">
              <span>
                {item.product_name_fa} · {item.color} · {item.size} × {item.quantity}
              </span>
              <span className="font-semibold">{formatPrice(item.line_total)}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between rounded-2xl bg-plum px-5 py-4 text-cream">
          <span>مبلغ قابل پرداخت</span>
          <span className="text-xl font-semibold">{formatPrice(order.total)}</span>
        </div>

        <div className="rounded-2xl border border-dashed border-plum/25 bg-pink/40 px-5 py-6 text-center text-plum/75">
          درگاه پرداخت به‌زودی اینجا قرار می‌گیرد.
          <br />
          وقتی آماده شد، بگو تا وصلش کنیم.
        </div>

        <Link href="/shop" className="btn-ghost inline-flex">
          بازگشت به فروشگاه
        </Link>
      </div>
    </div>
  );
}
