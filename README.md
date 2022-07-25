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

## Steps to config eslint

- [Setup ESLINT and PRETTIER in React app](https://dev.to/knowankit/setup-eslint-and-prettier-in-react-app-357b)
- [Disable Prettier Stackoverflow](https://stackoverflow.com/questions/59876638/disable-prettier-for-a-single-file)

```sh
yarn add eslint --dev
yarn run eslint --init
yarn add eslint-config-prettier eslint-plugin-prettier prettier --dev
```
