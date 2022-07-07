const HttpError = require("../DL/models/httpError");
const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; //Because- authorization: 'bearer TOKEN'
    if (!token) {
      throw new Error("Authentication faield");
    }
    const decodedToken = jwt.verify(token, "אני_הרגתי_את_מופסה");
    req.userData = { userID: decodedToken.userID };
    next();
  } catch (err) {
    const errror = new HttpError("Authentication faield", 401);
    return next(error);
  }
};
