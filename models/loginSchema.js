const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const loginSchema = new Schema({
  TaiKhoan: { type: String, default: "" },
  loginAt: { type: Date, default: Date.now },
  logoutAt: { type: Date, default: Date.now },
  action: { type: String, default: "System" },
});

const Login = model("login", loginSchema, "login");
// login.index({ first: 1, last: -1 }) Nơi đánh index
module.exports = Login;
