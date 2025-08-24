const mongoose = require("mongoose");

const AccountAdmin = mongoose.model(
  "AccountAdmin",
  {
    fullName: String,
    email: String,
    password: String,
    status: String, // initial, active, inactive
  },
  "accounts-admin"
);

module.exports = AccountAdmin;
