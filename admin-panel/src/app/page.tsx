"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  formatPrice,
  getCategories,
  getProducts,
  getSalesSummary,
} from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    revenue: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getProducts(), getCategories(), getSalesSummary()])
      .then(([products, categories, sales]) => {
        setStats({
          products: products.length,
          categories: categories.length,
          orders: sales.orders_count,
          revenue: sales.revenue,
        });
      })
      .catch((err) => setError(err instanceof Error ? err.message : "خطا"));
  }, []);

  const cards = [
    { label: "محصولات", value: stats.products, href: "/products" },
    { label: "دسته‌بندی‌ها", value: stats.categories, href: "/categories" },
    { label: "سفارش‌های فروش", value: stats.orders, href: "/sales" },
    { label: "درآمد", value: formatPrice(stats.revenue), href: "/sales" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-plum">داشبورد</h1>
        <p className="mt-2 text-plum/65">مدیریت محصولات، دسته‌ها و فروش‌ها</p>
      </div>

      {error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="card hover:bg-cream">
            <p className="text-sm text-plum/55">{card.label}</p>
            <p className="mt-3 text-2xl font-semibold text-plum">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/products/new" className="btn btn-primary">
          افزودن محصول
        </Link>
        <Link href="/categories" className="btn btn-ghost">
          مدیریت دسته‌ها
        </Link>
      </div>
    </div>
  );
}
