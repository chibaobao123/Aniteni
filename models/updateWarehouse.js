const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const updateWarehouseSchema = new Schema({
  user: { type: Schema.ObjectId, ref: "User" },
  created: {
    type: Date,
    default: Date.now,
  },
  quantity: Number,
  total: Number,
});

const UpdateWarehouse = model(
  "UpdateWarehouse",
  updateWarehouseSchema,
  "updateWarehouse"
);

module.exports = UpdateWarehouse;
