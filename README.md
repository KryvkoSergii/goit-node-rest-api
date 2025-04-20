# Working with files and testing applications

- [Українська](README.ua.md)

Create a branch `hw05-avatars` from the master branch.

Continue creating a REST API for working with the contact collection. Add the ability to upload a user avatar via [Multer](https://www.npmjs.com/package/multer) .

## Step 1
Create a folder `public` for static distribution. In this folder, create a folder avatars.
Configure Express to distribute static files from the `public` folder.
Put any image in the `public/avatars` folder and check that static distribution works.
When you navigate to such a URL, the browser will display the image. Shell `http://localhost:<port>/avatars/<filename with extension>`

## Step 2
Add a new property avatarURL to the user schema to store the image.
Use the `gravatar` package to generate an avatar for a new user using their email address when they register.

## Step 3

When registering a user:
* Create a link to the user's avatar using gravatar
* Save the resulting URL in the avatarURL field when creating a user

```javascript
PATCH /auth/avatars
Content-Type: multipart/form-data
Authorization: "Bearer {{token}}"
RequestBody: uploaded file

# Successful response
Status: 200 OK
Content-Type: application/json
ResponseBody: {
"avatarURL": "here will be a link to the image"
}

# Unsuccessful response
Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
"message": "Not authorized"
}
```
Create a `temp` folder in the root of the project and save the uploaded avatar in it.
Move the user avatar from the temp folder to the `public/avatars` folder and give it a unique name for the specific user.
The resulting URL `/avatars/<filename with extension>` and save it in the user avatarURL field

## Step 4
Add the ability to update the avatar by creating the `/auth/avatars` endpoint and using the PATCH method.

## Additional task (optional)
Write `unit tests` for the login controller using Jest:

the response should have a status code `200`
* the response should return a token
* the response should return a user object with 2 fields `email` and `subscription` with data type `String`

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
available [collection](/doc/postman/goit-node-rest-api-v3.postman_collection) and [environment](/doc/postman/local-contacts-v3.postman_environment) files for import

![postman](/doc/resources/image.png)