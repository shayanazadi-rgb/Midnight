# Midnight Shop — midnightshop.ir

فروشگاه لباس زیر و لباس خواب با برندینگ صورتی/بادمجانی لوگو.

## Stack

- **Frontend:** Next.js 16 (App Router) + Tailwind CSS 4
- **Backend:** Django + Django REST Framework (MVC)
  - **Model:** `catalog/models.py`, `cart/models.py`
  - **View (API):** `catalog/serializers.py`, `cart/serializers.py`
  - **Controller:** `catalog/views.py`, `cart/views.py`

## Brand colors

| Role | Hex | Source |
|------|-----|--------|
| Primary (pink) | `#ECC6DD` | Logo background |
| Secondary (plum) | `#682050` | Logo typography |

## Run backend

```bash
cd backend
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py seed_catalog
python manage.py runserver
```

API base: `http://127.0.0.1:8000/api/v1/`
- `GET /products/`
- `GET /products/{slug}/`
- `GET /categories/`
- `GET /cart/` (+ header `X-Cart-Id`)
- `POST /cart/items/`
- Admin: `http://127.0.0.1:8000/admin/`

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

Open: `http://localhost:3000`

## Run admin panel (separate app / URL)

```bash
cd backend
python manage.py migrate
python manage.py ensure_panel_admin
python manage.py runserver
```

```bash
cd admin-panel
npm install
npm run dev
```

Open: `http://localhost:3001`  

Admin credentials are created by `python manage.py ensure_panel_admin` (see that command / your env). Do not commit passwords.

Admin API: `http://127.0.0.1:8000/api/v1/panel/`  
Uploaded photos: `backend/media/`

## Deploy (MVP)

- **API:** Render (`render.yaml`) — free web service, roots at `backend/`
- **Shop:** Vercel project with Root Directory `frontend`
- **Admin panel:** Vercel project with Root Directory `admin-panel`

Set on each Vercel app:
- `NEXT_PUBLIC_API_URL` = `https://<your-render-service>.onrender.com/api/v1`
- `NEXT_PUBLIC_MEDIA_ORIGIN` = `https://<your-render-service>.onrender.com`

Set on Render:
- `CORS_ALLOWED_ORIGINS` = your two Vercel URLs (comma-separated)
- Optional later: `DATABASE_URL` from Neon Postgres

