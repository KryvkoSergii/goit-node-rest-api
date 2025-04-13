# PostgresSQL and Sequelize

- [Українська](README.ua.md)

## Step 0
Create a branch `03-postgresql` from the `main` branch.

## Step 1
Create an account on [Render](https://render.com/). Then create a new `PostgresSQL` database in the account, which should be called `db-contacts`:

## Step 2
Install the `pgAdmin` graphical editor for convenient work with the `PosgresSQL` database. Connect to the created cloud database via the graphical editor and create a `contacts` table.

## Step 3
Use the source code from homework #2 and replace the contacts storage from the json file with the database you created.
* Write the code to create a connection to `PosgresSQL` using `Sequelize`.
* If the connection is successful, print the message "Database connection successful" to the console.
* Be sure to handle the connection error. Print the error message to the console and end the process using `process.exit(1)`.
* In the query processing functions, replace the code for CRUD operations on contacts from the file with Sequelize methods for working with the contact collection in the database.

## Step 4
We have an additional `favorite` status field in our contacts, which takes the logical value true or false. It is responsible for whether the specified contact is in the favorites or not. It is necessary to implement a new router to update the contact status:

`PATCH /api/contacts/:contactId/favorite`

* Gets the `contactId` parameter
* Gets the body in json format with the `favorite` field updated
* If everything is fine with the body, calls the `updateStatusContact (contactId, body)` function (write it) to update the contact in the database
* According to the result of the function, returns the updated contact object and the status 200. Otherwise, returns json with the key `{"message":"Not found"}` and the status `404`

## Prerequisites
* Create DB on [Render](https://render.com/)
* Prepared environment file `.env` according to `.env_example`
* Installed Node.js v.20
* Installed dependencies
```bash
yarn install
```
* Run `pgAdmin` using docker-compose
```bash
docker compose up
```
* Adjust connection in `pgAdmin` for `Render`

## Running
```bash
node .\app.js
```

## Postman
[collection](/doc/postman/goit-node-rest-api.postman_collection.json) and [environment](/doc/postman/local-contacts.postman_environment.json) files available for import


![postman](/doc/resources/image.png)