const HttpError = require("../models/http-error");
const uuid = require("uuid");
let DUMMY_ITEMS = [
  {
    id: "i1",
    title: "tessla",
    description: "tessla model x",
    location: {
      lat: 32.0504941,
      lng: 35.345551,
    },
    adress: "kida",
    owner: "u1",
  },
  {
    id: "i2",
    title: "action figures set",
    description: "Avengers Endgame set collection",
    location: {
      lat: 32.0504941,
      lng: 35.345551,
    },
    address: "East kida",
    owner: "u2",
  },
  {
    id: "i4",
    title: "gum",
    description: "orbit gum",
    location: {
      lat: 32.0504941,
      lng: 35.345551,
    },
    adress: "trash",
    owner: "u1",
  },
];

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
  const { title, image, description, coordinates, address, owner } = req.body;

  const createItem = {
    id: uuid.v4(),
    title,
    image,
    description,
    location: coordinates,
    address,
    owner,
  };
  DUMMY_ITEMS.unshift(createItem);

  res.status(201).json({ item: createItem });
}

async function updateItem(req, res, next) {
  const { title, image, description, coordinates, address } = req.body;
  const itemID = req.params.itmID;

  const updatedItem = { ...DUMMY_ITEMS.find((i) => i.id === itemID) }; // updateing diffrent variable in case that something occur in the middle of the updateing
  const itemIndex = DUMMY_ITEMS.findIndex((i) => i.id === itemID);
  updatedItem.title = title;
  updatedItem.description = description;
  updatedItem.image = image;
  updatedItem.coordinates = coordinates;
  updatedItem.address = address;

  DUMMY_ITEMS[itemIndex] = updatedItem; // updateing the original object

  res.status(200).json({ item: updatedItem });
}

async function deleteItem(req, res, next) {
  itemID = req.params.itmID;
  DUMMY_ITEMS = DUMMY_ITEMS.filter((i) => i.id != itemID);
  res.status(200).json({ message: "Item deleted successfully." });
}

exports.getItemByID = getItemByID;
exports.getItemsByUserID = getItemsByUserID;
exports.createItem = createItem;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;
