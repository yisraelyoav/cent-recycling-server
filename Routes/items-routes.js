const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const itemsLogic = require("../BL/itemsLogic");

router.get("/", async (req, res) => {
  try {
    console.log("items router");
    res.send(await itemsLogic.getAllItems());
  } catch (err) {
    res.send(err);
  }
});

router.get("/:itmID", itemsLogic.getItemByID);

router.get("/byuser/:Uid", itemsLogic.getItemsByUserID);

router.post(
  "/",
  check("title").notEmpty(),
  check("address").notEmpty(),
  itemsLogic.createItem
);

router.patch(
  "/:itmID",
  check("title").notEmpty(),
  check("address").notEmpty(),
  itemsLogic.updateItem
);

router.delete("/:itmID", itemsLogic.deleteItem);

module.exports = router;
