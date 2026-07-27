"""
Catalog Serializers — REST response layer (View in classic MVC for APIs).
"""

from rest_framework import serializers

from .models import Category, Product, ProductVariant


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ["id", "size", "color", "color_hex", "stock", "sku"]


class ProductListSerializer(serializers.ModelSerializer):
    category_slug = serializers.CharField(source="category.slug", read_only=True)
    category_name_fa = serializers.CharField(source="category.name_fa", read_only=True)
    tags = serializers.ListField(source="tag_list", read_only=True)
    in_stock = serializers.BooleanField(read_only=True)
    discount_percent = serializers.IntegerField(read_only=True, allow_null=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "slug",
            "name",
            "name_fa",
            "price",
            "compare_at_price",
            "category_slug",
            "category_name_fa",
            "images",
            "tags",
            "featured",
            "in_stock",
            "discount_percent",
        ]


class ProductDetailSerializer(ProductListSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta(ProductListSerializer.Meta):
        fields = ProductListSerializer.Meta.fields + [
            "description",
            "description_fa",
            "variants",
        ]


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = [
            "id",
            "slug",
            "name",
            "name_fa",
            "description",
            "image",
            "sort_order",
            "product_count",
        ]
