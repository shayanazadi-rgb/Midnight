import { notFound } from "next/navigation";

import { ProductGallery } from "@/components/product-gallery";
import { ProductPurchase } from "@/components/product-purchase";
import { getProduct } from "@/lib/api";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;

  let product;
  try {
    product = await getProduct(slug);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 pt-[7.25rem] sm:gap-10 sm:px-5 sm:pb-20 sm:pt-28 md:grid-cols-2 md:items-start md:gap-12 md:px-8 lg:gap-16 xl:max-w-7xl">
      <ProductGallery images={product.images || []} alt={product.name} />
      <ProductPurchase product={product} />
    </div>
  );
}
