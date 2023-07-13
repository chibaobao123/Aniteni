const mongoose = require('mongoose')
const { Schema, model } = mongoose;

const billsDetailSchema = new Schema({
    bill: { type: Schema.ObjectId, ref: 'Bills' },
    product: { type: Schema.ObjectId, ref: 'Product' },
    quantity: Number,
});

const BillDetails = model("BillDetails", billsDetailSchema, 'billDetails');

module.exports = BillDetails;