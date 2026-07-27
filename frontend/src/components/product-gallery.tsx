"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ShopImage } from "@/components/shop-image";

type Props = {
  images: string[];
  alt: string;
};

export function ProductGallery({ images, alt }: Props) {
  const slides = images.length > 0 ? images : ["/logo.jpg"];
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  const goTo = useCallback(
    (next: number) => {
      const len = slides.length;
      setIndex(((next % len) + len) % len);
    },
    [slides.length],
  );

  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    setIndex(0);
  }, [images]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
    touchDeltaX.current = 0;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    touchDeltaX.current = (e.touches[0]?.clientX ?? 0) - touchStartX.current;
  }

  function onTouchEnd() {
    if (Math.abs(touchDeltaX.current) > 48) {
      if (touchDeltaX.current < 0) next();
      else prev();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  }

  const showControls = slides.length > 1;

  return (
    <div className="space-y-3">
      <div
        className="relative aspect-[4/5] touch-pan-y overflow-hidden rounded-[1.5rem] bg-mist sm:rounded-[2rem]"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="absolute inset-0 flex transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
          dir="ltr"
        >
          {slides.map((src, i) => (
            <div key={`${src}-${i}`} className="relative h-full w-full shrink-0">
              <ShopImage
                src={src}
                alt={i === 0 ? alt : `${alt} ${i + 1}`}
                fill
                priority={i === 0}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>

        {showControls ? (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="عکس قبلی"
              className="absolute left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-plum/15 bg-cream/90 text-plum shadow-[0_8px_24px_rgba(104,32,80,0.14)] backdrop-blur transition hover:bg-white md:inline-flex"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="عکس بعدی"
              className="absolute right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-plum/15 bg-cream/90 text-plum shadow-[0_8px_24px_rgba(104,32,80,0.14)] backdrop-blur transition hover:bg-white md:inline-flex"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5 md:hidden">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`عکس ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-5 bg-cream" : "w-1.5 bg-cream/50"
                  }`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {showControls ? (
        <div className="hidden gap-2 overflow-x-auto pb-1 md:flex" dir="ltr">
          {slides.map((src, i) => (
            <button
              key={`${src}-thumb-${i}`}
              type="button"
              onClick={() => goTo(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-2 transition ${
                i === index
                  ? "ring-plum"
                  : "ring-transparent opacity-75 hover:opacity-100"
              }`}
            >
              <ShopImage src={src} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
