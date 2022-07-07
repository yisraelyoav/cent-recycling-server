const HttpError = require("../DL/models/httpError");
const { validationResult } = require("express-validator");
const getCoordinatesForAddress = require("../util/location");
const itemsControllers = require("../DL/controllers/itemsControllers");
const usersLogic = require("./usersLogic");
// const uuid = require("uuid");

//get all items- connect to the DB- fix the errors res
async function getAllItems(req) {
  const allItems = await itemsControllers.read();
  return allItems;
}
//get item by id connect to the DB- fix the errors res
async function getItemsByID(req) {
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
// get item by user id
async function getItemsByUserID(req, res) {
  const userID = req.headers.userID;
  let items;
  try {
    items = await itemsControllers.read({ owner: userID });
  } catch {
    const error = new HttpError(
      "Could not find a an items for the provided user id.",
      404
    );
    throw error;
  }
  if (items.length === 0) {
    const error = new HttpError(
      "Could not find any items for the provided user id.",
      404
    );
    throw error;
  } else {
    return items;
  }
}

async function createItem(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid input, please check your data", 422);
  }
  const { title, description, address, owner } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordinatesForAddress(address);
  } catch (error) {
    throw error;
  }

  let user;
  try {
    user = await usersLogic.getUserByID(owner);
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
      owner,
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
    const updatedItem = await itemsControllers.readOne({ _id: itemID }); // updateing diffrent variable in case that something occur in the middle of the updateing
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

    await itemsControllers.update(itemID, updateItem); // updateing the original object

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

  // res.status(200).json({ message: "Item deleted successfully." });
}

exports.getAllItems = getAllItems;
exports.getItemsByID = getItemsByID;
exports.getItemsByUserID = getItemsByUserID;
exports.createItem = createItem;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;
