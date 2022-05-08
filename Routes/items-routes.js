const express = require("express");
const { Error } = require("mongoose");

const HttpError = require("../DL/models/http-error");

const router = express.Router();

const itemsController = require("../DL/controllers/items-controllers");

router.get("/:itmID", itemsController.getItemByID);

router.get("/byuser/:Uid", itemsController.getItemsByUserID);

router.post("/", itemsController.createItem);

module.exports = router;
