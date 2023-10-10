const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const exportGoodsSchema = new Schema({
  user: { type: Schema.ObjectId, ref: "User" },
  userCreate: { type: Schema.ObjectId, ref: "User" },
  created: {
    type: Date,
    default: Date.now,
  },
  quantity: Number,
});

const ExportGoods = model("ExportGoods", exportGoodsSchema, "exportGoods");

module.exports = ExportGoods;
