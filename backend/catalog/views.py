"""
Catalog Views — Controllers (C in MVC) via DRF ViewSets.
"""

from django.db.models import Count, Q
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

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
    Query: ?category=&featured=&search=&tag=
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

        return qs

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProductDetailSerializer
        return ProductListSerializer

    @action(detail=False, methods=["get"])
    def featured(self, request):
        qs = self.get_queryset().filter(featured=True)[:8]
        serializer = ProductListSerializer(qs, many=True)
        return Response(serializer.data)
