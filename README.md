# EcoVerde

Landing page для инвестиционного проекта EcoVerde с формой обратной связи, Django API, Telegram-ботом и Docker.

## Стек

- **Frontend:** React + Vite + Tailwind
- **Backend:** Django + Django REST Framework
- **База данных:** SQLite (Docker volume)
- **Уведомления:** Telegram Bot API

## Быстрый старт (Docker)

1. Скопируйте переменные окружения:

```bash
cp .env.example .env
```

2. Заполните в `.env`:

- `TELEGRAM_BOT_TOKEN` — токен от [@BotFather](https://t.me/BotFather)
- `TELEGRAM_ADMIN_CHAT_ID` — chat_id администратора (можно узнать через [@userinfobot](https://t.me/userinfobot))
- `TELEGRAM_BOT_USERNAME` — username бота без `@`

3. Запустите проект:

```bash
docker compose up --build
```

4. Откройте:

- Сайт: [http://localhost](http://localhost)
- API health: [http://localhost:8000/api/health/](http://localhost:8000/api/health/)
- Django Admin: [http://localhost:8000/admin/](http://localhost:8000/admin/)

## Сервисы Docker

| Сервис | Описание |
|--------|----------|
| `frontend` | Nginx + статика React, proxy `/api` → backend |
| `backend` | Django + Gunicorn, SQLite в volume `sqlite_data` |
| `telegram-bot` | Polling-бот для `/start` и `/help` |

## Telegram-бот

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Укажите токен в `TELEGRAM_BOT_TOKEN`
3. Администратор получает уведомление о каждой заявке в `TELEGRAM_ADMIN_CHAT_ID`
4. Пользователь для подтверждения должен:
   - нажать `/start` у бота
   - указать свой Telegram username в форме на сайте

### Команды бота

- `/start` — регистрация для получения подтверждений
- `/help` — инструкция

## API

### `GET /api/health/`

Healthcheck для Docker.

### `POST /api/feedback/`

Пример тела запроса:

```json
{
  "name": "Иван Иванов",
  "email": "ivan@example.com",
  "phone": "+77077776852",
  "company": "EcoInvest",
  "telegram_username": "ivan_user",
  "message": "Интересует участие в капитале",
  "lang": "RU"
}
```

Ответ `201`:

```json
{
  "id": 1,
  "message": "Заявка принята",
  "telegram_confirmation": "sent"
}
```

`telegram_confirmation` может быть:

- `sent` — подтверждение отправлено пользователю
- `pending_start_bot` — пользователь не зарегистрирован через `/start`
- `not_requested` — Telegram username не указан

## Локальная разработка без Docker

### Backend

```bash
cd backend
python -m pip install -r requirements.txt
cp ../.env.example ../.env
python manage.py migrate
python manage.py runserver
```

### Telegram bot

```bash
cd backend
python manage.py run_telegram_bot
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Vite проксирует `/api` на `http://localhost:8000`.

## Django Admin

Создайте суперпользователя:

```bash
docker compose exec backend python manage.py createsuperuser
```

Заявки доступны в разделе **Заявки**, подписчики бота — в **Подписчики Telegram**.

## Структура проекта

```
ecoverde/
├── backend/           # Django API + Telegram bot
├── frontend/          # React landing page
├── docker-compose.yml
├── .env.example
└── README.md
```
