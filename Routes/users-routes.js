const express = require("express");

const router = express.Router();

const usersController = require("../DL/controllers/users-conttrolers");

router.get("/", usersController.getAllUsers);

router.post("/signup", usersController.createUser);

router.post("/login", usersController.login);

module.exports = router;
