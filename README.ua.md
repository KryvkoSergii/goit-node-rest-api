# Робота з файлами та тестування додатків

- [English](README.md)

Створи гілку `hw05-avatars` з гілки master.

Продовж створення REST API для роботи з колекцією контактів. Додай можливість завантаження аватарки користувача через [Multer](https://www.npmjs.com/package/multer) .

## Крок 1
Створи папку `public` для роздачі статики. У цій папці зроби папку avatars.
Налаштуй Express на роздачу статичних файлів з папки `public`.
Поклади будь-яке зображення в папку `public/avatars` і перевір, що роздача статики працює.
При переході по такому URL браузер відобразить зображення. Shell `http://locahost:<порт>/avatars/<ім'я файлу з розширенням>`

## Крок 2
У схему користувача додай нову властивість avatarURL для зберігання зображення.
Використовуй пакет `gravatar` для того, щоб при реєстрації нового користувача відразу згенерувати йому аватар по його email.

## Крок 3

При реєстрації користувача:
* Створюй посилання на аватарку користувача за допомогою gravatar
* Отриманий URL збережи в поле avatarURL під час створення користувача

```javascript
PATCH /auth/avatars
Content-Type: multipart/form-data
Authorization: "Bearer {{token}}"
RequestBody: завантажений файл

# Успішна відповідь
Status: 200 OK
Content-Type: application/json
ResponseBody: {
  "avatarURL": "тут буде посилання на зображення"
}

# Неуспішна відповідь
Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
  "message": "Not authorized"
}
```
Створи папку `temp` в корені проекту і зберігай в неї завантажену аватарку.
Перенеси аватарку користувача з папки temp в папку `public/avatars` і дай їй унікальне ім'я для конкретного користувача.
Отриманий URL `/avatars/<ім'я файлу з розширенням>` та збережи в поле avatarURL користувача

## Крок 4
Додай можливість поновлення аватарки, створивши ендпоінт `/auth/avatars` і використовуючи метод PATCH.

## Додаткове завдання (необов'язкове)

Написати `unit-тести` для контролера входу (логін) за допомогою Jest:

відповідь повина мати статус-код `200`
* у відповіді повинен повертатися токен
* у відповіді повинен повертатися об'єкт user з 2 полями `email` и `subscription` з типом даних `String`

## Вимоги
* Створена БД за допомогою [Render](https://render.com/) або інший Postgres
* Підготовлений файл оточення `.env` за прикладом `.env_example`
* Встановленний Node.js v.20
* Встановлені залежності
```bash
yarn install
```
* Запущений `pgAdmin` за допомогою docker-compose
```bash
docker compose up
```
* Налаштоване підключення в `pgAdmin` для `Render`

## Запуск
```bash
node .\app.js
```

## Postman
доступні файли [колекції](/doc/postman/goit-node-rest-api-v3.postman_collection) та [оточення](/doc/postman/local-contacts-v3.postman_environment) для імпорту

![postman](/doc/resources/image.png)