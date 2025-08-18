const Tour = require("../../models/tour.model");

module.exports.list = async (req, res) => {
  const tourList = await Tour.find({});

  res.render("client/pages/tour-list", {
    pageTitle: "Danh sach tour",
    tourList: tourList,
  });
}