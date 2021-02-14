try {
  const dotenv = require("dotenv");
  const result = dotenv.config({ silent: true });
  if (result.error) {
    console.log("dotenv result error", result);
    console.error(result.error);
  }
} catch (error) {
  console.log("dotenv catch error");
  console.error(error);
}

const express = require("express");
var createError = require("http-errors");
const cors = require("cors");
const path = require("path");
const graphqlHTTP = require("express-graphql").graphqlHTTP;
const schema = require("./schema");

const mongoose = require("mongoose");
const connect = mongoose.connect(process.env.mongoURL, {
  useNewUrlParser: true,
});
connect.then(
  (db) => {
    console.log("MongoDB connected correctly to server!");
  },
  (err) => {
    console.log(err);
  }
);

const app = express();
app.use(cors());
var bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" }));

app.get("/postman", function (req, res) {
  res.header("Content-Type", "application/json");
  var filepath = path.join(
    __dirname.replace("src" + path.sep + "server", ""),
    "Ecom.postman_collection.json"
  );
  res.send(JSON.stringify(require(filepath)));
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema.typeDefs,
    rootValue: schema.resolvers,
    graphiql: true,
  })
);

// app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require("body-parser").json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/mongoclient", require("./routes/mongoclient"));
app.use("/api/razorpay/payment/", require("./routes/razorpay"));
app.use("/api/email/", require("./routes/email"));
app.use("/api/sendPDF", require("./routes/pdf"));

app.get("/api", (req, res) => {
  res.json({
    title: "Ecom App",
    date: new Date(),
    status: true,
    Env: process.env.ENV || process.env.NODE_ENV || "NA",
  });
});

// React App with add middleware
var folderpath = __dirname.replace("src" + path.sep + "server", "");
app.use(express.static(path.join(folderpath, "build", path.sep)));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  if (req.url === "/") {
    res.sendFile(path.join(folderpath, "public", "loading.html"));
  } else if (req.method === "GET") {
    // on refresh URL redirect to React UI
    res.sendFile(path.join(folderpath, "build", path.sep, "index.html"));
  } else {
    // render the error page json
    res.status(err.status || 500).json({
      date: new Date(),
      error_status: err.status,
      error_message: err.message,
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port);
console.log(`Running a GraphQL API server at localhost:${port}/graphql`);
