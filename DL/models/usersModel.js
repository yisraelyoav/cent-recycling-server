const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema({
  fName: { type: String, required: true },
  lName: { type: String, required: true },
  phone: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: false },
  password: { type: String, required: true, minlength: 6 },
  items: { type: String },
});
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
