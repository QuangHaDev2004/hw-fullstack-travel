const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const clientRoutes = require("./routes/client/index.route");
require("dotenv").config();
const app = express();
const port = 3000;

mongoose.connect(process.env.DATABASE);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));

app.use("/", clientRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
