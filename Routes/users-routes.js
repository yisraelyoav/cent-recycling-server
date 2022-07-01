const express = require("express");
const { check } = require("express-validator");
const req = require("express/lib/request");
const res = require("express/lib/response");

const router = express.Router();

const usersLogic = require("../BL/usersLogic");

router.get("/", async (req, res, next) => {
  try {
    res.send(await usersLogic.getAllUsers());
  } catch (err) {
    return next(err);
  }
});

router.post(
  "/signup",
  check("fName").notEmpty().isAlpha("en-US", "-"),
  check("email").normalizeEmail().isEmail(),
  check("lName").notEmpty().isAlpha("en-US", "-"),
  check("password").isLength({ min: 6 }),

  async (req, res, next) => {
    try {
      res.send(await usersLogic.signUp(req.body)).status(201);
    } catch (err) {
      return next(err);
    }
  }
);

router.post(
  "/login",
  check("email").normalizeEmail().isEmail(),
  check("password").isLength({ min: 6 }),

  async (req, res, next) => {
    try {
      res.send(await usersLogic.login(req.body)).status(200);
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
