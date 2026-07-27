from django.contrib import admin

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "first_name",
        "last_name",
        "customer_phone",
        "postal_code",
        "status",
        "created_at",
    )
    list_filter = ("status",)
    search_fields = ("first_name", "last_name", "customer_name", "customer_phone", "postal_code")
    inlines = [OrderItemInline]
