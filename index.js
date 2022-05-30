require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const itemsRouter = require("./Routes/items-routes");
const usersRouter = require("./Routes/users-routes");
const HttpError = require("./DL/models/httpError");

const app = express();
app.use(bodyParser.json());

app.use("/api/items", itemsRouter);
app.use("/api/users", usersRouter);

// app.use((req, res, next) => {
//   const error = new HttpError("could not find this route", 404);
//   throw error;
// });

// error handeling middleware

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknoen error occurred!" });
});

const mongo_url = process.env.MONGO_URL;
mongoose
  .connect(mongo_url)
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));
