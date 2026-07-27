"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth-provider";
import { formatPrice, getMyOrders, type Order } from "@/lib/api";

const STATUS_LABEL: Record<string, string> = {
  pending: "در انتظار پرداخت",
  paid: "پرداخت‌شده",
  shipped: "ارسال‌شده",
  cancelled: "لغو شده",
};

export default function OrdersPage() {
  const router = useRouter();
  const { ready, isAuthenticated, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && !isAuthenticated) {
      router.replace("/auth?next=/orders");
    }
  }, [ready, isAuthenticated, router]);

  useEffect(() => {
    if (!ready || !isAuthenticated || !token) return;
    setLoading(true);
    setError("");
    void getMyOrders(token)
      .then(setOrders)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "بارگذاری سفارش‌ها ناموفق بود"),
      )
      .finally(() => setLoading(false));
  }, [ready, isAuthenticated, token]);

  if (!ready || !isAuthenticated) {
    return (
      <div className="mx-auto max-w-2xl px-5 pb-28 pt-28 text-plum/60 md:px-8">
        در حال بارگذاری…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pb-28 pt-28 md:px-8">
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] text-plum/50 uppercase">Orders</p>
        <h1 className="mt-2 font-display text-4xl text-plum md:text-5xl">
          سفارش‌های من
        </h1>
      </div>

      {loading ? (
        <p className="text-plum/60">در حال بارگذاری سفارش‌ها…</p>
      ) : error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : orders.length === 0 ? (
        <div className="space-y-6 rounded-[1.75rem] bg-cream p-8 text-center ring-1 ring-line">
          <p className="text-plum/65">هنوز سفارشی ثبت نکرده‌اید.</p>
          <Link href="/shop" className="btn-primary inline-flex">
            رفتن به فروشگاه
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-[1.5rem] bg-cream p-5 ring-1 ring-line"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-plum">سفارش #{order.id}</p>
                  <p className="mt-1 text-sm text-plum/55">
                    {new Date(order.created_at).toLocaleDateString("fa-IR")}
                    {" · "}
                    {order.item_count} قلم
                  </p>
                </div>
                <span className="rounded-full bg-plum/10 px-3 py-1 text-xs font-semibold text-plum">
                  {STATUS_LABEL[order.status] || order.status}
                </span>
              </div>
              <p className="mt-3 font-semibold text-plum">
                {formatPrice(order.total)}
              </p>
              <ul className="mt-3 space-y-1 text-sm text-plum/70">
                {order.items.slice(0, 3).map((item) => (
                  <li key={item.id}>
                    {item.product_name_fa} × {item.quantity}
                  </li>
                ))}
                {order.items.length > 3 ? (
                  <li>و {order.items.length - 3} مورد دیگر…</li>
                ) : null}
              </ul>
              {order.status === "pending" ? (
                <Link
                  href={`/payment/${order.id}`}
                  className="btn-ghost mt-4 inline-flex"
                >
                  ادامه پرداخت
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
