"""
Cart Models (M in MVC)
"""

import uuid

from django.db import models

from catalog.models import Product, ProductVariant


class Cart(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"Cart {self.id}"

    @property
    def subtotal(self) -> int:
        return sum(item.line_total for item in self.items.all())

    @property
    def item_count(self) -> int:
        return sum(item.quantity for item in self.items.all())


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    # Snapshot fields so cart stays readable if product edits later
    unit_price = models.PositiveIntegerField()
    product_name = models.CharField(max_length=200)
    product_name_fa = models.CharField(max_length=200)
    size = models.CharField(max_length=40)
    color = models.CharField(max_length=80)
    image = models.URLField(max_length=500, blank=True)

    class Meta:
        unique_together = [("cart", "product", "variant")]

    def __str__(self) -> str:
        return f"{self.product_name_fa} x{self.quantity}"

    @property
    def line_total(self) -> int:
        return self.unit_price * self.quantity
