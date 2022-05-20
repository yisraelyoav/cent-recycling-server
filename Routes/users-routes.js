const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const usersController = require("../DL/controllers/users-controllers");

router.get("/", usersController.getAllUsers);

router.post(
  "/signup",
  [
    check("fName").notEmpty().isAlpha("en-US", "-"),
    check("email").normalizeEmail().isEmail(),
    check("lName").notEmpty(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.createUser
);

router.post("/login", usersController.login);

module.exports = router;
