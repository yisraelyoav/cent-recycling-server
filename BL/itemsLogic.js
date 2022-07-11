const HttpError = require("../DL/models/httpError");
const { validationResult } = require("express-validator");
const getCoordinatesForAddress = require("../util/location");
const itemsControllers = require("../DL/controllers/itemsControllers");
const usersLogic = require("./usersLogic");

async function getAllItemsPopulated() {
  const allItems = await itemsControllers.readAndPopulate(
    {},
    "owner",
    "_id fName lName phone"
  );
  return allItems;
}
async function getItemByID(req) {
  const itemID = req.params.itmID;
  let item;
  try {
    item = await itemsControllers.readOne({ _id: itemID });
    if (!item) {
      const error = new HttpError(
        "Could not find a an item for the provided id.",
        404
      );
      throw error;
    } else {
      return item;
    }
  } catch {
    const error = new HttpError(
      "Something went wrong, could not find an item.",
      500
    );
    throw error;
  }
}

async function getItemsPopulatedByUserID(req, res) {
  const userID = req.userData.userID;
  let items;
  try {
    items = await itemsControllers.readAndPopulate(
      { owner: userID },
      "owner",
      "fName lName phone"
    );
  } catch {
    const error = new HttpError(
      "Something went wrong but do not worry, we'll  find your stuff, eventually.",
      404
    );
    throw error;
  }
  return items;
}

async function createItem(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid input, please check your data", 422);
  }
  const { title, description, address } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordinatesForAddress(address);
  } catch (error) {
    throw error;
  }

  let user;
  try {
    user = await usersLogic.getUserByID(req.userData.userID);
  } catch (err) {
    const error = new HttpError("Adding an item faield, please try again", 500);
    throw error;
  }
  if (!user) {
    const error = new HttpError("could not find this user ID", 404);
    return next(error);
  }
  const createdItem = await itemsControllers.create(
    {
      title,
      image: req.file.path.replace("\\", "/"),
      description,
      address,
      location: coordinates,
      owner: req.userData.userID,
    },
    user
  );
  try {
    await createdItem.save();
  } catch (err) {
    const error = new HttpError(
      "Creating new item failed, please try again",
      500
    );
    throw error;
  }
  return createdItem;
}

async function updateItem(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input, please check your data", 422));
  } else {
    const { title, image, description, address, owner } = req.body;
    const itemID = req.params.itmID;

    if (owner !== req.userData.userID) {
      throw new HttpError(
        "Shame on you! you are not the owner of this item",
        401
      );
    }
    const updatedItem = await itemsControllers.readOne({ _id: itemID });
    let coordinates;
    try {
      coordinates = await getCoordinatesForAddress(address);
    } catch (error) {
      return next(error);
    }
    updatedItem.title = title;
    updatedItem.description = description;
    updatedItem.image = image;
    updatedItem.coordinates = coordinates;
    updatedItem.address = address;
    updatedItem.owner = owner;

    await itemsControllers.update(itemID, updateItem);

    res.status(200).json({ item: updatedItem });
  }
}

async function deleteItem(req, next) {
  const itemID = req.params.itmID;
  const item = await itemsControllers.readOne({ _id: itemID });
  if (!item.id === itemID) {
    return next(new HttpError("Could not find an item for that ID", 404));
  } else {
    return await itemsControllers.deleteById(itemID);
  }
}

exports.getAllItemsPopulated = getAllItemsPopulated;
exports.getItemByID = getItemByID;
exports.getItemsPopulatedByUserID = getItemsPopulatedByUserID;
exports.createItem = createItem;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;
