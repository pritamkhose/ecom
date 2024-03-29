# Ecom Express backend with Graphql app using  Mongo
it's GraphQL Ecom app using Mongodb has interface via Rest & GraphQL APIs.

## Running App Locally

Make sure you have Node JS.

```sh
npm run start:local
or
npm run watch:localserver
```

Your React UI running on [localhost:3000](http://localhost:3000).
Your GraphQL running on [localhost:3000/graphql](http://localhost:3000/graphql).
Your Postman Request running on [localhost:3000/postman](http://localhost:3000/postman).
Your REST API Request running on [localhost:3000/api](http://localhost:3000/api).

## Running App Production

```sh
npm run start
```

or Using nodemon

```sh
npm install -g nodemon
nodemon
```

## Get Graphql schema via apollo cilent
```sh
apollo schema:download --endpoint=http://localhost:3000/graphql  ecom_schema.json
  √ Loading Apollo Project
  √ Saving schema to ecom_schema.json
```
check dir where created ecom_schema.json scema file

## Install apollo cilent
```sh
npm i -g apollo
```