const router = require('express').Router();
const serviceAccount = JSON.parse(process.env.FIREBASE);

const firebase = require('firebase-admin');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: serviceAccount.databaseURL,
  storageBucket: serviceAccount.storageBucket
});

router.post('/bucketinfo', async (req, res) => {
  /*eslint-disable */
  const bucket = firebase.storage().bucket(serviceAccount.storageBucket);
  bucket.getMetadata().then(function (data) {
    res.status(200).json(data);
  }),
    function (errorObject) {
      res.status(500).json({ errorObject });
    };
});
/* eslint-enable */

if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // cb(null, Date.now() + "_" + file.originalname);
    cb(null, file.originalname);
  }
});
const localupload = multer({ storage });

router.post('/upload', localupload.single('file'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'file is missing in Request body' });
    } else {
      const bucket = firebase.storage().bucket(serviceAccount.storageBucket);
      bucket
        .upload(req.file.path, {
          destination: 'ecom/product/' + req.file.path.toString().replace('uploads\\', '')
        })
        .then(function (data) {
          const token = ''; // data[0]["metadata"]["firebaseStorageDownloadTokens"];
          const url =
            'https://firebasestorage.googleapis.com/v0/b/' +
            serviceAccount.storageBucket +
            '/o/ecom%2Fproduct%2F' +
            req.file.path.toString().replace('uploads\\', '') +
            '?alt=media&token=' +
            token;
          fs.unlink(req.file.path, (err) => {
            if (err) {
              console.log(err);
            }
            res.status(200).json({
              name: data[0].metadata.name,
              url,
              bucket: data[0].metadata.bucket,
              contentType: data[0].metadata.contentType,
              timeCreated: data[0].metadata.timeCreated,
              size: data[0].metadata.size
            });
          });
        })
        .catch((error) => {
          res.status(403).json({
            error,
            'error txt': req.query.pathname + ' File not found'
          });
        });
    }
  } catch (error) {
    res.status(500).json({ errorName: 'Server UploadClient Error ', error: error.stack });
  }
});

router.post('/uploadScript', (req, res, next) => {
  axios
    .post(
      process.env.API_URL + '/api/mongoclient/distinct?collection=productmyntra&id=searchImage',
      {}
    )
    .then(
      (response) => {
        for (let i = 101; i < response.data.length; i++) {
          const url = response.data[i];
          const fname = url.substring(url.lastIndexOf('/') + 1);
          downloadFile(url, fname, i);
        }
        // res.status(200).json({
        //   data: response.data,
        // });
      },
      (err) => {
        res.status(500).json({ error: 'Error', error_message: err });
      }
    );
});

const downloadFile = function (url, fname, i) {
  axios({
    method: 'get',
    url,
    responseType: 'stream'
  })
    .then((response) => {
      response.data.pipe(
        fs.createWriteStream('uploads/' + fname, (err) => {
          if (err) {
            console.error('Error - ' + i, fname, err);
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
