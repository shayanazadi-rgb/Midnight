from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    MediaUploadView,
    PanelCategoryViewSet,
    PanelProductViewSet,
    PanelSalesViewSet,
    panel_login,
    panel_logout,
    panel_me,
)

router = DefaultRouter()
router.register("categories", PanelCategoryViewSet, basename="panel-category")
router.register("products", PanelProductViewSet, basename="panel-product")
router.register("sales", PanelSalesViewSet, basename="panel-sales")

urlpatterns = [
    path("login/", panel_login),
    path("logout/", panel_logout),
    path("me/", panel_me),
    path("upload/", MediaUploadView.as_view()),
    path("", include(router.urls)),
]
