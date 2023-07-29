const express = require("express");

const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.DB_COONECTION;
if (process.env.DB_COONECTION === "development") {
  const dotenv = require("dotenv");
  dotenv.config();
}

const todoHandler = require("./routerHandler/todoHandler");

const app = express();

app.use(express.json());

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });

app.use("/todo", todoHandler);

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
}
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("Server started at port: ", port);
});
