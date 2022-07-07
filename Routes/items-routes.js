const express = require("express");
const { check } = require("express-validator");
const req = require("express/lib/request");
const res = require("express/lib/response");
const fileUpload = require("../Middleware/fileUpload");
const router = express.Router();

const itemsLogic = require("../BL/itemsLogic");
const checkAuth = require("../Middleware/checkAuth");
// get all items
router.get("/", async (req, res) => {
  try {
    let response = await itemsLogic.getAllItems(req);
    res.send(response).status(200);
  } catch (err) {
    return next(err);
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

router.use(checkAuth);
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
      res.send(await itemsLogic.createItem(req)).status(201);
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
