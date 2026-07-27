from rest_framework import serializers

from cart.models import Cart

from .models import Order, OrderItem


class CheckoutSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    phone = serializers.CharField(max_length=40)
    address = serializers.CharField()
    postal_code = serializers.CharField(max_length=20, required=False, allow_blank=True)


class OrderItemSerializer(serializers.ModelSerializer):
    line_total = serializers.IntegerField(read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product_name",
            "product_name_fa",
            "size",
            "color",
            "unit_price",
            "quantity",
            "image",
            "line_total",
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total = serializers.IntegerField(read_only=True)
    item_count = serializers.IntegerField(read_only=True)
    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "first_name",
            "last_name",
            "full_name",
            "customer_name",
            "customer_phone",
            "customer_address",
            "postal_code",
            "status",
            "note",
            "items",
            "total",
            "item_count",
            "created_at",
            "updated_at",
        ]


def create_order_from_cart(cart: Cart, data: dict) -> Order:
    if not cart.items.exists():
        raise ValueError("سبد خرید خالی است.")

    for item in cart.items.select_related("variant"):
        if item.quantity > item.variant.stock:
            raise ValueError(
                f"موجودی «{item.product_name_fa}» کافی نیست (فقط {item.variant.stock} عدد)."
            )

    order = Order(
        first_name=data["first_name"].strip(),
        last_name=data["last_name"].strip(),
        customer_phone=data["phone"].strip(),
        customer_address=data["address"].strip(),
        postal_code=(data.get("postal_code") or "").strip(),
        status=Order.STATUS_PENDING,
    )
    order.sync_customer_name()
    order.save()

    for item in cart.items.select_related("product", "variant"):
        OrderItem.objects.create(
            order=order,
            product=item.product,
            variant=item.variant,
            product_name=item.product_name,
            product_name_fa=item.product_name_fa,
            size=item.size,
            color=item.color,
            unit_price=item.unit_price,
            quantity=item.quantity,
            image=item.image,
        )

    return order
