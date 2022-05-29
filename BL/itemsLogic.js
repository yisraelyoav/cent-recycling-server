const HttpError = require("../DL/models/httpError");
// const uuid = require("uuid");
const { validationResult } = require("express-validator");
const getCoordinatesForAddress = require("../util/location");
const items = require("../DL/controllers/itemsControllers");
// let DUMMY_ITEMS = [

//   {
//     title: "gum",
//     description: "orbit gum",
//     location: {
//       lat: 32.0504941,
//       lng: 35.345551,
//     },
//     address: "trash",
//     owner: "u1",
//   },
// ];

async function getAllItems(req, res, next) {
  const allItems = await items.read();
  console.log(allItems);
  return allItems;
}

async function getItemByID(req, res, next) {
  const itemID = req.params.itmID;
  const item = DUMMY_ITEMS.find((i) => {
    return i.id === itemID;
  });
  if (!item) {
    return next(
      new HttpError("Could not find a an item for the provided id.", 404)
    );
  } else {
    res.json({ item });
  }
}

async function getItemsByUserID(req, res, next) {
  const itemsByUserID = req.params.Uid;
  const items = DUMMY_ITEMS.filter((i) => {
    return i.owner === itemsByUserID;
  });
  if (items.length === 0) {
    return next(
      new HttpError("Could not find a an items for the provided user id.", 404)
    );
  } else {
    res.json({ items });
  }
}

async function createItem(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid input, please check your data", 422));
  }
  const { title, image, description, address, owner } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordinatesForAddress(address);
  } catch (error) {
    return next(error);
  }
  const createdItem = new items({
    title,
    image,
    description,
    address,
    location: coordinates,
    owner,
  });
  try {
    await createdItem.save();
  } catch (err) {
    const error = new HttpError(
      "Creating new item failed, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ item: createdItem });
}

async function updateItem(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input, please check your data", 422));
  } else {
    const { title, image, description, address } = req.body;
    const itemID = req.params.itmID;

    const updatedItem = { ...DUMMY_ITEMS.find((i) => i.id === itemID) }; // updateing diffrent variable in case that something occur in the middle of the updateing
    const itemIndex = DUMMY_ITEMS.findIndex((i) => i.id === itemID);
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

    DUMMY_ITEMS[itemIndex] = updatedItem; // updateing the original object

    res.status(200).json({ item: updatedItem });
  }
}

async function deleteItem(req, res, next) {
  const itemID = req.params.itmID;
  if (!DUMMY_ITEMS.find((i) => i.id === itemID)) {
    return next(new HttpError("Could not find an item for that ID", 404));
  }
  DUMMY_ITEMS = DUMMY_ITEMS.filter((i) => i.id != itemID);
  res.status(200).json({ message: "Item deleted successfully." });
}

exports.getAllItems = getAllItems;
exports.getItemByID = getItemByID;
exports.getItemsByUserID = getItemsByUserID;
exports.createItem = createItem;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;
