const router = require("express").Router();
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;

router.post("/", (req, res) => {
  if (!req.query.collection) {
    return res
      .status(422)
      .json({ error: "Collection name is missing in Request parameter" });
  }

  var varlimit = 25;
  if (req.body.limit !== undefined) {
    varlimit = req.body.limit;
  }
  var varskip = 0;
  if (req.body.skip !== undefined) {
    varskip = req.body.skip;
  }
  var varprojection = {};
  if (req.body.projection !== undefined) {
    varprojection = { projection: req.body.projection };
  }
  var varsort = {};
  if (req.body.sort !== undefined) {
    varsort = req.body.sort;
  }
  var varsearch = {};
  if (req.body.search !== undefined) {
    varsearch = req.body.search;
  }

  MongoClient.connect(process.env.mongoURL, function (err, client) {
    if (!err) {
      var db = client.db(process.env.mongoDB);
      try {
        db.collection(req.query.collection)
          .find(varsearch, varprojection)
          .sort(varsort)
          .skip(varskip)
          .limit(varlimit)
          .toArray(function (findErr, result) {
            if (!findErr) {
              if (result === undefined || result.length === 0) {
                res.status(204).json(result);
              } else {
                res.status(200).json(result);
              }
            } else {
              res.status(500).json({
                error: "Collection Error",
                error_message: findErr,
              });
            }
            client.close();
          });
      } catch (error) {
        client.close();
        res.status(500).json({
          error: "Collection Connection Error",
          error_message: error,
        });
      }
    } else {
      res.status(500).json({
        error: "Database Connection Error",
        error_message: err,
      });
    }
  });
});

router.post("/id", (req, res) => {
  if (!req.query.collection) {
    return res
      .status(422)
      .json({ error: "Collection name is missing in Request parameter" });
  }

  if (!req.query.id) {
    return res
      .status(422)
      .json({ error: "ID is missing in Request parameter" });
  }

  MongoClient.connect(process.env.mongoURL, function (err, client) {
    if (!err) {
      var db = client.db(process.env.mongoDB);
      try {
        db.collection(req.query.collection)
          .find({ _id: new mongodb.ObjectID(req.query.id) })
          .toArray(function (findErr, result) {
            if (!findErr) {
              if (result === undefined || result.length === 0) {
                res.status(204).json(result);
              } else {
                res.status(200).json(result[0]);
              }
            } else {
              res.status(500).json({
                error: "Collection Error",
                error_message: findErr,
              });
            }
            client.close();
          });
      } catch (error) {
        client.close();
        res.status(500).json({
          error: "Collection Connection Error",
          error_message: error,
        });
      }
    } else {
      res.status(500).json({
        error: "Database Connection Error",
        error_message: err,
      });
    }
  });
});

// all distinct values of field
router.post("/distinct", (req, res) => {
  if (!req.query.collection) {
    return res
      .status(422)
      .json({ error: "Collection name is missing in Request parameter" });
  }

  if (!req.query.id) {
    return res
      .status(422)
      .json({ error: "ID is missing in Request parameter" });
  }

  MongoClient.connect(process.env.mongoURL, function (err, client) {
    if (!err) {
      var db = client.db(process.env.mongoDB);
      try {
        db.collection(req.query.collection).distinct(
          req.query.id,
          {},
          function (findErr, result) {
            if (!findErr) {
              if (result === undefined || result.length === 0) {
                res.status(204).json(result);
              } else {
                res.status(200).json(result);
              }
            } else {
              res.status(500).json({
                error: "Collection Error",
                error_message: findErr,
              });
            }
          }
        );
        client.close();
      } catch (error) {
        client.close();
        res.status(500).json({
          error: "Collection Connection Error",
          error_message: error,
        });
      }
    } else {
      res.status(500).json({
        error: "Database Connection Error",
        error_message: err,
      });
    }
  });
});

// update one
router.put("/updateone", (req, res) => {
  if (!req.query.collection) {
    return res
      .status(422)
      .json({ error: "Collection name is missing in Request parameter" });
  }

  if (!req.query.id) {
    return res
      .status(422)
      .json({ error: "ID is missing in Request parameter" });
  }

  if (!req.body) {
    return res.status(422).json({ error: "Request body is missingr" });
  }

  MongoClient.connect(process.env.mongoURL, function (err, client) {
    if (!err) {
      var db = client.db(process.env.mongoDB);
      var myquery = { _id: new mongodb.ObjectID(req.query.id) };
      var newvalues = { $set: req.body };
      db.collection(req.query.collection).updateOne(
        myquery,
        newvalues,
        function (findErr, result) {
          if (!findErr) {
            if (result.result.nModified === 0) {
              // res.status(201).json(result.result.nModified);
              createObjByID(req, res, db, req.query.collection, client);
            } else {
              res.status(200).json(result);
            }
          } else {
            res.status(500).json({
              error: "Collection Error",
              error_message: findErr,
            });
          }
          client.close();
        }
      );
    } else {
      res.status(500).json({
        error: "Database Connection Error",
        error_message: err,
      });
    }
  });
});

var createObjByID = function (req, res, db, collectionname, client) {
  var reqbody = {
    _id: new mongodb.ObjectID(req.query.id),
    data: req.body.data,
  };
  db.collection(collectionname).insert(reqbody, function (findErr, result) {
    if (!findErr) {
      res.status(200).json(result);
    } else {
      res.status(500).json({
        error: "Database Connection Error",
        error_message: findErr,
      });
    }
    client.close();
  });
};

// insert one
router.put("/insert", (req, res) => {
  if (!req.query.collection) {
    return res
      .status(422)
      .json({ error: "Collection name is missing in Request parameter" });
  }

  if (!req.body) {
    return res.status(422).json({ error: "Request body is missingr" });
  }

  MongoClient.connect(process.env.mongoURL, function (err, client) {
    if (!err) {
      var db = client.db(process.env.mongoDB);
      db.collection(req.query.collection).insertOne(
        req.body,
        function (findErr, result) {
          if (!findErr) {
            if (result.result.nModified === 0) {
              res.status(201).json(result);
            } else {
              res.status(200).json(result);
            }
          } else {
            res.status(500).json({
              error: "Collection Error",
              error_message: findErr,
            });
          }
          client.close();
        }
      );
    } else {
      res.status(500).json({
        error: "Database Connection Error",
        error_message: err,
      });
    }
  });
});

// insert one
router.put("/insertmany", (req, res) => {
  if (!req.query.collection) {
    return res
      .status(422)
      .json({ error: "Collection name is missing in Request parameter" });
  }

  if (!req.body) {
    return res.status(422).json({ error: "Request body is missingr" });
  }

  MongoClient.connect(process.env.mongoURL, function (err, client) {
    if (!err) {
      var db = client.db(process.env.mongoDB);
      db.collection(req.query.collection).insertMany(
        req.body,
        function (findErr, result) {
          if (!findErr) {
            if (result.result.nModified === 0) {
              res.status(201).json(result);
            } else {
              res.status(200).json(result);
            }
          } else {
            res.status(500).json({
              error: "Collection Error",
              error_message: findErr,
            });
          }
          client.close();
        }
      );
    } else {
      res.status(500).json({
        error: "Database Connection Error",
        error_message: err,
      });
    }
  });
});

// delete one
router.delete("/delete", (req, res) => {
  if (!req.query.collection) {
    return res
      .status(422)
      .json({ error: "Collection name is missing in Request parameter" });
  }

  if (!req.query.id) {
    return res
      .status(422)
      .json({ error: "ID is missing in Request parameter" });
  }

  MongoClient.connect(process.env.mongoURL, function (err, client) {
    if (!err) {
      var db = client.db(process.env.mongoDB);
      db.collection(req.query.collection).deleteOne(
        {
          _id: new mongodb.ObjectID(req.query.id),
        },
        function (findErr, result) {
          if (!findErr) {
            res.status(200).json(result);
          } else {
            res.status(500).json({
              error: "Collection Error",
              error_message: findErr,
            });
          }
          client.close();
        }
      );
    } else {
      res.status(500).json({
        error: "Database Connection Error",
        error_message: err,
      });
    }
  });
});

module.exports = router;
