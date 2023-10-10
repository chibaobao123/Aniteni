const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const updateWarehouseDetailSchema = new Schema({
  update_warehouse: { type: Schema.ObjectId, ref: "UpdateWarehouse" },
  product: { type: Schema.ObjectId, ref: "Product" },
  quantity: Number,
});

const UpdateWarehouseDetail = model(
  "UpdateWarehouseDetail",
  updateWarehouseDetailSchema,
  "updateWarehouseDetail"
);

module.exports = UpdateWarehouseDetail;
