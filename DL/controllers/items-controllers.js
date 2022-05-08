const HttpError = require("../models/http-error");

const DUMMY_ITEMS = [
  {
    id: "i2",
    title: "tessla",
    description: "tessla model x",
    location: {
      lat: 32.0504941,
      lng: 35.345551,
    },
    adress: "kida",
    creator: "u1",
  },
  {
    id: "i1",
    title: "car",
    description: "tessla model x",
    location: {
      lat: 32.0504941,
      lng: 35.345551,
    },
    adress: "kida",
    creator: "u2",
  },
];

async function getItemByID(req, res, next) {
  const itemID = req.params.itmID;
  const item = DUMMY_ITEMS.find((i) => {
    return i.id === itemID;
  });
  if (!item) {
    return next(
      new HttpError("Could not find a an item for the provided id", 404)
    );
  } else {
    res.json({ item });
  }
}

async function getItemsByUserID(req, res, next) {
  const itemByUserID = req.params.Uid;
  const item = DUMMY_ITEMS.find((i) => {
    return i.creator === itemByUserID;
  });
  if (!item) {
    return next(
      new HttpError("Could not find a an item for the provided user id", 404)
    );
  } else {
    res.json({ item });
  }
}

async function createItem(req, res, next) {
  const { title, image, description } = req.body;
}

exports.getItemByID = getItemByID;
exports.getItemsByUserID = getItemsByUserID;
exports.createItem = createItem;
