# Ecom app using MongoDB
it's GraphQL Ecom app using Mangodb has interface via Rest & GraphQL APIs.

## Running App Locally

Make sure you have Node JS.

```sh
git clone https://github.com/pritamkhose/ecom.git
npm install
npm start
```
or Using nodemon

```sh
npm install -g nodemon
nodemon
```

Using react serve local

```sh
npm install -g serve
serve -s build
```

Your React app running on [localhost:3000](http://localhost:3000/).
Your GraphQL running on [localhost:3000/graphql](http://localhost:3000/graphql).
Your Postman running on [localhost:3000/postman](http://localhost:3000/postman).

## Steps to deploy App on heroku

```sh
npm run build
npm start
```