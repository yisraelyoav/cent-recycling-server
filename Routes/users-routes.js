const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const usersLogic = require("../BL/usersLogic");

router.get("/", usersLogic.getAllUsers);

router.post(
  "/signup",
  [
    check("fName").notEmpty().isAlpha("en-US", "-"),
    check("email").normalizeEmail().isEmail(),
    check("lName").notEmpty(),
    check("password").isLength({ min: 6 }),
  ],
  usersLogic.createUser
);

router.post("/login", usersLogic.login);

module.exports = router;
