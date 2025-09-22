const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  dataSection4: String,
  dataSection6: String,
});

const Template = mongoose.model("Template", schema, "templates");

module.exports = Template;
