"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useCart } from "@/components/cart-provider";

export function SiteHeader() {
  const { itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-all duration-500 ${
        scrolled
          ? "bg-[rgba(239,204,227,0.92)] shadow-[0_10px_40px_rgba(104,32,80,0.08)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-2.5 sm:gap-3 sm:px-5 sm:py-3 md:gap-4 md:px-8 md:py-3.5">
        <div className="justify-self-start">
          <Link
            href="/shop"
            className="inline-flex h-10 items-center justify-center rounded-full border-2 border-plum/35 bg-cream px-3.5 text-[13px] font-bold tracking-wide text-plum shadow-[0_4px_16px_rgba(104,32,80,0.12)] transition active:scale-[0.98] hover:border-plum/55 hover:bg-white sm:h-11 sm:px-5 sm:text-sm md:h-12 md:px-6 md:text-base"
          >
            فروشگاه
          </Link>
        </div>

        <Link
          href="/"
          aria-label="Midnight Shop"
          className="group relative block shrink-0 justify-self-center"
        >
          <div className="relative h-[3.85rem] w-[3.85rem] transition duration-500 group-hover:scale-[1.03] sm:h-[4.5rem] sm:w-[4.5rem] md:h-[5.75rem] md:w-[5.75rem]">
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full overflow-visible text-plum"
              style={{ direction: "ltr" }}
              aria-hidden
            >
              <defs>
                <path
                  id="header-logo-arc-top"
                  d="M 12 50 A 38 38 0 0 1 88 50"
                  fill="none"
                />
                <path
                  id="header-logo-arc-bottom"
                  d="M 88 50 A 38 38 0 0 1 12 50"
                  fill="none"
                />
              </defs>
              <circle
                cx="50"
                cy="50"
                r="49"
                fill="rgba(255,247,251,0.55)"
                stroke="currentColor"
                strokeOpacity="0.18"
                strokeWidth="0.8"
              />
              <circle
                cx="50"
                cy="50"
                r="31.5"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.22"
                strokeWidth="0.55"
              />
              <text
                fill="currentColor"
                textAnchor="middle"
                style={{
                  fontSize: "8.6px",
                  letterSpacing: "0.32em",
                  fontWeight: 700,
                  fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif",
                }}
              >
                <textPath href="#header-logo-arc-top" startOffset="50%">
                  MIDNIGHT
                </textPath>
              </text>
              <text
                fill="currentColor"
                fillOpacity="0.72"
                textAnchor="middle"
                style={{
                  fontSize: "6.4px",
                  letterSpacing: "0.42em",
                  fontWeight: 600,
                  fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif",
                }}
              >
                <textPath href="#header-logo-arc-bottom" startOffset="50%">
                  SHOP
                </textPath>
              </text>
            </svg>

            <div className="absolute inset-[22%] overflow-hidden rounded-full shadow-[0_8px_24px_rgba(104,32,80,0.14)] ring-1 ring-plum/25 transition group-hover:ring-plum/45">
              <Image
                src="/logo.jpg"
                alt=""
                fill
                sizes="(min-width: 768px) 92px, 64px"
                className="scale-110 object-cover object-[center_32%]"
                priority
              />
            </div>
          </div>
        </Link>

        <div className="flex items-center justify-self-end">
          <Link
            href="/cart"
            aria-label={`سبد خرید، ${itemCount} قلم`}
            className="relative inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded-full border-2 border-plum/35 bg-cream px-2.5 text-sm font-bold text-plum shadow-[0_4px_16px_rgba(104,32,80,0.12)] transition active:scale-[0.98] hover:border-plum/55 hover:bg-white sm:h-11 sm:gap-2.5 sm:px-4 md:h-12 md:px-5"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 shrink-0 sm:h-6 sm:w-6"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zM7.16 14.26l.03.01h9.47c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 21.13 5H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.11.96-1.38z" />
            </svg>
            <span className="hidden sm:inline">سبد خرید</span>
            <span className="absolute -left-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-plum px-1 text-[10px] font-bold text-cream sm:static sm:h-7 sm:min-w-7 sm:px-2 sm:text-xs">
              {itemCount}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
