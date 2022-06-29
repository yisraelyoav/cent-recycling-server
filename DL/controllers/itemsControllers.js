const itemsModel = require("../models/itemsModel");

async function read(filter, proj) {
  return await itemsModel.find(filter, proj);
}
async function readOne(filter, proj) {
  return await itemsModel.findOne(filter, proj);
}
async function create(newItem) {
  return await itemsModel.create(newItem);
}
async function update(id, updatedItem) {
  return await itemsModel.findByIdAndUpdate(id, updatedItem, { new: true });
}
async function deleteById(filter) {
  return await itemsModel.findOneAndDelete(filter);
}
module.exports = {
  read,
  readOne,
  create,
  update,
  deleteById,
};
