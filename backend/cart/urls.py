from django.urls import path

from .views import CartAddItemView, CartDetailView, CartUpdateItemView

urlpatterns = [
    path("cart/", CartDetailView.as_view(), name="cart-detail"),
    path("cart/items/", CartAddItemView.as_view(), name="cart-add"),
    path(
        "cart/items/<int:product_id>/<int:variant_id>/",
        CartUpdateItemView.as_view(),
        name="cart-update",
    ),
]
