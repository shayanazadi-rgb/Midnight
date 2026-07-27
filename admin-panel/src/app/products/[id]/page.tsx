"use client";

import { use } from "react";

import { ProductForm } from "@/components/product-form";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-plum">ویرایش محصول</h1>
        <p className="mt-2 text-plum/65">#{id}</p>
      </div>
      <ProductForm productId={Number(id)} />
    </div>
  );
}
