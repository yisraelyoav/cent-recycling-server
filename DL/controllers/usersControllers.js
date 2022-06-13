const usersModel = require("../models/usersModel");

async function read(filter, proj) {
  return await usersModel.find(filter, proj);
}

async function readOne(filter, proj) {
  return await usersModel.findOne(filter, proj);
}
async function create(newUser) {
  return await usersModel.create(newUser);
}
async function update(id, updatedUser) {
  return await usersModel.findByIdAndUpdate(id, updatedUser, { new: true });
}
async function deleteById(filter) {
  return await usersModel.findOneAndDelete(filter);
}
module.exports = {
  read,
  readOne,
  create,
  update,
  deleteById,
};
