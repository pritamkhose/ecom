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

module.exports = router;
