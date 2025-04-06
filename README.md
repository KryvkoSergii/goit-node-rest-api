# REST API

- [Українська](README.ua.md)

## Step 1
Create a repository named `goit-node-rest-api` and put the files from the src folder on the main branch (main). Note: the [src](https://github.com/goitacademy/neo-nodejs-homework/tree/main/hw2) folder should not be in the repository, you are only interested in its contents.
Create a `hw02-express` branch from the `main` branch.

## Step 2
Into the `contactsServices.js` file (located in the `services` folder), copy the functions from the `contacts.js` file from the homework for module 1.

## Step 3
Write the controllers in the `contactsControllers.js` file (located in the controllers folder) taking into account the requirements below.

The REST API should support the following routes:

`GET /api/contacts`

`GET /api/contacts/:id`

`DELETE /api/contacts/:id`

`POST /api/contacts`

`PUT /api/contacts/:id`

## Prerequisites
* Node.js v.20 installed
* Dependencies installed
```bash
npm i
```

## Run
```bash
node .\app.js
```