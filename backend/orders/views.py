from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from cart.models import Cart

from .models import Order
from .serializers import CheckoutSerializer, OrderSerializer, create_order_from_cart


class CheckoutView(APIView):
    """POST /api/v1/checkout/ — create pending order from cart (no payment yet)."""

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart_id = request.headers.get("X-Cart-Id")
        if not cart_id:
            return Response(
                {"detail": "سبد خرید پیدا نشد."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart = Cart.objects.filter(id=cart_id).prefetch_related("items__variant").first()
        if not cart:
            return Response(
                {"detail": "سبد خرید پیدا نشد."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            order = create_order_from_cart(cart, serializer.validated_data)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderDetailView(APIView):
    """GET /api/v1/orders/{id}/ — for payment page summary."""

    def get(self, request, order_id: int):
        order = (
            Order.objects.filter(id=order_id)
            .prefetch_related("items")
            .first()
        )
        if not order:
            return Response({"detail": "سفارش پیدا نشد."}, status=status.HTTP_404_NOT_FOUND)
        return Response(OrderSerializer(order).data)
