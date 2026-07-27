"""
Orders / sales records for the admin panel.
"""

from django.db import models

from catalog.models import Product, ProductVariant


class Order(models.Model):
    STATUS_PENDING = "pending"
    STATUS_PAID = "paid"
    STATUS_SHIPPED = "shipped"
    STATUS_CANCELLED = "cancelled"
    STATUS_CHOICES = [
        (STATUS_PENDING, "در انتظار"),
        (STATUS_PAID, "پرداخت‌شده"),
        (STATUS_SHIPPED, "ارسال‌شده"),
        (STATUS_CANCELLED, "لغو شده"),
    ]

    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    customer_name = models.CharField(max_length=200, blank=True)
    customer_phone = models.CharField(max_length=40, blank=True)
    customer_address = models.TextField(blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING,
    )
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Order #{self.pk} — {self.full_name or 'guest'}"

    @property
    def full_name(self) -> str:
        name = f"{self.first_name} {self.last_name}".strip()
        return name or self.customer_name

    @property
    def total(self) -> int:
        return sum(item.line_total for item in self.items.all())

    @property
    def item_count(self) -> int:
        return sum(item.quantity for item in self.items.all())

    def sync_customer_name(self) -> None:
        self.customer_name = f"{self.first_name} {self.last_name}".strip()


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    product_name = models.CharField(max_length=200)
    product_name_fa = models.CharField(max_length=200)
    size = models.CharField(max_length=40)
    color = models.CharField(max_length=80)
    unit_price = models.PositiveIntegerField()
    quantity = models.PositiveIntegerField(default=1)
    image = models.URLField(max_length=500, blank=True)

    def __str__(self) -> str:
        return f"{self.product_name_fa} x{self.quantity}"

    @property
    def line_total(self) -> int:
        return self.unit_price * self.quantity
