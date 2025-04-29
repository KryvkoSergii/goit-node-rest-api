# Email

- [English](README.md)

Створи гілку `hw06-email` з гілки `master`.

## Як повинен працювати процес верифікації 

* Після реєстрації, користувач повинен отримати лист на вказану при реєстрації пошту з посиланням для верифікації свого email
* Пройшовши посиланням в отриманому листі, в перший раз, користувач повинен отримати Відповідь зі статусом 200, що буде мати на увазі успішну верифікацію email
* Пройшовши по посиланню повторно користувач повинен отримати Помилку зі статусом 404

## Крок 1
Створення ендпоінта для верифікації email

1. Додати в модель `User` два поля `verificationToken` і `verify`. Значення поля `verify` рівне `false` означатиме, що його `email` ще не пройшов верифікацію

2. Створити ендпоінт `GET /auth/verify/:verificationToken(# verification-request)`, де по параметру `verificationToken` ми будемо шукати користувача в моделі User

* Якщо користувач з таким токеном не знайдений, необхідно повернути Помилку `'Not Found'`
* Якщо користувач знайдений, встановлюємо `verificationToken` в `null`, а поле verify ставимо рівним true в документі користувача і повертаємо Успішну відповідь

Verification request
```javascript
GET /auth/verify/:verificationToken
```

Verification user Not Found
```javascript
Status: 404 Not Found
ResponseBody: {
  message: 'User not found'
}
```

Verification success response
```javascript
Status: 200 OK
ResponseBody: {
  message: 'Verification successful',
}
```

## Крок 3
Додавання відправки `email` користувачу з посиланням для верифікації

При створення користувача при реєстрації:

* Створити `verificationToken` для користувача і записати його в БД (для генерації токена використовуйте пакет `uuid` або `nanoid`)
* Відправити `email` на пошту користувача і вказати посилання для верифікації `email'а` (`/auth/verify/:verificationToken`) в повідомленні
* Так само необхідно враховувати, що тепер логін користувача не дозволено, якщо не верифікувано email

## Крок 4

Додавання повторної відправки email користувачу з посиланням для верифікації

Необхідно передбачити, варіант, що користувач може випадково видалити лист. Воно може не дійти з якоїсь причини до адресата. Наш сервіс відправки листів під час реєстрації видав помилку і т.д.

`POST /auth/verify`

Отримує body в форматі `{email}`
Якщо в body немає обов'язкового поля `email`, повертає json з ключем `{"message":"missing required field email"}` і статусом 400
Якщо з body все добре, виконуємо повторну відправку листа з `verificationToken` на вказаний email, але тільки якщо користувач не верифікований
Якщо користувач вже пройшов верифікацію відправити json з ключем `{"message":"Verification has already been passed"}` зі статусом `400 Bad Request`

Resending an email request

```javascript
POST /auth/verify
Content-Type: application/json
RequestBody: {
  "email": "example@example.com"
}
```

Resending an email validation error

```javascript
Status: 400 Bad Request
Content-Type: application/json
ResponseBody:  {
  "message": "Помилка від Joi або іншої бібліотеки валідації"
}
```

Resending an email success response

```javascript
Status: 200 Ok
Content-Type: application/json
ResponseBody: {
  "message": "Verification email sent"
}
```

Resend email for verified user

```javascript
Status: 400 Bad Request
Content-Type: application/json
ResponseBody: {
  message: "Verification has already been passed"
}
```

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
yarn start dev
```

## Запуск тестів
```bash
yarn test
```
### Результат:
```bash
yarn run v1.22.22
$ jest
 PASS  controllers/authController.test.js
  loginUser
    √ should return 200 and user data on successful login (4 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.051 s
Ran all test suites.
Done in 1.80s.
```

## Запуск в Docker контейнері
```bash
docker compose .\docker-compose-app.yml up
```

## Опублікувати в dockerhub  
### Увійти
```bash
docker login -u user -p password
```
### Опублікувати
```bash
docker tag goit-node-rest-api-app:latest <repo>/goit-node-rest-api-app:<tag>
``` 
 
## Postman
доступні файли [колекції](/doc/postman/goit-node-rest-api-v4.postman_collection) та [оточення](/doc/postman/local-contacts-v4.postman_environment) для імпорту

![postman](/doc/resources/image.png)