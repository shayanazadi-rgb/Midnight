from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.db import IntegrityError, transaction
from rest_framework import serializers

from .models import CustomerProfile

User = get_user_model()


def normalize_phone(value: str) -> str:
    phone = (value or "").strip().replace(" ", "").replace("-", "")
    if phone.startswith("+98"):
        phone = "0" + phone[3:]
    elif phone.startswith("98") and len(phone) >= 12:
        phone = "0" + phone[2:]
    return phone


class RegisterSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    phone = serializers.CharField(max_length=40)
    address = serializers.CharField()
    postal_code = serializers.CharField(max_length=20, required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=8)

    def validate_phone(self, value: str) -> str:
        phone = normalize_phone(value)
        if len(phone) < 10:
            raise serializers.ValidationError("شماره تماس معتبر نیست.")
        if User.objects.filter(username=phone).exists() or CustomerProfile.objects.filter(
            phone=phone
        ).exists():
            raise serializers.ValidationError("این شماره قبلاً ثبت شده است. وارد شوید.")
        return phone

    def validate_password(self, value: str) -> str:
        validate_password(value)
        return value

    @transaction.atomic
    def create(self, validated_data: dict) -> CustomerProfile:
        phone = validated_data["phone"]
        password = validated_data["password"]
        try:
            user = User.objects.create_user(
                username=phone,
                password=password,
                first_name=validated_data["first_name"].strip(),
                last_name=validated_data["last_name"].strip(),
            )
        except IntegrityError as exc:
            raise serializers.ValidationError(
                {"phone": "این شماره قبلاً ثبت شده است. وارد شوید."}
            ) from exc

        return CustomerProfile.objects.create(
            user=user,
            first_name=validated_data["first_name"].strip(),
            last_name=validated_data["last_name"].strip(),
            phone=phone,
            address=validated_data["address"].strip(),
            postal_code=(validated_data.get("postal_code") or "").strip(),
        )


class LoginSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=40)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs: dict) -> dict:
        phone = normalize_phone(attrs.get("phone", ""))
        password = attrs.get("password", "")
        user = authenticate(username=phone, password=password)
        if user is None:
            raise serializers.ValidationError("شماره تماس یا رمز عبور اشتباه است.")
        if user.is_staff:
            raise serializers.ValidationError("لطفاً از پنل مدیریت وارد شوید.")
        attrs["user"] = user
        attrs["phone"] = phone
        return attrs


class CustomerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile
        fields = [
            "first_name",
            "last_name",
            "phone",
            "address",
            "postal_code",
        ]
