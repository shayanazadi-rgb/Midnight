"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth-provider";

export default function ProfilePage() {
  const router = useRouter();
  const { ready, isAuthenticated, profile, logout } = useAuth();

  useEffect(() => {
    if (ready && !isAuthenticated) {
      router.replace("/auth?next=/profile");
    }
  }, [ready, isAuthenticated, router]);

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
        <p className="text-xs tracking-[0.3em] text-plum/50 uppercase">Profile</p>
        <h1 className="mt-2 font-display text-4xl text-plum md:text-5xl">پروفایل</h1>
      </div>

      <div className="space-y-4 rounded-[1.75rem] bg-cream p-6 ring-1 ring-line">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-plum/50">نام</p>
            <p className="mt-1 font-semibold text-plum">
              {profile?.first_name || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-plum/50">نام خانوادگی</p>
            <p className="mt-1 font-semibold text-plum">
              {profile?.last_name || "—"}
            </p>
          </div>
        </div>
        <div>
          <p className="text-xs text-plum/50">شماره تماس</p>
          <p className="mt-1 font-semibold text-plum" dir="ltr">
            {profile?.phone || "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-plum/50">آدرس</p>
          <p className="mt-1 text-plum/85">{profile?.address || "—"}</p>
        </div>
        {profile?.postal_code ? (
          <div>
            <p className="text-xs text-plum/50">کد پستی</p>
            <p className="mt-1 font-semibold text-plum" dir="ltr">
              {profile.postal_code}
            </p>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3 pt-4">
          <Link href="/orders" className="btn-primary">
            سفارش‌های من
          </Link>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              void logout().then(() => router.push("/"));
            }}
          >
            خروج از حساب
          </button>
        </div>
      </div>
    </div>
  );
}
