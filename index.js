const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("client/pages/home", {
    pageTitle: "Trang chu",
  });
});

app.get("/tours", (req, res) => {
  res.render("client/pages/tour-list", {
    pageTitle: "Danh sach tour",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
