from django.contrib import admin

from .models import CustomerProfile


@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):
    list_display = ("phone", "first_name", "last_name", "created_at")
    search_fields = ("phone", "first_name", "last_name")
