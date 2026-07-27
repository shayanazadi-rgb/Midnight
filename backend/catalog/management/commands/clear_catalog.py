import os

from django.core.management.base import BaseCommand
from django.db import transaction

from cart.models import CartItem
from catalog.models import Category, Product, ProductVariant


class Command(BaseCommand):
    help = "Delete all catalog products, variants, and categories (and cart lines)."

    @transaction.atomic
    def handle(self, *args, **options):
        # Allow CI/deploy wipe only when explicitly enabled.
        force = options.get("force")
        env_on = os.environ.get("CLEAR_CATALOG", "").lower() in ("1", "true", "yes")
        if not force and not env_on:
            self.stdout.write(
                self.style.WARNING(
                    "Skipped. Pass --force or set CLEAR_CATALOG=1 to wipe catalog."
                )
            )
            return

        cart_deleted, _ = CartItem.objects.all().delete()
        variants_deleted, _ = ProductVariant.objects.all().delete()
        products_deleted, _ = Product.objects.all().delete()
        categories_deleted, _ = Category.objects.all().delete()
        self.stdout.write(
            self.style.SUCCESS(
                "Cleared catalog: "
                f"{categories_deleted} categories, "
                f"{products_deleted} products, "
                f"{variants_deleted} variants, "
                f"{cart_deleted} cart items."
            )
        )

    def add_arguments(self, parser):
        parser.add_argument(
            "--force",
            action="store_true",
            help="Wipe catalog even without CLEAR_CATALOG env.",
        )
