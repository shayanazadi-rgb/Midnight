"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function SiteHeader() {
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
      <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-2.5 sm:px-5 sm:py-3 md:px-8 md:py-4 xl:max-w-7xl">
        <Link
          href="/"
          aria-label="Midnight Shop"
          className="group relative block shrink-0"
        >
          <div className="relative h-[3.85rem] w-[3.85rem] transition duration-500 group-hover:scale-[1.03] sm:h-[4.5rem] sm:w-[4.5rem] md:h-[5.25rem] md:w-[5.25rem] lg:h-[5.75rem] lg:w-[5.75rem]">
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
      </div>
    </header>
  );
}
