"""
Catalog Views — Controllers (C in MVC) via DRF ViewSets.
"""

from django.db.models import Count, Q, Sum
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from orders.models import Order

from .models import Category, Product
from .serializers import (
    CategorySerializer,
    ProductDetailSerializer,
    ProductListSerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/v1/categories/  |  GET /api/v1/categories/{slug}/"""

    serializer_class = CategorySerializer
    lookup_field = "slug"
    pagination_class = None

    def get_queryset(self):
        return Category.objects.annotate(
            product_count=Count("products", filter=Q(products__is_active=True))
        )


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/v1/products/
    GET /api/v1/products/{slug}/
    Query: ?category=&featured=&search=&tag=&sort=&discounted=
    """

    lookup_field = "slug"

    def get_queryset(self):
        qs = Product.objects.filter(is_active=True).select_related("category").prefetch_related(
            "variants"
        )
        params = self.request.query_params

        category = params.get("category")
        if category:
            qs = qs.filter(category__slug=category)

        featured = params.get("featured")
        if featured is not None:
            qs = qs.filter(featured=featured.lower() in ("1", "true", "yes"))

        search = params.get("search")
        if search:
            qs = qs.filter(
                Q(name__icontains=search)
                | Q(name_fa__icontains=search)
                | Q(description__icontains=search)
                | Q(tags__icontains=search)
            )

        tag = params.get("tag")
        if tag:
            qs = qs.filter(tags__icontains=tag)

        discounted = params.get("discounted")
        if discounted is not None and discounted.lower() in ("1", "true", "yes"):
            qs = qs.filter(discount_percent__gt=0)

        sort = (params.get("sort") or "").lower()
        if sort == "newest":
            qs = qs.order_by("-created_at", "-id")
        elif sort == "bestsellers":
            qs = qs.annotate(
                units_sold=Sum(
                    "orderitem__quantity",
                    filter=Q(
                        orderitem__order__status__in=[
                            Order.STATUS_PAID,
                            Order.STATUS_SHIPPED,
                            Order.STATUS_PENDING,
                        ]
                    ),
                )
            ).order_by("-units_sold", "-created_at")
        elif sort == "discount":
            qs = qs.filter(discount_percent__gt=0).order_by(
                "-discount_percent", "-created_at"
            )

        return qs

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProductDetailSerializer
        return ProductListSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        try:
            limit = int(request.query_params.get("limit") or 0)
        except (TypeError, ValueError):
            limit = 0
        if limit > 0:
            queryset = queryset[: min(limit, 48)]
            serializer = self.get_serializer(queryset, many=True)
            return Response({"count": len(serializer.data), "next": None, "previous": None, "results": serializer.data})
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=["get"])
    def featured(self, request):
        qs = self.get_queryset().filter(featured=True)[:8]
        serializer = ProductListSerializer(qs, many=True)
        return Response(serializer.data)
