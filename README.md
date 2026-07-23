# 🌐 Архитектура проекта (TS Monorepo)

Проект развернут на **Vercel** и разделен на три изолированные зоны ответственности с общей типобезопасностью.

---

## 🏗 Структура и Схема

```text
├── client/   # Frontend (React + Webpack) -> Собирается в статику и раздается через CDN
├── server/   # Backend (Node.js) -> Деплоится как Serverless-функции
└── shared/   # Общие схемы и типы
```

```mermaid
graph TD
    User([Пользователь / Браузер]) -->|1. Скачивает статику HTML/JS| CDN[Vercel CDN: Статический хостинг]
    CDN -->|Раздает| Client[client: React + Webpack]

    User <-->|2. Делает запросы к API| Server[server: Node.js Serverless]

    subgraph shared [shared: Общий код]
        Types[Типы и Интерфейсы]
        Validation[Схемы валидации]
    end

    Client -.->|Импорт типов при сборке| shared
    Server -.->|Импорт типов при сборке| shared

    classDef static fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px;
    classDef serverless fill:#efebe9,stroke:#795548,stroke-width:2px;
    class Client static;
    class Server serverless;
```

---

## 📦 Зоны ответственности

1. **`./shared` (Общий слой)**
   - **Что внутри:** Интерфейсы ответов API, схемы валидации (Zod/Yup).
   - **Зачем:** Синхронизация изменений. Если меняется тип в API, код автоматически обновляется (и ломается при ошибках) и на фронте, и на бэке.

2. **`./server` (Бэкенд)**
   - **Специфика:** Работает в режиме **Vercel Serverless**. Точки входа — строго внутри `server/api/`.
   - **Важно:** Функции работают без сохранения состояния (stateless).

3. **`./client` (Фронтенд)**
   - **Специфика:** Чистая статика (SPA). Webpack собирает проект в HTML/JS/CSS, а Vercel мгновенно раздает эти файлы через свою сеть CDN по всему миру.

---

## 🛠 Памятка разработчику

- **Установка:** Зависимости всех папок ставятся одной командой из корня (`npm install` через Workspaces).
- **Локальный запуск:** Используйте Vercel CLI для симуляции продакшна: команда `vercel dev`.
- **Главное правило:** Запрещен прямой импорт между `client` и `server`. Все общие сущности выносятся только в `shared`.
