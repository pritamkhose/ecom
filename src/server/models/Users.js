const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
// mongoose db connected to my_db
const { Schema } = mongoose;

const UsersSchema = new Schema({
  username: String,
  email: String,
  hash: String,
  salt: String,
  resetcode: Number,
  resetTime: String,
  isActive: Boolean,
  info: Object,
  loginHistory: []
});

UsersSchema.methods.setSocialPassword = function (password, req) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  this.resetcode = 0;
  this.resetTime = null;
  this.isActive = true;
  this.loginHistory = [{ date: new Date(), requestDetails: req.headers }];
};

UsersSchema.methods.generateJWT = function () {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);
  // console.log(parseInt(expirationDate.getTime() / 1000, 10));

  return jwt.sign(
    {
      email: this.email,
      username: this.username,
      id: this._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10)
    },
    'secret'
  );
};

UsersSchema.methods.toAuthJSON = function () {
  return {
    id: this._id,
    email: this.email,
    username: this.username,
    token: this.generateJWT()
    // expirationDateTime: expirationDate.toString(),
  };
};

module.exports = mongoose.model('Users', UsersSchema);
