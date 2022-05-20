const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const itemsController = require("../DL/controllers/items-controllers");

router.get("/", itemsController.getAllItems);

router.get("/:itmID", itemsController.getItemByID);

router.get("/byuser/:Uid", itemsController.getItemsByUserID);

router.post(
  "/",
  check("title").notEmpty(),
  check("address").notEmpty(),
  itemsController.createItem
);

router.patch(
  "/:itmID",
  check("title").notEmpty(),
  check("address").notEmpty(),
  itemsController.updateItem
);

router.delete("/:itmID", itemsController.deleteItem);

module.exports = router;
