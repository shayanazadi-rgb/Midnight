from django.contrib import admin

from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ("product", "variant", "unit_price", "product_name_fa")


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ("id", "item_count", "subtotal", "updated_at")
    inlines = [CartItemInline]


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ("product_name_fa", "cart", "size", "color", "quantity", "unit_price")
