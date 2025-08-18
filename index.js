const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
require('dotenv').config()
const app = express();
const port = 3000;

mongoose.connect(process.env.DATABASE);

const Tour = mongoose.model("Tour", { name: String, vehicle: String }, "tours");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("client/pages/home", {
    pageTitle: "Trang chu",
  });
});

app.get("/tours", async (req, res) => {
  const tourList = await Tour.find({});

  res.render("client/pages/tour-list", {
    pageTitle: "Danh sach tour",
    tourList: tourList
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
