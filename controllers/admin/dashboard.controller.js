module.exports.dashboard = (req, res) => {
  res.render("admin/pages/index", {
    pageTitle: "Tổng quan",
  });
};