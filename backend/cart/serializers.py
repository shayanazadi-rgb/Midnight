"""
Cart Serializers — REST response layer.
"""

from rest_framework import serializers

from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    line_total = serializers.IntegerField(read_only=True)
    product_id = serializers.IntegerField(source="product.id", read_only=True)
    variant_id = serializers.IntegerField(source="variant.id", read_only=True)
    product_slug = serializers.CharField(source="product.slug", read_only=True)

    class Meta:
        model = CartItem
        fields = [
            "id",
            "product_id",
            "variant_id",
            "product_slug",
            "quantity",
            "unit_price",
            "product_name",
            "product_name_fa",
            "size",
            "color",
            "image",
            "line_total",
        ]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.IntegerField(read_only=True)
    item_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "items", "subtotal", "item_count", "updated_at"]


class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    variant_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, max_value=20, default=1)


class UpdateCartItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=0, max_value=20)
