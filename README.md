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

## Steps to run on Mac locally

set env file REACT_APP_API_URL=http://localhost:3000

```sh
yarn install
yarn start:web-mac
yarn build
yarn watch:server
```

## References

- [useDebounce Hooks](https://usehooks.com/useDebounce/)
- [useLocation react-router-dom hook](https://stackoverflow.com/questions/45373742/detect-route-change-with-react-router)
- [Using Promises, async / await with MongoDB](https://school.geekwall.in/p/SJ_Tkqbi4)
- [Mongodb-driver async-await](https://stackoverflow.com/questions/47370487/node-js-mongodb-driver-async-await-queries)
- [Mongo Node Doc](http://mongodb.github.io/node-mongodb-native/api-generated/collection.html)
- [Intersectionobserver hook](https://stackoverflow.com/questions/58341787/intersectionobserver-with-react-hooks)
- [useIntersectionObserver](https://usehooks-ts.com/react-hook/use-intersection-observer)
