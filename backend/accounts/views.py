from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import CustomerProfile
from .serializers import (
    CustomerProfileSerializer,
    LoginSerializer,
    RegisterSerializer,
)


def _auth_payload(user, profile=None) -> dict:
    token, _ = Token.objects.get_or_create(user=user)
    if profile is None:
        profile = getattr(user, "customer_profile", None)
    data = {
        "token": token.key,
        "phone": user.username,
    }
    if profile is not None:
        data["profile"] = CustomerProfileSerializer(profile).data
    return data


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    profile = serializer.save()
    return Response(_auth_payload(profile.user, profile), status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data["user"]
    return Response(_auth_payload(user))


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    Token.objects.filter(user=request.user).delete()
    return Response({"ok": True})


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def me(request):
    profile = CustomerProfile.objects.filter(user=request.user).first()
    if request.method == "GET":
        if profile is None:
            return Response(
                {"detail": "پروفایل پیدا نشد."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(
            {
                "phone": request.user.username,
                "profile": CustomerProfileSerializer(profile).data,
            }
        )

    if profile is None:
        return Response(
            {"detail": "پروفایل پیدا نشد."},
            status=status.HTTP_404_NOT_FOUND,
        )

    data = {
        key: value
        for key, value in request.data.items()
        if key in ("first_name", "last_name", "address", "postal_code")
    }
    serializer = CustomerProfileSerializer(profile, data=data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(
        {
            "phone": request.user.username,
            "profile": CustomerProfileSerializer(profile).data,
        }
    )
