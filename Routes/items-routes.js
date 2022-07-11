const express = require("express");
const { check } = require("express-validator");
const req = require("express/lib/request");
const res = require("express/lib/response");
const fileUpload = require("../Middleware/fileUpload");
const router = express.Router();

const itemsLogic = require("../BL/itemsLogic");
const checkAuth = require("../Middleware/checkAuth");

router.get("/", async (req, res, next) => {
  try {
    let response = await itemsLogic.getAllItemsPopulated(req, res, next);
    res.send(response).status(200);
  } catch (err) {
    return next(err);
  }
});

router.use(checkAuth);

router.get("/:itmID", async (req, res, next) => {
  try {
    res.send(await itemsLogic.getItemByID(req));
  } catch (err) {
    return next(err);
  }
});

router.get("/byuser/:Uid", async (req, res, next) => {
  try {
    res.send(await itemsLogic.getItemsPopulatedByUserID(req));
  } catch (err) {
    return next(err);
  }
});

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

router.patch(
  "/:itmID",
  check("title").notEmpty(),
  check("address").notEmpty().isLength({ min: 2 }),
  itemsLogic.updateItem
);

router.delete("/:itmID", async (req, res, next) => {
  try {
    res.json(await itemsLogic.deleteItem(req)).status(200);
  } catch (err) {
    return next(err);
  }
});
module.exports = router;
