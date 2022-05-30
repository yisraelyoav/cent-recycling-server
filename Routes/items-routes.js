const express = require("express");
const { check } = require("express-validator");
const req = require("express/lib/request");
const res = require("express/lib/response");

const router = express.Router();

const itemsLogic = require("../BL/itemsLogic");
// get all items
router.get("/", async (req, res) => {
  try {
    res.send(await itemsLogic.getAllItems());
  } catch (err) {
    res.send(err);
  }
});
// get item by id
router.get("/:itmID", async (req, res, next) => {
  try {
    res.send(await itemsLogic.getItemByID(req));
  } catch (err) {
    return next(err);
  }
});
// get items by user id
router.get("/byuser/:Uid", async (req, res, next) => {
  try {
    res.send(await itemsLogic.getItemsByUserID(req));
  } catch (err) {
    return next(err);
  }
});

// create new item
router.post(
  "/",
  check("title").notEmpty(),
  check("address").notEmpty(),
  async (req, res, next) => {
    try {
      res.send(await itemsLogic.createItem(req.body)).status(201);
    } catch (err) {
      return next(err);
    }
  }
);
// update item
router.patch(
  "/:itmID",
  check("title").notEmpty(),
  check("address").notEmpty(),
  itemsLogic.updateItem
);
// delete item
router.delete("/:itmID", async (req, res, next) => {
  try {
    res.send(await itemsLogic.deleteItem(req));
  } catch (err) {
    return next(err);
  }
});
module.exports = router;
