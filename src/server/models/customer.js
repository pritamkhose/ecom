const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    producer: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Customers = mongoose.model('Customer', customerSchema);
module.exports = { Customers, customerSchema };
