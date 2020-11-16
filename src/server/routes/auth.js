const router = require("express").Router();
const Users = require("../models/Users");

router.post("/social", (req, res) => {
  if (!req.body.email) {
    return res.status(422).json({
      error: "email is required",
    });
  }

  Users.findOne({ email: req.body.email }).then((user) => {
    var finalUser = new Users(req.body);
    finalUser.setSocialPassword(req.body.username + req.body.email, req);
    if (!user) {
      return finalUser
        .save()
        .then(() => res.json({ user: finalUser.toAuthJSON() }))
        .catch((err) => {
          res.status(400).json({ error_message: err });
        });
    } else {
      var loginHistory = finalUser.loginHistory;
      loginHistory.push({ date: new Date(), requestDetails: req.headers });
      Users.updateOne(
        {
          _id: user._id,
        },
        {
          $set: { info: req.body.info, loginHistory },
        }
      )
        .then((doc) => {
          // console.log(doc);
        })
        .catch((err) => {
          console.log(err);
        });
      return res.json({ user: finalUser.toAuthJSON() });
    }
  });
});

module.exports = router;
