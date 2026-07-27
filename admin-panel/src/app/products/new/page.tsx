import { ProductForm } from "@/components/product-form";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-plum">محصول جدید</h1>
        <p className="mt-2 text-plum/65">عکس، نام، دسته، سایز، رنگ‌بندی و توضیحات</p>
      </div>
      <ProductForm />
    </div>
  );
}
