const mongoose = require('mongoose')
const { Schema,model } = mongoose;

const unitsSchema = new Schema({
  name: String,
});

const Units = model("Unit", unitsSchema, 'units');

module.exports = Units;