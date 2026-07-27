"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { useCart } from "@/components/cart-provider";

type NavItem = {
  href: string;
  label: string;
  match: (path: string) => boolean;
  icon: ReactNode;
  badge?: boolean;
};

const items: NavItem[] = [
  {
    href: "/",
    label: "خانه",
    match: (path) => path === "/",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    href: "/shop",
    label: "محصولات",
    match: (path) => path.startsWith("/shop") || path.startsWith("/product"),
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z" />
      </svg>
    ),
  },
  {
    href: "/cart",
    label: "سبد",
    match: (path) =>
      path.startsWith("/cart") ||
      path.startsWith("/checkout") ||
      path.startsWith("/payment"),
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zM7.16 14.26l.03.01h9.47c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 21.13 5H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.11.96-1.38z" />
      </svg>
    ),
    badge: true,
  },
  {
    href: "/orders",
    label: "سفارش‌ها",
    match: (path) => path.startsWith("/orders"),
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z" />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "پروفایل",
    match: (path) => path.startsWith("/profile") || path.startsWith("/auth"),
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2h19.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[max(0.85rem,env(safe-area-inset-bottom))] sm:px-4 md:pb-5">
      <nav
        aria-label="منوی پایین"
        className="pointer-events-auto w-full max-w-[28rem] rounded-[1.75rem] border-2 border-plum/35 bg-cream px-1.5 py-1.5 text-plum shadow-[0_4px_16px_rgba(104,32,80,0.12)] backdrop-blur-xl sm:px-2 sm:py-2 md:max-w-[34rem] md:rounded-[2rem] md:px-3 md:py-2.5"
      >
        <div className="grid grid-cols-5 gap-0.5 md:gap-1">
          {items.map((item) => {
            const active = item.match(pathname);
            const isCart = item.href === "/cart";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center gap-0.5 rounded-2xl px-1 py-2 text-[9px] font-semibold tracking-wide transition duration-300 sm:py-2.5 sm:text-[10px] md:gap-1 md:rounded-[1.25rem] md:py-3 md:text-xs ${
                  active
                    ? "bg-plum text-white shadow-[0_8px_20px_rgba(138,58,106,0.35)]"
                    : isCart
                      ? "text-plum hover:bg-plum/5"
                      : "text-plum/55 hover:bg-plum/5 hover:text-plum"
                }`}
              >
                <span
                  className={`relative flex h-5 w-5 items-center justify-center md:h-6 md:w-6 ${
                    active ? "text-white" : "text-current"
                  }`}
                >
                  {item.icon}
                  {item.badge && itemCount > 0 ? (
                    <span
                      className={`absolute -right-2.5 -top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold md:-right-3 md:-top-2 md:h-5 md:min-w-5 md:text-[10px] ${
                        active ? "bg-white text-plum" : "bg-plum text-white"
                      }`}
                    >
                      {itemCount > 99 ? "۹۹+" : itemCount}
                    </span>
                  ) : null}
                </span>
                <span className={active ? "text-white" : undefined}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
