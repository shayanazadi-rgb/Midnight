from django.core.management.base import BaseCommand

from catalog.models import Category, Product, ProductVariant


CATEGORIES = [
    {
        "slug": "bras",
        "name": "Bras",
        "name_fa": "سوتین",
        "description": "Structured support with soft midnight romance.",
        "image": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
        "sort_order": 1,
    },
    {
        "slug": "lingerie-sets",
        "name": "Lingerie Sets",
        "name_fa": "ست لباس زیر",
        "description": "Matched silhouettes for evenings that linger.",
        "image": "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80",
        "sort_order": 2,
    },
    {
        "slug": "underwear",
        "name": "Underwear",
        "name_fa": "شورت",
        "description": "Everyday softness in plum and blush tones.",
        "image": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
        "sort_order": 3,
    },
    {
        "slug": "sleepwear",
        "name": "Sleepwear",
        "name_fa": "لباس خواب",
        "description": "Silk-adjacent nights, cut for quiet luxury.",
        "image": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80",
        "sort_order": 4,
    },
]

PRODUCTS = [
    {
        "slug": "velvet-orchid-bra",
        "name": "Velvet Orchid Bra",
        "name_fa": "سوتین ارکیده مخملی",
        "description": "A soft-cup silhouette with petal lace and plum hardware. Designed for all-day ease with evening presence.",
        "description_fa": "سوتین کاپ نرم با دانتل گل‌برگ و یراق‌آلات بادمجانی. طراحی‌شده برای راحتی روزمره با حضور شبانه.",
        "price": 1890000,
        "compare_at_price": 2290000,
        "category": "bras",
        "images": [
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1200&q=80",
            "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80",
        ],
        "tags": "lace,featured,new",
        "featured": True,
        "variants": [
            ("S", "Blush", "#ECC6DD", 12),
            ("M", "Blush", "#ECC6DD", 18),
            ("L", "Blush", "#ECC6DD", 9),
            ("S", "Plum", "#682050", 8),
            ("M", "Plum", "#682050", 14),
            ("L", "Plum", "#682050", 6),
        ],
    },
    {
        "slug": "midnight-mesh-set",
        "name": "Midnight Mesh Set",
        "name_fa": "ست مش میدنایت",
        "description": "Sheer mesh layered over satin panels. A two-piece set that reads editorial under low light.",
        "description_fa": "مش شفاف روی پنل‌های ساتن. ست دو تکه با حس ادیتوریال در نور کم.",
        "price": 2450000,
        "compare_at_price": None,
        "category": "lingerie-sets",
        "images": [
            "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200&q=80",
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80",
        ],
        "tags": "set,mesh,featured",
        "featured": True,
        "variants": [
            ("S", "Noir Rose", "#4A1838", 10),
            ("M", "Noir Rose", "#4A1838", 16),
            ("L", "Noir Rose", "#4A1838", 7),
            ("S", "Pearl Pink", "#F2D4E6", 11),
            ("M", "Pearl Pink", "#F2D4E6", 13),
        ],
    },
    {
        "slug": "silk-whisper-brief",
        "name": "Silk Whisper Brief",
        "name_fa": "شورت ابریشم ویسپر",
        "description": "High-leg brief in liquid-feel fabric with invisible seams and a soft elastic waist.",
        "description_fa": "شورت های‌لگ با پارچه حس مایع، درزهای نامرئی و کمرکش نرم.",
        "price": 690000,
        "compare_at_price": 850000,
        "category": "underwear",
        "images": [
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80",
        ],
        "tags": "everyday,sale",
        "featured": False,
        "variants": [
            ("S", "Blush", "#ECC6DD", 20),
            ("M", "Blush", "#ECC6DD", 24),
            ("L", "Blush", "#ECC6DD", 15),
            ("XL", "Blush", "#ECC6DD", 8),
            ("S", "Plum", "#682050", 12),
            ("M", "Plum", "#682050", 18),
            ("L", "Plum", "#682050", 10),
        ],
    },
    {
        "slug": "rose-hour-chemise",
        "name": "Rose Hour Chemise",
        "name_fa": "شومیز ساعت رز",
        "description": "Bias-cut chemise with adjustable straps and a whisper-thin hem that moves like dusk air.",
        "description_fa": "شومیز برش اریب با بندهای قابل تنظیم و لبه فوق‌العاده نازک که مثل هوای غروب حرکت می‌کند.",
        "price": 2150000,
        "compare_at_price": None,
        "category": "sleepwear",
        "images": [
            "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1200&q=80",
            "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&q=80",
        ],
        "tags": "sleep,featured,new",
        "featured": True,
        "variants": [
            ("S", "Dust Rose", "#D9A7C7", 9),
            ("M", "Dust Rose", "#D9A7C7", 14),
            ("L", "Dust Rose", "#D9A7C7", 8),
            ("S", "Deep Plum", "#682050", 6),
            ("M", "Deep Plum", "#682050", 11),
        ],
    },
    {
        "slug": "lace-archive-bralette",
        "name": "Lace Archive Bralette",
        "name_fa": "برالت دانتل آرشیو",
        "description": "Unlined bralette with scalloped edges and a soft back band — light support, strong silhouette.",
        "description_fa": "برالت بدون لایه با لبه‌های دندانه‌دار و بند پشتی نرم — پشتیبانی سبک، سیلوئت قوی.",
        "price": 1250000,
        "compare_at_price": 1490000,
        "category": "bras",
        "images": [
            "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80",
        ],
        "tags": "bralette,lace,sale",
        "featured": True,
        "variants": [
            ("XS", "Blush", "#ECC6DD", 7),
            ("S", "Blush", "#ECC6DD", 15),
            ("M", "Blush", "#ECC6DD", 19),
            ("L", "Blush", "#ECC6DD", 10),
            ("S", "Plum", "#682050", 9),
            ("M", "Plum", "#682050", 12),
        ],
    },
    {
        "slug": "dusk-satin-robe",
        "name": "Dusk Satin Robe",
        "name_fa": "روبدوشی ساتن غروب",
        "description": "Floor-skimming satin robe with a self-tie belt and wide sleeves — made for slow mornings.",
        "description_fa": "روبدوشی ساتن تا نزدیک زمین با کمربند خودی و آستین‌های گشاد — برای صبح‌های آرام.",
        "price": 2890000,
        "compare_at_price": 3290000,
        "category": "sleepwear",
        "images": [
            "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&q=80",
        ],
        "tags": "robe,satin,featured",
        "featured": True,
        "variants": [
            ("One Size", "Blush Mist", "#ECC6DD", 14),
            ("One Size", "Midnight Plum", "#682050", 11),
        ],
    },
    {
        "slug": "petal-string-trio",
        "name": "Petal String Trio",
        "name_fa": "سه‌تایی پتال استرینگ",
        "description": "Three minimal strings in coordinated pinks — packable softness for the everyday drawer.",
        "description_fa": "سه استرینگ مینیمال در صورتی‌های هماهنگ — نرمی قابل بسته‌بندی برای کشوی روزمره.",
        "price": 980000,
        "compare_at_price": None,
        "category": "underwear",
        "images": [
            "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80",
        ],
        "tags": "pack,everyday",
        "featured": False,
        "variants": [
            ("S", "Trio Pink", "#ECC6DD", 22),
            ("M", "Trio Pink", "#ECC6DD", 28),
            ("L", "Trio Pink", "#ECC6DD", 16),
        ],
    },
    {
        "slug": "noir-bloom-corset",
        "name": "Noir Bloom Corset",
        "name_fa": "کُرست بلوم نوآر",
        "description": "Light-boned corset top with floral embroidery — structure without severity.",
        "description_fa": "کُرست سبک با گلدوزی گل‌دار — ساختار بدون سختی.",
        "price": 3120000,
        "compare_at_price": None,
        "category": "lingerie-sets",
        "images": [
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80",
        ],
        "tags": "corset,editorial,new",
        "featured": True,
        "variants": [
            ("S", "Plum", "#682050", 5),
            ("M", "Plum", "#682050", 8),
            ("L", "Plum", "#682050", 4),
            ("S", "Blush", "#ECC6DD", 6),
            ("M", "Blush", "#ECC6DD", 7),
        ],
    },
]


class Command(BaseCommand):
    help = "Seed Midnight Shop catalog with lingerie products"

    def handle(self, *args, **options):
        if Product.objects.exists():
            self.stdout.write(self.style.WARNING("Catalog already seeded."))
            return

        cat_map: dict[str, Category] = {}
        for cat in CATEGORIES:
            obj = Category.objects.create(**cat)
            cat_map[cat["slug"]] = obj

        for product in PRODUCTS:
            variants = product.pop("variants")
            category_slug = product.pop("category")
            obj = Product.objects.create(category=cat_map[category_slug], **product)
            for i, (size, color, color_hex, stock) in enumerate(variants):
                ProductVariant.objects.create(
                    product=obj,
                    size=size,
                    color=color,
                    color_hex=color_hex,
                    stock=stock,
                    sku=f"MS-{obj.slug[:10].upper()}-{size.replace(' ', '')}-{color[:3].upper()}-{i}",
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {len(CATEGORIES)} categories and {len(PRODUCTS)} products."
            )
        )
