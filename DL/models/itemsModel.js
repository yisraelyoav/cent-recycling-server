const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, require: false },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  owner: { type: String, required: true },
});

module.exports = mongoose.model("Item", itemSchema);
