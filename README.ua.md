# REST API

- [English](README.md)

## Крок 1
Cтвори репозиторій з назвою `goit-node-rest-api` і помісти на головну гілку (main) файли з папки src. Завваж: папки [src](https://github.com/goitacademy/neo-nodejs-homework/tree/main/hw2) в репозиторії бути не повинно, тебе цікавить лише її вміст.
Створи гілку `hw02-express` з гілки `main`.

## Крок 2
У файл `contactsServices.js` (знаходиться в папці `services`) скопіюй функції з файла `contacts.js` з домашнього завдання до модуля 1.

## Крок 3
Напиши контролери у файлі `contactsControllers.js` (знаходиться у папці controllers) з урахуванням наведених нижче вимог.

REST API повинен підтримувати такі раути:

`GET /api/contacts`

`GET /api/contacts/:id`

`DELETE /api/contacts/:id`

`POST /api/contacts`

`PUT /api/contacts/:id`


## Вимоги
* Встановленний Node.js v.20
* Встановлені залежності
```bash
npm i
```

## Запуск
```bash
node .\app.js
```

