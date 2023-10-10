const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = new Schema({
  code: String,
  name: String,
  price: Number,
  unit: { type: Schema.ObjectId, ref: "Unit" },
  description: String,
  image: String,
  quantity: Number,
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  user: { type: Schema.ObjectId, ref: "User" },
  userUpdate: { type: Schema.ObjectId, ref: "User" },
  category: { type: Schema.ObjectId, ref: "Category" },
});

const Product = model("Product", productSchema, "products");

module.exports = Product;
