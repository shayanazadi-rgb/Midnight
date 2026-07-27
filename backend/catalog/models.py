"""
Catalog Models (M in MVC)
"""

from django.db import models


class Category(models.Model):
    slug = models.SlugField(unique=True, max_length=120)
    name = models.CharField(max_length=160)
    name_fa = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    image = models.URLField(max_length=500, blank=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "name"]
        verbose_name_plural = "categories"

    def __str__(self) -> str:
        return self.name_fa or self.name


class Product(models.Model):
    slug = models.SlugField(unique=True, max_length=160)
    name = models.CharField(max_length=200)
    name_fa = models.CharField(max_length=200)
    description = models.TextField()
    description_fa = models.TextField()
    price = models.PositiveIntegerField(help_text="Base price in IRR (toman-style integer)")
    compare_at_price = models.PositiveIntegerField(null=True, blank=True)
    discount_percent = models.PositiveSmallIntegerField(
        default=0,
        help_text="Percent off base price (0–100)",
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="products",
    )
    images = models.JSONField(default=list)
    tags = models.CharField(max_length=255, blank=True, help_text="Comma-separated tags")
    featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-featured", "name"]

    def __str__(self) -> str:
        return self.name_fa or self.name

    @property
    def tag_list(self) -> list[str]:
        return [t.strip() for t in self.tags.split(",") if t.strip()]

    @property
    def in_stock(self) -> bool:
        return self.variants.filter(stock__gt=0).exists()

    @property
    def sale_price(self) -> int:
        percent = min(int(self.discount_percent or 0), 100)
        if percent <= 0:
            return self.price
        return max(0, round(self.price * (100 - percent) / 100))

    @property
    def display_compare_at(self) -> int | None:
        if (self.discount_percent or 0) > 0 and self.price > self.sale_price:
            return self.price
        if self.compare_at_price and self.compare_at_price > self.sale_price:
            return self.compare_at_price
        return None

    @property
    def effective_discount_percent(self) -> int | None:
        percent = int(self.discount_percent or 0)
        if percent > 0:
            return percent
        compare = self.display_compare_at
        if not compare or compare <= self.sale_price:
            return None
        return round((1 - self.sale_price / compare) * 100)


class ProductVariant(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="variants",
    )
    size = models.CharField(max_length=40)
    color = models.CharField(max_length=80)
    color_hex = models.CharField(max_length=7, default="#682050")
    stock = models.PositiveIntegerField(default=0)
    sku = models.CharField(max_length=80, unique=True)

    class Meta:
        ordering = ["color", "size"]
        unique_together = [("product", "size", "color")]

    def __str__(self) -> str:
        return f"{self.product.name} / {self.color} / {self.size}"
