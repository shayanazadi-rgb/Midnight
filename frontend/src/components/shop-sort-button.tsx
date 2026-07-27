"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { value: "", label: "پیش‌فرض" },
  { value: "newest", label: "جدید‌ترین‌ها" },
  { value: "bestsellers", label: "پرفروش‌ترین‌ها" },
  { value: "discount", label: "تخفیف‌دارها" },
] as const;

export function ShopSortButton() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const current = searchParams.get("sort") || "";
  const currentLabel =
    SORT_OPTIONS.find((o) => o.value === current)?.label || "مرتب‌سازی";

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function applySort(value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (!value) {
      next.delete("sort");
    } else {
      next.set("sort", value);
    }
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`inline-flex h-[2.875rem] items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${
          current
            ? "border-plum bg-plum text-white"
            : "border-line bg-cream text-plum hover:border-plum/40"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />
        </svg>
        <span className="max-w-[7.5rem] truncate">{currentLabel}</span>
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
          fill="currentColor"
          aria-hidden
        >
          <path d="M7 10l5 5 5-5H7z" />
        </svg>
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute end-0 top-[calc(100%+0.5rem)] z-40 min-w-[12rem] overflow-hidden rounded-2xl border border-line bg-cream py-1.5 shadow-[0_12px_32px_rgba(63,18,48,0.14)]"
        >
          {SORT_OPTIONS.map((option) => {
            const selected = option.value === current;
            return (
              <li key={option.value || "default"} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => applySort(option.value)}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition ${
                    selected
                      ? "bg-plum/10 font-semibold text-plum"
                      : "text-plum/75 hover:bg-plum/5 hover:text-plum"
                  }`}
                >
                  {option.label}
                  {selected ? (
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
