const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const itemsController = require("../DL/controllers/items-controllers");

router.get("/", itemsController.getAllItems);

router.get("/:itmID", itemsController.getItemByID);

router.get("/byuser/:Uid", itemsController.getItemsByUserID);

router.post("/", itemsController.createItem);

router.patch(
  "/:itmID",
  check("title").not().isEmpty(),
  check("address").not().isEmpty(),
  itemsController.updateItem
);

router.delete("/:itmID", itemsController.deleteItem);

module.exports = router;
