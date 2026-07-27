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
    price = models.PositiveIntegerField(help_text="Price in IRR (toman-style integer)")
    compare_at_price = models.PositiveIntegerField(null=True, blank=True)
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
    def discount_percent(self) -> int | None:
        if not self.compare_at_price or self.compare_at_price <= self.price:
            return None
        return round((1 - self.price / self.compare_at_price) * 100)


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
