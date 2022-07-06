const HttpError = require("../DL/models/httpError");
const { validationResult } = require("express-validator");
const usersControllers = require("../DL/controllers/usersControllers");

async function getAllUsers(req, res, next) {
  const allUsers = await usersControllers.read(req);
  return allUsers;
}

async function getUserByID(ID) {
  const user = await usersControllers.readOne({ Id: ID });
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
    const createdUser = await usersControllers.create({
      fName,
      lName,
      email,
      password,
      phone,
    });
    try {
      await createdUser.save();
      return createdUser;
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
  if (!identifiedUser || identifiedUser.password != password) {
    throw new HttpError("Incorrect username or password.", 401);
  } else {
    let succses = {
      message: `${identifiedUser.fName} ${identifiedUser.lName} logged in`,
    };
    return succses;
  }
}
exports.getAllUsers = getAllUsers;
exports.getUserByID = getUserByID;
exports.signUp = signUp;
exports.login = login;
