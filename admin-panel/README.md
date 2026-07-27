# Admin Panel — Midnight Shop

پنل مدیریت جدا از فروشگاه. روی پورت **3001** اجرا می‌شود.

## Run

```bash
# 1) Backend (must be running)
cd backend
python manage.py migrate
python manage.py ensure_panel_admin
python manage.py runserver

# 2) Admin panel (separate terminal)
cd admin-panel
npm install
npm run dev
```

Open: **http://localhost:3001**

Login:
- username: `Neda_Db`
- password: `Neda1234Dadbakhsh`

## Features

- Login / logout (token auth)
- Add / delete categories
- Create products with local photo upload, name, category, size, color (رنگ‌بندی), description
- Sales page (orders summary — checkout wiring later)

API used: `http://127.0.0.1:8000/api/v1/panel/`
Photos saved under: `backend/media/`
