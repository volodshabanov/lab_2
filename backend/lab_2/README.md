# Лабораторна робота №2 — REST API сервер

**Варіант №8** — Система пропусків у комп'ютерний клас  
**Студент:** Прізвище Ім'я  
**Група:** ХХ-ХХ

---

## Технології

- Node.js + TypeScript
- Express.js
- UUID для генерації ідентифікаторів
- In-memory сховище (Map)

---

## Запуск проєкту

### Встановлення залежностей
```bash
npm install
```

### Режим розробки (з авто-перезавантаженням)
```bash
npm run dev
```

### Збірка та запуск production
```bash
npm run build
npm start
```

Сервер запускається на `http://localhost:3000`

---

## Архітектура
---

## Сутності

### User (Користувач)
| Поле | Тип | Опис |
|---|---|---|
| id | string (uuid) | Унікальний ідентифікатор |
| username | string | Ім'я користувача (4–35 символів) |
| email | string | Електронна пошта |
| role | admin \| student \| teacher | Роль |
| createdAt | string (ISO) | Дата створення |

### Pass (Пропуск)
| Поле | Тип | Опис |
|---|---|---|
| id | string (uuid) | Унікальний ідентифікатор |
| userId | string (uuid) | ID користувача |
| userPHD | Baclvr \| Magistr | Освітній рівень |
| userName | string | ПІБ студента |
| reason | LabWork \| PractWork \| Exam \| ModuleWork | Причина |
| validDate | string (YYYY-MM-DD) | Дата дії |
| issuer | string | Ким видано |
| comment | string | Коментар |
| createdAt | string (ISO) | Дата створення |

---

## API ендпоїнти

### Users

| Метод | Шлях | Опис | Код |
|---|---|---|---|
| GET | /api/users | Список користувачів | 200 |
| GET | /api/users/:id | Користувач за ID | 200/404 |
| POST | /api/users | Створити користувача | 201 |
| PUT | /api/users/:id | Оновити користувача | 200/404 |
| DELETE | /api/users/:id | Видалити користувача | 204/404 |

### Passes

| Метод | Шлях | Опис | Код |
|---|---|---|---|
| GET | /api/passes | Список пропусків | 200 |
| GET | /api/passes/:id | Пропуск за ID | 200/404 |
| GET | /api/passes/user/:userId | Пропуски користувача | 200 |
| POST | /api/passes | Створити пропуск | 201 |
| PUT | /api/passes/:id | Оновити пропуск | 200/404 |
| DELETE | /api/passes/:id | Видалити пропуск | 204/404 |

### Query-параметри для GET списків
---

## Приклади запитів (curl)

### Створити користувача
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"Іванов Іван\",\"email\":\"ivan@test.com\",\"role\":\"student\"}"
```

### Отримати всіх користувачів
```bash
curl http://localhost:3000/api/users
```

### Отримати користувача за ID
```bash
curl http://localhost:3000/api/users/697a419d-d549-4595-a552-d0ac08d2f59f
```

### Оновити користувача
```bash
curl -X PUT http://localhost:3000/api/users/697a419d-d549-4595-a552-d0ac08d2f59f \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"Петренко Петро\"}"
```

### Видалити користувача
```bash
curl -X DELETE http://localhost:3000/api/users/697a419d-d549-4595-a552-d0ac08d2f59f
```

### Створити пропуск
```bash
curl -X POST http://localhost:3000/api/passes \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"697a419d-d549-4595-a552-d0ac08d2f59f\",\"userPHD\":\"Baclvr\",\"userName\":\"Іванов Іван\",\"reason\":\"LabWork\",\"validDate\":\"2025-06-01\",\"issuer\":\"Проф. Коваль\",\"comment\":\"Тест\"}"
```

### Помилка валідації (400)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d "{}"
```

### Фільтрація та пагінація
```bash
curl "http://localhost:3000/api/passes?reason=LabWork&page=1&pageSize=5&sortBy=validDate&order=asc"
```

---

## Формат відповіді на помилку

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Помилка валідації",
  "details": [
    "username: обов'язкове поле рядкового типу",
    "email: невірний формат"
  ]
}
```