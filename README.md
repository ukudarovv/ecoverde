# EcoVerde

Landing page для инвестиционного проекта EcoVerde с формой обратной связи, Django API и Telegram-ботом.

## Стек

- **Frontend:** React + Vite + Tailwind (статика через Nginx)
- **Backend:** Django + Gunicorn
- **База данных:** SQLite (`backend/data/db.sqlite3`)
- **Уведомления:** Telegram Bot API

## Production (ecoverde.kz)

На сервере проект развернут в `/opt/ecoverde` без Docker:

| Сервис | Как запущен |
|--------|-------------|
| API | `systemd` → `ecoverde-backend` (Gunicorn :8000) |
| Telegram-бот | `systemd` → `ecoverde-telegram` |
| Сайт | Nginx → `/opt/ecoverde/frontend/dist` |

### Первичная установка на сервере

```bash
ssh ubuntu@213.155.21.70
cd /opt/ecoverde
bash deploy/setup.sh
```

### Обновление после git push

```bash
cd /opt/ecoverde
bash deploy/deploy.sh
```

### Проверка статуса

```bash
sudo systemctl status ecoverde-backend ecoverde-telegram nginx
curl -s https://ecoverde.kz/api/health/
```

### Telegram на сервере

В `.env` укажите токен бота:

```
TELEGRAM_BOT_TOKEN=...
TELEGRAM_BOT_USERNAME=eco_verde_bot
```

**Администраторы** (уведомления + просмотр заявок в боте) настраиваются в Django Admin:

1. Откройте `https://ecoverde.kz/admin/` → **Администраторы Telegram**
2. Добавьте `chat_id` (узнать через [@userinfobot](https://t.me/userinfobot))
3. Админ должен нажать `/start` у бота `@eco_verde_bot`

Быстрый fallback через скрипт:

```bash
sudo bash deploy/set-telegram-admin.sh <ваш_chat_id> "Имя админа"
```

### Команды бота для админов

| Команда | Описание |
|---------|----------|
| `/list` | Последние 10 заявок |
| `/list 2` | Следующая страница |
| `/view <id>` | Полная заявка, например `/view 5` |
| `/help` | Справка |

При новой заявке админам приходит уведомление с кнопкой «Подробнее».

### SSL

Сертификат Let's Encrypt. Для продления:

```bash
sudo certbot renew
sudo systemctl reload nginx
```

---

## Локальный запуск

1. Скопируйте переменные окружения:

```bash
cp .env.example .env
```

2. Заполните в `.env`:

- `TELEGRAM_BOT_TOKEN` — токен от [@BotFather](https://t.me/BotFather)
- `TELEGRAM_BOT_USERNAME` — username бота без `@`
- `TELEGRAM_ADMIN_CHAT_ID` — опциональный fallback (лучше через Django Admin)

### Backend

```bash
cd backend
python -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python manage.py migrate
.venv/bin/python manage.py runserver
```

### Telegram bot

```bash
cd backend
.venv/bin/python manage.py run_telegram_bot
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Vite проксирует `/api` на `http://localhost:8000`.

## Telegram-бот

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Укажите токен в `TELEGRAM_BOT_TOKEN`
3. Добавьте администраторов в Django Admin → **Администраторы Telegram**
4. Пользователь для подтверждения должен нажать `/start` у бота и указать Telegram username в форме

### Команды бота

**Для пользователей:**
- `/start` — регистрация для получения подтверждений
- `/help` — инструкция

**Для администраторов:**
- `/list` — список заявок
- `/view <id>` — детали заявки
- `/help` — справка по командам

## API

### `GET /api/health/`

Healthcheck.

### `POST /api/feedback/`

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

## Django Admin

```bash
cd backend
.venv/bin/python manage.py createsuperuser
.venv/bin/python manage.py migrate
```

Админка: `http://localhost:8000/admin/`

Разделы:
- **Заявки** — все отправленные формы
- **Администраторы Telegram** — chat_id админов с доступом к уведомлениям и `/list`, `/view`
- **Подписчики Telegram** — пользователи, нажавшие `/start` для подтверждений

## Структура проекта

```
ecoverde/
├── backend/              # Django API + Telegram bot
├── frontend/             # React landing page
├── deploy/               # setup.sh, deploy.sh, nginx, systemd
├── .env.example
└── README.md
```
