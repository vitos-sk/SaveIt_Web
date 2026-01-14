# SaveIt - Telegram Mini App

Telegram Mini App для просмотра и управления сохранёнными ссылками из Firebase Realtime Database.

## Архитектура

### Хранилище данных (Firebase Realtime Database)

- **`/users/{userKey}`**: профиль пользователя (например: `telegram_id`, `username`, `created_at`).
- **`/links/{linkId}`**: сохранённые ссылки. Каждая запись содержит `user_id` (ссылка на `userKey` из `/users`), а также `url`, `title`, `content_type`, `created_at`.

Привязка данных:

- Telegram даёт `telegram_id` → находим `userKey` в `/users`
- затем выбираем из `/links` только записи, где `link.user_id === userKey`

### Клиент (React + Vite)

Слои приложения:

- **UI** (`src/components/*`)
  - `DataViewer`: корневой экран (хедер, категории, список, bottom‑sheet).
  - `FilterBar`: бар категорий (горизонтальный скролл).
  - `MemoryList` / `MemoryItem`: список и карточка сохранёнки.
  - `MemoryDetail`: bottom‑sheet (glassmorphism), действия и модалки подтверждения/ошибок.
- **Данные** (`src/services/firebaseService.ts`)
  - поиск пользователя по `telegram_id`
  - выборка/маппинг `links` под формат UI
  - удаление `links/{linkId}`
- **Telegram WebApp** (`src/utils/telegram.ts`)
  - получение пользователя из `Telegram.WebApp.initDataUnsafe.user`
  - инициализация WebApp (ready/expand и пр.)

### Поток данных (end-to-end)

1. Mini App открывается внутри Telegram → получаем `telegram_id`.
2. `firebaseService` находит `userKey` в `/users` и загружает связанные `links` из `/links`.
3. UI показывает список и фильтрацию по категориям.
4. Тап по карточке → открывается `MemoryDetail`.
5. **Open**: открываем только `t.me` ссылки через Telegram WebApp API (без браузерных переходов).
6. **Delete**: удаляем `links/{linkId}` с подтверждением через встроенную модалку (совместимо с WebApp 6.0).

## Установка

```bash
npm install
```

## Запуск

```bash
npm run dev
```

## Сборка

```bash
npm run build
```

## Деплой (рекомендовано)

- Собери проект: `npm run build`
- Задеплой папку `dist/` на любой HTTPS-хостинг (Vercel/Netlify/Cloudflare Pages/свой сервер).
- В BotFather укажи URL Mini App на твой HTTPS домен.
- Mini App **должен открываться внутри Telegram** (в браузере покажет сообщение об ошибке).

## Функционал

- Чёрный UI под мобильные, стеклянные элементы
- Бар категорий + список сохранёнок
- Детальный bottom-sheet (свайп вниз закрывает)
- Открытие ссылок **только в Telegram** (t.me)
- Удаление сохранёнок (с подтверждением в модалке)
