"use client";

import { useEffect, useState } from "react";

import { Sale, formatPrice, getSales, getSalesSummary } from "@/lib/api";

const statusLabel: Record<string, string> = {
  pending: "در انتظار",
  paid: "پرداخت‌شده",
  shipped: "ارسال‌شده",
  cancelled: "لغو شده",
};

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [summary, setSummary] = useState({
    orders_count: 0,
    units_sold: 0,
    revenue: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getSales(), getSalesSummary()])
      .then(([list, sum]) => {
        setSales(list);
        setSummary(sum);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "خطا"));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-plum">فروش‌ها</h1>
        <p className="mt-2 text-plum/65">
          سفارش‌های ثبت‌شده — بعداً به تسویه سبد وصل می‌شود
        </p>
      </div>

      {error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card">
          <p className="text-sm text-plum/55">تعداد سفارش</p>
          <p className="mt-2 text-2xl font-semibold text-plum">{summary.orders_count}</p>
        </div>
        <div className="card">
          <p className="text-sm text-plum/55">تعداد قطعه فروخته‌شده</p>
          <p className="mt-2 text-2xl font-semibold text-plum">{summary.units_sold}</p>
        </div>
        <div className="card">
          <p className="text-sm text-plum/55">جمع درآمد</p>
          <p className="mt-2 text-2xl font-semibold text-plum">
            {formatPrice(summary.revenue)}
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {sales.map((sale) => (
          <div key={sale.id} className="card space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-plum">
                  سفارش #{sale.id} —{" "}
                  {sale.customer_name ||
                    [sale.first_name, sale.last_name].filter(Boolean).join(" ") ||
                    "بدون نام"}
                </p>
                <p className="text-sm text-plum/55">
                  {sale.customer_phone || "—"}
                  {sale.postal_code ? ` · ${sale.postal_code}` : ""} ·{" "}
                  {new Date(sale.created_at).toLocaleString("fa-IR")}
                </p>
              </div>
              <div className="text-left">
                <p className="text-sm text-plum/55">
                  {statusLabel[sale.status] || sale.status}
                </p>
                <p className="font-semibold text-plum">{formatPrice(sale.total)}</p>
              </div>
            </div>
            <ul className="space-y-1 text-sm text-plum/75">
              {sale.items.map((item) => (
                <li key={item.id}>
                  {item.product_name_fa} · {item.size} · {item.color} × {item.quantity} —{" "}
                  {formatPrice(item.line_total)}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {!sales.length ? (
          <p className="card text-center text-plum/55">
            هنوز فروشی ثبت نشده. این صفحه آماده است و بعد از اتصال تسویه پر می‌شود.
          </p>
        ) : null}
      </div>
    </div>
  );
}
