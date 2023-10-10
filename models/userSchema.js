const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  address: String,
  phone: String,
  TaiKhoan: String,
  MatKhau: String,
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false },
});

const User = model("User", userSchema, "users");

module.exports = User;
