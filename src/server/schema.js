const gql = require("graphql-tag");
const { buildASTSchema } = require("graphql");

const typeDefs = buildASTSchema(gql`
  type Query {
    posts: [Post]
    post(id: ID!): Post

    customers: [Customer]
    customer(id: ID!): Customer
  }

  type Post {
    id: ID
    author: String
    body: String
  }

  type Mutation {
    submitPost(input: PostInput!): Post

    addCustomer(name: String!, producer: String!, rating: Float!): Customer
    updateCustomer(
      id: ID!
      name: String!
      producer: String!
      rating: Float
    ): Customer
    deleteCustomer(id: ID!): String
  }

  input PostInput {
    id: ID
    author: String!
    body: String!
  }

  type Customer {
    id: ID!
    name: String!
    producer: String!
    rating: Float!
  }
`);

const Customer = require("./models/customer").Customers;

const POSTS = [
  { author: "John Doe", body: "Hello world" },
  { author: "Jane Doe", body: "Hi, planet!" },
];

const mapPost = (post, id) => post && { id, ...post };

const resolvers = {
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
  customers: () => {
    return Customer.find({});
  },
  customer: ({ id }) => {
    return Customer.findById(id);
  },
  addCustomer: ({ name, producer, rating }) => {
    var aCustomer = new Customer({
      name: name,
      producer: producer,
      rating: rating,
    });
    return aCustomer.save();
  },
  updateCustomer: ({ id, name, producer, rating }) => {
    if (!id) return;
    return Customer.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          name: name,
          producer: producer,
          rating: rating,
        },
      },
      { new: true },
      (err, Customer) => {
        if (err) {
          console.log("Something went wrong when updating the customer");
        } else {
        }
      }
    );
  },
  deleteCustomer: ({ id }) => {
    if (!id) return;
    console.log("delete Customer " + id);
    Customer.deleteOne(
      {
        _id: id,
      },
      (err, Customer) => {
        if (err) {
          console.log("Something went wrong when updating the Customer");
          return err;
        } else {
          return "OK";
        }
      }
    );
  },
};

module.exports = { typeDefs, resolvers };
