"use client";

import Link from "next/link";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/components/auth-provider";

type Mode = "login" | "register";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/checkout";
  const { ready, isAuthenticated, login, register } = useAuth();

  const [mode, setMode] = useState<Mode>(
    searchParams.get("mode") === "register" ? "register" : "login",
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMode(searchParams.get("mode") === "register" ? "register" : "login");
  }, [searchParams]);

  useEffect(() => {
    if (ready && isAuthenticated) {
      router.replace(nextPath);
    }
  }, [ready, isAuthenticated, nextPath, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (mode === "login") {
        await login({ phone: phone.trim(), password });
      } else {
        await register({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          postal_code: postalCode.trim(),
          password,
        });
      }
      router.replace(nextPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "عملیات ناموفق بود");
    } finally {
      setSubmitting(false);
    }
  }

  if (!ready || isAuthenticated) {
    return (
      <div className="mx-auto max-w-2xl px-5 pb-20 pt-28 text-plum/60 md:px-8">
        در حال بارگذاری…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pb-20 pt-28 md:px-8">
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] text-plum/50 uppercase">Account</p>
        <h1 className="mt-2 font-display text-4xl text-plum md:text-5xl">
          {mode === "login" ? "ورود" : "ساخت اکانت"}
        </h1>
        <p className="mt-3 text-plum/65">
          {mode === "login"
            ? "با شماره تماس و رمز عبور وارد شوید تا خرید را ادامه دهید."
            : "اطلاعات ارسال را وارد کنید و برای ورودهای بعدی یک رمز بگذارید."}
        </p>
      </div>

      <div className="mb-5 flex gap-2 rounded-full bg-cream p-1 ring-1 ring-line">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError("");
          }}
          className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
            mode === "login"
              ? "bg-plum text-cream"
              : "text-plum/70 hover:text-plum"
          }`}
        >
          حساب دارم
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("register");
            setError("");
          }}
          className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
            mode === "register"
              ? "bg-plum text-cream"
              : "text-plum/70 hover:text-plum"
          }`}
        >
          ساخت اکانت
        </button>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-[1.75rem] bg-cream p-6 ring-1 ring-line"
      >
        {mode === "register" ? (
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
        ) : null}

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

        {mode === "register" ? (
          <>
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
          </>
        ) : null}

        <label className="block space-y-2 text-sm text-plum">
          <span>
            {mode === "login" ? "رمز عبور" : "رمز عبور برای ورود بعدی"}
          </span>
          <input
            type="password"
            className="w-full rounded-2xl border border-line bg-cream/80 px-4 py-3 outline-none focus:border-plum"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
          {mode === "register" ? (
            <span className="block text-xs text-plum/50">
              حداقل ۸ کاراکتر — دفعات بعد با همین شماره تماس و رمز وارد می‌شوید.
            </span>
          ) : null}
        </label>

        {error ? (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}

        <div className="flex flex-wrap gap-3 pt-2">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting
              ? "لطفاً صبر کنید…"
              : mode === "login"
                ? "ورود و ادامه خرید"
                : "ساخت اکانت و ادامه"}
          </button>
          <Link href="/cart" className="btn-ghost">
            بازگشت به سبد
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-5 pb-20 pt-28 text-plum/60 md:px-8">
          در حال بارگذاری…
        </div>
      }
    >
      <AuthForm />
    </Suspense>
  );
}
