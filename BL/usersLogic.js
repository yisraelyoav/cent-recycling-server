const HttpError = require("../DL/models/httpError");
const uuid = require("uuid");
const { validationResult } = require("express-validator");

let DUMMY_USERS = [
  {
    fName: "yisrael",
    lName: "zelickovich",
    email: "test@test.com",
    password: "1212",
    id: "1",
  },
  {
    fName: "michal",
    lName: "zelickovich",
    email: "best@best.com",
    password: "2121",
    id: "2",
  },
];
async function getAllUsers(req, res, next) {
  res.status(200).json({ users: DUMMY_USERS });
}

async function createUser(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid input, please check your data", 422));
  } else {
    const { fName, lName, email, password } = req.body;
    const createUser = {
      id: uuid.v4(),
      fName,
      lName,
      email,
      password,
    };
    alreadyHasThatUser = DUMMY_USERS.find((u) => u.email === email);
    if (alreadyHasThatUser) {
      return next(
        new HttpError("This email already exists in the system", 422)
      );
    }

    DUMMY_USERS.push(createUser);
    res.status(201).json({ createUser });
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password != password) {
    return next(new HttpError("Incorrect username or password", 401));
  } else
    res.json({
      message: ` ${identifiedUser.fName} ${identifiedUser.lName} logged in!`,
    }); // dev
}
exports.getAllUsers = getAllUsers;
exports.createUser = createUser;
exports.login = login;
