const router = require("express").Router();
const axios = require("axios");
// https://www.twilio.com/blog/sending-email-attachments-with-sendgrid
// var nodemailer = require("nodemailer");
// var transport = nodemailer.createTransport({
//   service: process.env.MAIL_SERVICE,
//   host: process.env.MAIL_HOST,
//     port: process.env.MAIL_PORT,
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS,
//   },
// });

// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/send", async (req, res) => {
  if (!req.body.to) {
    return res
      .status(422)
      .json({ error: "email to is missing in Request body" });
  }

  if (!req.body.subject) {
    return res
      .status(422)
      .json({ error: "email subject is missing in Request body" });
  }

  var emailbody = {};
  if (!req.body.text && !req.body.html) {
    return res
      .status(422)
      .json({ error: "email text or html is missing in Request body" });
  }

  if (req.body.text) {
    emailbody = {
      type: "text/plain",
      value: req.body.text,
    };
  }

  if (req.body.html) {
    emailbody = {
      type: "text/html",
      value: req.body.html,
    };
  }

  var data = {
    personalizations: [
      {
        to: [
          {
            email: req.body.to,
          },
        ],
      },
    ],
    from: {
      email: process.env.MAIL_ID,
    },
    subject: req.body.subject,
    content: [emailbody],
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + process.env.SENDGRID_API_KEY,
  };

  axios
    .post("https://api.sendgrid.com/v3/mail/send", data, {
      headers: headers,
    })
    .then(
      () => {
        res.status(200).json({
          msg: "success",
        });
      },
      (err) => {
        res
          .status(500)
          .json({ error: "Mail Transport Error", error_message: err });
      }
    );

  // const msg = {
  //   to: req.body.to,
  //   from: process.env.MAIL_ID,
  //   subject: req.body.subject,
  //   text: req.body.text,
  //   html: req.body.html,
  // };
  // sgMail
  //   .send(msg)
  //   .then((info) => {
  //     res.status(200).json({
  //       msg: "success",
  //       info,
  //     });
  //   })
  //   .catch((err) => {
  //     res
  //       .status(500)
  //       .json({ error: "Mail Transport Error", error_message: err });
  //   });

  // var mailOptions = {
  //   from: process.env.MAIL_ID,
  //   to: req.body.to,
  //   subject: req.body.subject,
  //   text: req.body.text,
  // };
  // transport.sendMail(mailOptions, function (errorobj, info) {
  //   if (errorobj) {
  //     res
  //       .status(500)
  //       .json({ error: "Mail transport error", error_message: errorobj });
  //   } else {
  //     res.status(200).json({
  //       msg: "success",
  //       info,
  //     });
  //   }
  // });
});

module.exports = router;
