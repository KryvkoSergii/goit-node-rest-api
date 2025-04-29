# Email send

- [Українська](README.ua.md)

Create a branch `hw06-email` from the `master` branch.

## How the verification process should work

* After registration, the user should receive an email to the email address specified during registration with a link to verify their email
* After following the link in the received email for the first time, the user should receive a Response with status 200, which will mean successful email verification
* After following the link again, the user should receive an Error with status 404

## Step 1
Creating an endpoint for email verification

1. Add two fields `verificationToken` and `verify` to the `User` model. The value of the `verify` field equal to `false` will mean that his `email` has not yet been verified

2. Create an endpoint `GET /auth/verify/:verificationToken(# verification-request)`, where we will search for the user in the User model by the `verificationToken` parameter

* If the user with such a token is not found, it is necessary to return the `'Not Found'' Error

* If the user is found, we set `verificationToken` to `null`, and set the verify field to true in the user document and return a Successful response

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
````

Verification success response
```javascript
Status: 200 OK
ResponseBody: {
message: 'Verification successful',
}
```

## Step 3
Adding sending an `email` to the user with a link for verification

When creating a user during registration:

* Create a `verificationToken` for the user and write it to the database (to generate a token, use the `uuid` or `nanoid` package)
* Send an `email` to the user's email and specify the link for verifying the `email` (`/auth/verify/:verificationToken`) in the message
* It is also necessary to take into account that now the user's login is not allowed if the email is not verified

## Step 4

Adding re-sending an email to the user with a link for verification

It is necessary to provide for the option that the user may accidentally delete the letter. It may not reach the recipient for some reason. Our email sending service gave an error during registration, etc.

`POST /auth/verify`

Receives body in `{email}` format

If there is no required field `email` in body, returns json with key `{"message":"missing required field email"}` and status 400

If everything is fine with body, resend the email with `verificationToken` to the specified email, but only if the user is not verified

If the user has already passed verification, send json with key `{"message":"Verification has already been passed"}` with status `400 Bad Request`

Resending an email request

```javascript
POST /auth/verify
Content-Type: application/json
RequestBody: {
"email": "example@example.com"
}
````

Resending an email validation error

```javascript
Status: 400 Bad Request
Content-Type: application/json
ResponseBody: {
"message": "Error from Joi or other library validation"
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


## Prerequisites
* Created a database using [Render](https://render.com/)
* Prepared environment file `.env` according to `.env_example`
* Installed Node.js v.20
* Installed dependencies
```bash
yarn install
```
* Started `pgAdmin` using docker-compose
```bash
docker compose up
```
* Configured connection in `pgAdmin` for `Render`

## Running
```bash
yarn start dev
```

## Run test
```bash
yarn test
```
### Observe result like:
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

## Run in Docker container
```bash
docker compose .\docker-compose-app.yml up
```

## Publish to dockerhub
### Login
```bash
docker login -u user -p password
```
### Publish
```bash
docker tag goit-node-rest-api-app:latest <repo>/goit-node-rest-api-app:<tag>
```

## Postman
available [collection](/doc/postman/goit-node-rest-api-v4.postman_collection) and [environment](/doc/postman/local-contacts-v3.postman_environment) files for import

![postman](/doc/resources/image.png)