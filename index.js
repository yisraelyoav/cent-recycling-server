require("dotenv").config();

const fs = require("fs");
const path = require("path");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const itemsRouter = require("./Routes/items-routes");
const usersRouter = require("./Routes/users-routes");
const HttpError = require("./DL/models/httpError");

const app = express();
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/items", itemsRouter);
app.use("/api/users", usersRouter);

app.use("/uploads/images", express.static(__dirname + "/uploads/images"));

app.use((req, res, next) => {
  const error = new HttpError("could not find this route", 404);
  throw error;
});

// error handeling middleware
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred!" });
});

const mongo_url = process.env.MONGO_URL;
mongoose
  .connect(mongo_url)
  .then(() => {
    app.listen(5000);
    console.log("server is listening");
  })
  .catch((err) => console.log(err));
