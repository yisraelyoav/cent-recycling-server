const itemsModel = require("../models/itemsModel");
const mongoose = require("mongoose");
const { populate } = require("../models/itemsModel");

async function read(filter, proj) {
  return await itemsModel.find(filter, proj);
}
async function readAndPopulate(filter, path, select) {
  return await itemsModel.find(filter).populate(path, select);
}
async function readOne(filter, proj) {
  return await itemsModel.findOne(filter, proj);
}
async function create(newItem, user) {
  const sess = await mongoose.startSession();
  sess.startTransaction();
  const item = await itemsModel.create(newItem);
  user.items.push(item);
  await user.save({ ssesion: sess });
  await sess.commitTransaction();
  return item;
}
async function update(id, updatedItem) {
  return await itemsModel.findByIdAndUpdate(id, updatedItem, { new: true });
}
async function deleteById(filter) {
  return await itemsModel.findOneAndDelete(filter);
}
module.exports = {
  read,
  readAndPopulate,
  readOne,
  create,
  update,
  deleteById,
};
