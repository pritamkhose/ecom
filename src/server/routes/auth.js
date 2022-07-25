const router = require('express').Router();
const Users = require('../models/Users');

router.post('/social', (req, res) => {
  if (!req.body.email) {
    return res.status(422).json({
      error: 'email is required'
    });
  }

  if (!req.body.info) {
    return res.status(422).json({
      error: 'info is required'
    });
  }

  Users.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      const loginHistory = user.loginHistory;
      loginHistory.push({ date: new Date(), requestDetails: req.headers });
      Users.updateOne(
        {
          _id: user._id
        },
        {
          $set: { info: req.body.info, loginHistory }
        }
      )
        .then((doc) => {
          return res.json({ user: user.toAuthJSON() });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const finalUser = new Users(req.body);
      finalUser.setSocialPassword(req.body.username + req.body.email, req);
      finalUser
        .save()
        .then(() => res.json({ user: finalUser.toAuthJSON() }))
        .catch((err) => {
          res.status(400).json({ error_message: err });
        });
    }
  });
});

module.exports = router;
