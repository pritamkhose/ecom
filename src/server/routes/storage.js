const router = require("express").Router();
const serviceAccount = JSON.parse(process.env.FIREBASE);

var firebase = require("firebase-admin");
var multer = require("multer");
var fs = require("fs");
const axios = require("axios");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: serviceAccount.databaseURL,
  storageBucket: serviceAccount.storageBucket,
});

router.post("/bucketinfo", async (req, res) => {
  var bucket = firebase.storage().bucket(serviceAccount.storageBucket);
  bucket.getMetadata().then(function (data) {
    res.status(200).json(data);
  }),
    function (errorObject) {
      res.status(500).json({ errorObject });
    };
});

if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // cb(null, Date.now() + "_" + file.originalname);
    cb(null, file.originalname);
  },
});
var localupload = multer({ storage: storage });

router.post("/upload", localupload.single("file"), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "file is missing in Request body" });
    } else {
      var bucket = firebase.storage().bucket(serviceAccount.storageBucket);
      bucket
        .upload(req.file.path, {
          destination:
            "ecom/product/" + req.file.path.toString().replace("uploads\\", ""),
        })
        .then(function (data) {
          var token = ""; //data[0]["metadata"]["firebaseStorageDownloadTokens"];
          var url =
            "https://firebasestorage.googleapis.com/v0/b/" +
            serviceAccount.storageBucket +
            "/o/ecom%2Fproduct%2F" +
            req.file.path.toString().replace("uploads\\", "") +
            "?alt=media&token=" +
            token;
          fs.unlink(req.file.path, (err) => {
            if (err) {
              console.log(err);
            }
            res.status(200).json({
              name: data[0]["metadata"]["name"],
              url,
              bucket: data[0]["metadata"]["bucket"],
              contentType: data[0]["metadata"]["contentType"],
              timeCreated: data[0]["metadata"]["timeCreated"],
              size: data[0]["metadata"]["size"],
            });
          });
        })
        .catch((error) => {
          res.status(403).json({
            error,
            "error txt": req.query.pathname + " File not found",
          });
        });
    }
  } catch (error) {
    res
      .status(500)
      .json({ errorName: "Server UploadClient Error ", error: error.stack });
  }
});

router.post("/uploadScript", (req, res, next) => {
  axios
    .post(
      process.env.API_URL +
        "/api/mongoclient/distinct?collection=productmyntra&id=searchImage",
      {}
    )
    .then(
      (response) => {
        for (let i = 101; i < response.data.length; i++) {
          var url = response.data[i];
          var fname = url.substring(url.lastIndexOf("/") + 1);
          downloadFile(url, fname, i);
        }
        // res.status(200).json({
        //   data: response.data,
        // });
      },
      (err) => {
        res.status(500).json({ error: "Error", error_message: err });
      }
    );
});

var downloadFile = function (url, fname, i) {
  axios({
    method: "get",
    url: url,
    responseType: "stream",
  })
    .then((response) => {
      response.data.pipe(
        fs.createWriteStream("uploads/" + fname, (err) => {
          if (err) {
            console.error("Error - " + i, fname, err);
          }
          fs.close();
        })
      );
    })
    .catch(function (err) {
      console.error(err);
    });
};

module.exports = router;
