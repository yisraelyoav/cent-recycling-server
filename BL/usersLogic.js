const HttpError = require("../DL/models/httpError");
const { validationResult } = require("express-validator");
const usersControllers = require("../DL/controllers/usersControllers");

// get all users
async function getAllUsers(req, res, next) {
  const allUsers = await usersControllers.read(req);
  return allUsers;
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
      console.log(createdUser);
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
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password != password) {
    return next(new HttpError("Incorrect username or password.", 401));
  } else
    res.json({
      message: ` ${identifiedUser.fName} ${identifiedUser.lName} logged in!`,
    }); // dev
}
exports.getAllUsers = getAllUsers;
exports.signUp = signUp;
exports.login = login;
