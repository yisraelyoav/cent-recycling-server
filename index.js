const express = require("express");
const bodyParser = require("body-parser");

const itemsRouter = require("./Routes/items-routes");
const { Error } = require("mongoose");

const app = express();
app.use(bodyParser.json());

app.use("/api/items", itemsRouter);

app.use((error, req, res, next) => {
  // error handeling middleware
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknoen error occurred!" });
});

app.listen(5000);
