const express = require('express');
var createError = require('http-errors');
const cors = require('cors');
const path = require('path');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const gql = require('graphql-tag');
const { buildASTSchema } = require('graphql');

const POSTS = [
  { author: "John Doe", body: "Hello world" },
  { author: "Jane Doe", body: "Hi, planet!" },
];

const schema = buildASTSchema(gql`
  type Query {
    posts: [Post]
    post(id: ID!): Post
  }

  type Post {
    id: ID
    author: String
    body: String
  }

  type Mutation {
    submitPost(input: PostInput!): Post
  }
  
  input PostInput {
    id: ID
    author: String!
    body: String!
  }
`);

const mapPost = (post, id) => post && ({ id, ...post });

const root = {
  posts: () => POSTS.map(mapPost),
  post: ({ id }) => mapPost(POSTS[id], id),
  submitPost: ({ input: { id, author, body } }) => {
    const post = { author, body };
    let index = POSTS.length;

    if (id != null && id >= 0 && id < POSTS.length) {
      if (POSTS[id].id !== id) return null;

      POSTS.splice(id, 1, post);
      index = id;
    } else {
      POSTS.push(post);
    }

    return mapPost(post, index);
  },
};

const app = express();
app.use(cors());

app.get('/postman', function (req, res) {
  res.header("Content-Type", 'application/json');
  var filepath = path.join((__dirname.replace("src" + path.sep + "server", '')), "Ecom.postman_collection.json");
  res.send(JSON.stringify(require(filepath)));
});

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

app.get('/api', (req, res) => {
  res.json({ title: 'Ecom App', date: (new Date()), status: true, 'Env' : process.env.ENV || process.env.NODE_ENV || 'NA'});
});

// React App with add middleware
var folderpath = __dirname.replace("src" + path.sep + "server", '');
app.use(express.static(path.join(folderpath, "build", path.sep)));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  if (req.url === '/') {
    res.sendFile(path.join(folderpath, "public", "loading.html"));
  } else {
    // render the error page json
    res.status(err.status || 500).json({ 'date': (new Date()), 'error_status': err.status, 'error_message': err.message });
  }
});

const port = process.env.PORT || 3000
app.listen(port);
console.log(`Running a GraphQL API server at localhost:${port}/graphql`);