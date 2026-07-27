import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-plum text-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:gap-10 sm:px-5 sm:py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <p className="font-display text-2xl tracking-[0.14em] sm:text-3xl sm:tracking-[0.16em]">
            MIDNIGHT SHOP
          </p>
          <p className="mt-3 max-w-sm text-sm leading-7 text-pink/90">
            لباس زیر و لباس خواب با حس ادیتوریال — midnightshop.ir
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 md:contents">
          <div className="space-y-3 text-sm">
            <p className="font-semibold tracking-wide text-pink">کاوش</p>
            <Link href="/shop" className="block opacity-85 hover:opacity-100">
              همه محصولات
            </Link>
            <Link href="/shop?category=bras" className="block opacity-85 hover:opacity-100">
              سوتین
            </Link>
            <Link
              href="/shop?category=lingerie-sets"
              className="block opacity-85 hover:opacity-100"
            >
              ست‌ها
            </Link>
          </div>
          <div className="space-y-3 text-sm">
            <p className="font-semibold tracking-wide text-pink">ارتباط</p>
            <p className="opacity-85">support@midnightshop.ir</p>
            <p className="opacity-85">ارسال به سراسر ایران</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-center text-xs text-pink/70 sm:px-5 md:px-8">
        © {new Date().getFullYear()} midnightshop.ir — Lingerie & Underwear
      </div>
    </footer>
  );
}
