const HttpError = require("../DL/models/httpError");
const { validationResult } = require("express-validator");
const usersControllers = require("../DL/controllers/usersControllers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
async function getAllUsers(req, res, next) {
  const allUsers = await usersControllers.read(req);
  return allUsers;
}

async function getUserByID(ID) {
  const user = await usersControllers.readOne({ _id: ID });
  if (!user) {
    throw new HttpError("somthing went wrong,try again", 500);
  } else {
    return user;
  }
}

async function signUp(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new HttpError("Invalid input, please check your data.", 422);
    throw error;
  }
  const { fName, lName, email, password, phone } = req;
  let exsitingUser;
  exsitingUser = await usersControllers.readOne({ email: email });
  if (!exsitingUser) {
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      throw new HttpError("Try signUp failed, please try again.", 500);
    }
    const createdUser = await usersControllers.create({
      fName,
      lName,
      email,
      password: hashedPassword,
      phone,
    });
    try {
      await createdUser.save();
      let token;
      try {
        token = jwt.sign(
          {
            userID: createdUser.id,
            fName: createdUser.fName,
            lName: createdUser.lName,
          },
          "אני_הרגתי_את_מופסה",
          { expiresIn: 60 * 30 } //30 minutes
        );
      } catch (err) {
        throw new HttpError("Try signUp failed, please try again.", 500);
      }

      return { userID: createdUser.id, token: token, fName: createdUser.fName };
    } catch (err) {
      const error = new HttpError("Try signUp failed, please try again.", 500);
      throw error;
    }
  } else {
    const error = new HttpError(
      "This email already exists in the system, try to login. ",
      422
    );
    throw error;
  }
}

async function login(req, res, next) {
  const { email, password } = req;
  const identifiedUser = await usersControllers.readOne({ email: email });
  if (!identifiedUser) {
    throw new HttpError("Incorrect username or password.", 401);
  } else {
    let isCorrecstPassword = false;
    try {
      isCorrecstPassword = await bcrypt.compare(
        password,
        identifiedUser.password
      );
    } catch (err) {
      const error = new HttpError("Incorrect username or password.", 401);
      return next(error);
    }
    if (!isCorrecstPassword) {
      throw new HttpError("Incorrect username or password.", 401);
    }
    let token;
    try {
      token = jwt.sign(
        {
          userID: identifiedUser.id,
          fName: identifiedUser.fName,
          lName: identifiedUser.lName,
        },
        "אני_הרגתי_את_מופסה",
        { expiresIn: 60 * 30 } //30 minutes
      );
    } catch (err) {}
    return {
      userID: identifiedUser.id,
      token: token,
      fName: identifiedUser.fName,
    };
  }
}
exports.getAllUsers = getAllUsers;
exports.getUserByID = getUserByID;
exports.signUp = signUp;
exports.login = login;
