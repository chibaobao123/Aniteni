const mongoose = require('mongoose')
const { Schema, model } = mongoose;

const billsSchema = new Schema({
    user: { type: Schema.ObjectId, ref: 'User' },
    customer: { type: Schema.ObjectId, ref: 'Customer' },
    created: { type: Date, default: Date.now },
    paymentMethods: String,
    totalOrder: Number,
    note: String
});

const Bills = model("Bills", billsSchema, 'bills');

module.exports = Bills;