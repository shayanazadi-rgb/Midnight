"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { clearToken, getToken, logout as apiLogout } from "@/lib/api";

type AuthCtx = {
  ready: boolean;
  authed: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx>({
  ready: false,
  authed: false,
  logout: async () => undefined,
});

export function useAuth() {
  return useContext(AuthContext);
}

const nav = [
  { href: "/", label: "داشبورد" },
  { href: "/products", label: "محصولات" },
  { href: "/categories", label: "دسته‌بندی‌ها" },
  { href: "/sales", label: "فروش‌ها" },
];

export function AuthShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const isLogin = pathname === "/login";

  useEffect(() => {
    const token = getToken();
    setAuthed(Boolean(token));
    setReady(true);
    if (!token && !isLogin) router.replace("/login");
    if (token && isLogin) router.replace("/");
  }, [pathname, isLogin, router]);

  const logout = useCallback(async () => {
    await apiLogout();
    clearToken();
    setAuthed(false);
    router.replace("/login");
  }, [router]);

  const value = useMemo(
    () => ({ ready, authed, logout }),
    [ready, authed, logout],
  );

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center text-plum/60">
        در حال بارگذاری…
      </div>
    );
  }

  if (isLogin) {
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  }

  if (!authed) return null;

  return (
    <AuthContext.Provider value={value}>
      <div className="min-h-screen">
        <header className="border-b border-line bg-cream/70 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-lg font-semibold tracking-wide text-plum">
                Midnight Admin
              </p>
              <p className="text-xs text-plum/55">پنل مدیریت فروشگاه</p>
            </div>
            <nav className="flex flex-wrap items-center gap-2">
              {nav.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                      active
                        ? "bg-plum text-cream"
                        : "text-plum hover:bg-pink-soft"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <button type="button" className="btn btn-ghost text-sm" onClick={logout}>
                خروج
              </button>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
      </div>
    </AuthContext.Provider>
  );
}
