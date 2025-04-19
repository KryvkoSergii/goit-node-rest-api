# Authentication and Authorization

- [Українська](README.ua.md)

## Step 0
Create a `04-auth` branch from the `master` branch.

Continue creating a REST API to work with the contacts collection. Add user authentication/authorization logic via `JWT`.

## Step 1
In the code, create a user model for the `users` table
```javascript
{
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  subscription: {
      type: DataTypes.ENUM,
      values: ["starter", "pro", "business"],
      defaultValue: "starter"
  },
  token: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
}
```
Change the contact model so that each user can only see their own contacts. To do this, add the property
```javascript
   owner: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
```

## Step 2
### Registration

1. Create the `/api/auth/register` endpoint

2. Validate all required fields (`email` and `password`). If validation fails, return a Validation Error.

If validation is successful, create a user in the User model based on the validated data. Use bcrypt or bcryptjs to hash passwords

If the email is already being used by someone else, return a `Conflict` Error.

Otherwise, return a Successful response.

#### Registration request
```javascript
POST /api/auth/register
Content-Type: application/json
RequestBody: {
  "email": "example@example.com",
  "password": "examplepassword"
}
```

#### Registration validation error
```javascript
Status: 400 Bad Request
Content-Type: application/json
ResponseBody: {
    "message": "Error from Joi or other validation library"
}
```

#### Registration conflict error
```javascript
Status: 409 Conflict
Content-Type: application/json
ResponseBody: {
  "message": "Email in use"
}
```

#### Registration success response
```javascript
Status: 201 Created
Content-Type: application/json
ResponseBody: {
  "user": {
    "email": "example@example.com",
    "subscription": "starter"
  }
}
```

### Login
1. Create an endpoint `/api/auth/login`

2. In the `User` model, find the user by `email`.

3. Validate all required fields (`email` and `password`). If validation fails, return a Validation Error.

Otherwise, compare the password for the found user, if the passwords match, create a token, save it in the current user, and return a Successful response.

If the password or email is incorrect, return an Unauthorized Error.

#### Login request
```javascript
POST /api/auth/login
Content-Type: application/json
RequestBody: {
  "email": "example@example.com",
  "password": "examplepassword"
}
```

#### Login validation error
```javascript
Status: 400 Bad Request
Content-Type: application/json
ResponseBody: {
  "message": "Error from Joi or other validation library"
}
```

#### Login success response
```javascript
Status: 200 OK
Content-Type: application/json
ResponseBody: {
  "token": "exampletoken",
  "user": {
    "email": "example@example.com",
    "subscription": "starter"
  }
}
```

#### Login auth error
```javascript
Status: 401 Unauthorized
ResponseBody: {
  "message": "Email or password is wrong"
}
```

## Step 3
### Token Validation

Create a middleware to validate the token and add it to all routes that need to be protected.

The middleware takes the token from the `Authorization` headers, validates the token for validity.
In case of error, return an `Unauthorized` Error.
If validation is successful, get the user id from the token. Find the user in the database with this id.
If the user exists and the token matches the one in the database, write their data to req.user and call `next()`.
If the user with this id does NOT exist or the tokens do not match, return an `Unauthorized` Error

#### Middleware unauthorized error
```javascript
Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
  "message": "Not authorized"
}
```

## Step 4
### Logout
1. Create an `/api/auth/logout` endpoint

2. Add a token validation middleware to the route.

In the User model, find the user by id.
If the user does not exist, return an Unauthorized Error.
Otherwise, remove the token from the current user and return a Successful response.
#### Logout request
```javascript
POST /api/auth/logout
Authorization: "Bearer {{token}}"
```
#### Logout unauthorized error
```javascript
Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
  "message": "Not authorized"
}
```
#### Logout success response
```javascript
Status: 204 No Content
```

## Step 5
### Current user - get user data by token
1. Create endpoint `/api/auth/current`

2. Add token verification middleware to route.

If the user does not exist, return an `Unauthorized` Error
Otherwise return a Success response

#### Current user request
```javascript
GET /api/auth/current
Authorization: "Bearer {{token}}"
```

#### Current user unauthorized error
```javascript
Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
  "message": "Not authorized"
}
```

#### Current user success response
```javascript
Status: 200 OK
Content-Type: application/json
ResponseBody: {
  "email": "example@example.com",
  "subscription": "starter"
}
```

## Additional task (optional)

Make pagination for the contacts collection `(GET /api/contacts?page=1&limit=20)`.
Filter contacts by favorite field `(GET /api/contacts?favorite=true)`
Update user subscription via PATCH endpoint `/api/auth/subscription`. Subscription must have one of the following values ​​`['starter', 'pro', 'business']`

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
node .\app.js
```

## Postman
available [collection](/doc/postman/goit-node-rest-api-v2.postman_collection) and [environment](/doc/postman/local-contacts-v2.postman_environment) files for import

![postman](/doc/resources/image.png)