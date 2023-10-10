const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const customersSchema = new Schema({
  firstName: String,
  lastName: String,
  address: String,
  accumulation: { type: Number, default: 0 },
  phone: String,
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

const Customer = model("Customer", customersSchema, "customers");

module.exports = Customer;
