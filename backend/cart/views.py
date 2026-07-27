"""
Cart Views — Controllers (C in MVC).
"""

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from catalog.models import Product, ProductVariant

from .models import Cart, CartItem
from .serializers import (
    AddToCartSerializer,
    CartSerializer,
    UpdateCartItemSerializer,
)


def _get_or_create_cart(request) -> Cart:
    cart_id = request.headers.get("X-Cart-Id")
    if cart_id:
        cart = Cart.objects.filter(id=cart_id).first()
        if cart:
            return cart
    return Cart.objects.create()


class CartDetailView(APIView):
    """GET /api/v1/cart/"""

    def get(self, request):
        cart = _get_or_create_cart(request)
        return Response(CartSerializer(cart).data)


class CartAddItemView(APIView):
    """POST /api/v1/cart/items/"""

    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            product = Product.objects.get(pk=data["product_id"], is_active=True)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            variant = ProductVariant.objects.get(pk=data["variant_id"], product=product)
        except ProductVariant.DoesNotExist:
            return Response({"detail": "Variant not found"}, status=status.HTTP_404_NOT_FOUND)

        cart = _get_or_create_cart(request)
        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            variant=variant,
            defaults={
                "quantity": data["quantity"],
                "unit_price": product.price,
                "product_name": product.name,
                "product_name_fa": product.name_fa,
                "size": variant.size,
                "color": variant.color,
                "image": product.images[0] if product.images else "",
            },
        )

        new_qty = data["quantity"] if created else item.quantity + data["quantity"]
        if new_qty > variant.stock:
            return Response(
                {"detail": f"Only {variant.stock} left in stock"},
                status=status.HTTP_409_CONFLICT,
            )

        if not created:
            item.quantity = new_qty
            item.save(update_fields=["quantity"])

        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)


class CartUpdateItemView(APIView):
    """PATCH /api/v1/cart/items/{product_id}/{variant_id}/"""

    def patch(self, request, product_id: int, variant_id: int):
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        quantity = serializer.validated_data["quantity"]

        cart = _get_or_create_cart(request)
        item = CartItem.objects.filter(
            cart=cart, product_id=product_id, variant_id=variant_id
        ).first()

        if quantity == 0:
            if item:
                item.delete()
            return Response(CartSerializer(cart).data)

        if not item:
            return Response({"detail": "Item not in cart"}, status=status.HTTP_404_NOT_FOUND)

        if quantity > item.variant.stock:
            return Response(
                {"detail": f"Only {item.variant.stock} left in stock"},
                status=status.HTTP_409_CONFLICT,
            )

        item.quantity = quantity
        item.save(update_fields=["quantity"])
        return Response(CartSerializer(cart).data)
