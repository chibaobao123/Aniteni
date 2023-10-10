const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const exportGoodsDetailSchema = new Schema({
  update_warehouse: { type: Schema.ObjectId, ref: "exportGoods" },
  product: { type: Schema.ObjectId, ref: "Product" },
  quantity: Number,
});

const ExportGoodsDetail = model(
  "ExportGoodsDetail",
  exportGoodsDetailSchema,
  "exportGoodsDetail"
);

module.exports = ExportGoodsDetail;
