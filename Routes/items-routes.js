const express = require("express");
const { check } = require("express-validator");
const req = require("express/lib/request");
const res = require("express/lib/response");
const fileUpload = require("../Middleware/fileUpload");
const router = express.Router();

const itemsLogic = require("../BL/itemsLogic");
// get all items
router.get("/", async (req, res) => {
  let resu = await itemsLogic.getAllItems(req);
  res.send(resu);
  // } catch (err) {
  //   return next(err);
  // }
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
  fileUpload.single("image"),
  check("title").notEmpty(),
  check("address").notEmpty().isLength({ min: 2 }),
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
  check("address").notEmpty().isLength({ min: 2 }),
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
