"""
Admin panel API serializers.
"""

from django.utils.text import slugify
from rest_framework import serializers

from catalog.models import Category, Product, ProductVariant
from orders.models import Order, OrderItem


def unique_slug(base: str, model, field: str = "slug") -> str:
    root = slugify(base, allow_unicode=True) or "item"
    candidate = root
    n = 1
    while model.objects.filter(**{field: candidate}).exists():
        n += 1
        candidate = f"{root}-{n}"
    return candidate


class PanelCategorySerializer(serializers.ModelSerializer):
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
        read_only_fields = ["slug"]

    def create(self, validated_data):
        name = validated_data.get("name") or validated_data.get("name_fa")
        validated_data["slug"] = unique_slug(name, Category)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data.pop("slug", None)
        return super().update(instance, validated_data)


class PanelVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ["id", "size", "color", "color_hex", "stock", "sku"]
        read_only_fields = ["sku"]


class PanelProductSerializer(serializers.ModelSerializer):
    variants = PanelVariantSerializer(many=True, required=False)
    category_name_fa = serializers.CharField(source="category.name_fa", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "slug",
            "name",
            "name_fa",
            "description",
            "description_fa",
            "price",
            "compare_at_price",
            "discount_percent",
            "category",
            "category_name_fa",
            "images",
            "tags",
            "featured",
            "is_active",
            "variants",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["slug", "created_at", "updated_at"]

    def validate_discount_percent(self, value):
        if value is None:
            return 0
        if value < 0 or value > 100:
            raise serializers.ValidationError("درصد تخفیف باید بین ۰ تا ۱۰۰ باشد.")
        return value

    def create(self, validated_data):
        variants_data = validated_data.pop("variants", [])
        validated_data.setdefault("discount_percent", 0)
        name = validated_data.get("name") or validated_data.get("name_fa")
        validated_data["slug"] = unique_slug(name, Product)
        if not validated_data.get("description"):
            validated_data["description"] = validated_data.get("description_fa", "")
        if not validated_data.get("description_fa"):
            validated_data["description_fa"] = validated_data.get("description", "")
        if not validated_data.get("name"):
            validated_data["name"] = validated_data.get("name_fa", "")
        if not validated_data.get("name_fa"):
            validated_data["name_fa"] = validated_data.get("name", "")

        product = Product.objects.create(**validated_data)
        self._sync_variants(product, variants_data)
        return product

    def update(self, instance, validated_data):
        variants_data = validated_data.pop("variants", None)
        validated_data.pop("slug", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if variants_data is not None:
            instance.variants.all().delete()
            self._sync_variants(instance, variants_data)
        return instance

    def _sync_variants(self, product: Product, variants_data: list):
        for i, row in enumerate(variants_data):
            size = row.get("size") or "One Size"
            color = row.get("color") or "Default"
            sku = row.get("sku") or f"{product.slug}-{size}-{color}-{i}".replace(" ", "-")[:80]
            base_sku = sku
            n = 1
            while ProductVariant.objects.filter(sku=sku).exists():
                n += 1
                sku = f"{base_sku}-{n}"[:80]
            ProductVariant.objects.create(
                product=product,
                size=size,
                color=color,
                color_hex=row.get("color_hex") or "#682050",
                stock=row.get("stock") or 0,
                sku=sku,
            )


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
