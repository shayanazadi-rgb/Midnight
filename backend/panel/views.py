"""
Admin panel controllers — authenticated write API for the separate admin-panel app.
"""

import uuid
from pathlib import Path

from django.conf import settings
from django.contrib.auth import authenticate
from django.db.models import Count, Q, Sum
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from catalog.models import Category, Product
from orders.models import Order, OrderItem

from .serializers import (
    OrderSerializer,
    PanelCategorySerializer,
    PanelProductSerializer,
)


@api_view(["POST"])
@permission_classes([AllowAny])
def panel_login(request):
    username = request.data.get("username", "").strip()
    password = request.data.get("password", "")
    user = authenticate(username=username, password=password)
    if user is None or not user.is_staff:
        return Response(
            {"detail": "نام کاربری یا رمز عبور اشتباه است."},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    token, _ = Token.objects.get_or_create(user=user)
    return Response(
        {
            "token": token.key,
            "username": user.username,
        }
    )


@api_view(["POST"])
@permission_classes([IsAdminUser])
def panel_logout(request):
    Token.objects.filter(user=request.user).delete()
    return Response({"ok": True})


@api_view(["GET"])
@permission_classes([IsAdminUser])
def panel_me(request):
    return Response({"username": request.user.username, "is_staff": True})


class PanelCategoryViewSet(viewsets.ModelViewSet):
    serializer_class = PanelCategorySerializer
    permission_classes = [IsAdminUser]
    lookup_field = "id"
    pagination_class = None

    def get_queryset(self):
        return Category.objects.annotate(product_count=Count("products"))

    def destroy(self, request, *args, **kwargs):
        category = self.get_object()
        if category.products.exists():
            return Response(
                {"detail": "این دسته محصول دارد؛ ابتدا محصولات را حذف یا جابه‌جا کنید."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().destroy(request, *args, **kwargs)


class PanelProductViewSet(viewsets.ModelViewSet):
    serializer_class = PanelProductSerializer
    permission_classes = [IsAdminUser]
    lookup_field = "id"
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_queryset(self):
        qs = Product.objects.select_related("category").prefetch_related("variants")
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(Q(category_id=category) | Q(category__slug=category))
        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(
                Q(name__icontains=search)
                | Q(name_fa__icontains=search)
                | Q(description_fa__icontains=search)
            )
        return qs.order_by("-updated_at")


class MediaUploadView(APIView):
    """Upload product/category photos to local MEDIA_ROOT."""

    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file = request.FILES.get("file") or request.FILES.get("image")
        if not file:
            return Response(
                {"detail": "فایلی ارسال نشده است."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        allowed = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
        ext = Path(file.name).suffix.lower()
        if ext not in allowed:
            return Response(
                {"detail": "فرمت مجاز: jpg, png, webp, gif"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        folder = request.data.get("folder", "products")
        safe_folder = "".join(c for c in folder if c.isalnum() or c in "-_") or "products"
        dest_dir = Path(settings.MEDIA_ROOT) / safe_folder
        dest_dir.mkdir(parents=True, exist_ok=True)

        filename = f"{uuid.uuid4().hex}{ext}"
        dest = dest_dir / filename
        with dest.open("wb") as out:
            for chunk in file.chunks():
                out.write(chunk)

        relative = f"{safe_folder}/{filename}"
        # Always absolute /media/... so it does not nest under /api/v1/panel/
        url = request.build_absolute_uri(f"{settings.MEDIA_URL}{relative}")
        return Response({"url": url, "path": f"{settings.MEDIA_URL}{relative}"})


class PanelSalesViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]
    lookup_field = "id"

    def get_queryset(self):
        return Order.objects.prefetch_related("items").all()

    @action(detail=False, methods=["get"])
    def summary(self, request):
        qs = Order.objects.exclude(status=Order.STATUS_CANCELLED)
        paid = qs.filter(status__in=[Order.STATUS_PAID, Order.STATUS_SHIPPED])
        item_agg = OrderItem.objects.filter(order__in=paid).aggregate(
            units=Sum("quantity"),
        )
        total_revenue = sum(o.total for o in paid.prefetch_related("items"))
        return Response(
            {
                "orders_count": paid.count(),
                "units_sold": item_agg["units"] or 0,
                "revenue": total_revenue,
            }
        )
