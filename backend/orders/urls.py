from django.urls import path

from .views import CheckoutView, MyOrdersView, OrderDetailView

urlpatterns = [
    path("checkout/", CheckoutView.as_view(), name="checkout"),
    path("orders/mine/", MyOrdersView.as_view(), name="my-orders"),
    path("orders/<int:order_id>/", OrderDetailView.as_view(), name="order-detail"),
]
