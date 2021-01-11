const router = require("express").Router();
const htmlpdf = require("html-pdf");
const path = require("path");
const fs = require("fs");

router.post("/", async (req, res) => {
  if (!req.body && !req.body.html) {
    return res.status(422).json({ error: "html is missing in Request body" });
  }

  var html =
    '<!DOCTYPE html>  <html lang="en"> <head> <meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    "</head>   <body> <div >" +
    req.body.html +
    "</div>  </body>  </html>";
  var options = { format: "A4" };
  var fname = "order_" + getRandomNo() + ".pdf";
  htmlpdf.create(html, options).toFile("./data/" + fname, function (err, data) {
    if (err) {
      res.status(500).json({ error: "PDF Error", error_message: err });
    } else {
      res.status(200).json({ filename: fname });
    }
  });
});

router.get("/file", async (req, res) => {
  if (!req.query.file && !req.query.file) {
    return res.status(422).json({ error: "file is missing in Request query" });
  } else {
    var fpath = path.join(
      __dirname.replace(path.join("src", "server", "routes", ""), ""),
      "data",
      "",
      req.query.file
    );
    var filedata = fs.readFileSync(fpath);
    res.contentType("application/pdf; charset=utf-8");
    res.send(filedata);
  }
});

function getRandomNo() {
  var min = 10000;
  var max = 99999;
  return Math.floor(Math.random() * (max - min) + min);
}

module.exports = router;
