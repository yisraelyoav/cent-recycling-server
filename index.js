const express = require("express");
const bodyParser = require("body-parser");

const itemsRouter = require("./Routes/items-routes");
const usersRouter = require("./Routes/users-routes");
const HttpError = require("./DL/models/http-error");

const app = express();
app.use(bodyParser.json());

app.use("/api/items", itemsRouter);
app.use("/api/users", usersRouter);

app.use((req, res, next) => {
  const error = new HttpError("could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  // error handeling middleware
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknoen error occurred!" });
});

app.listen(5000);
