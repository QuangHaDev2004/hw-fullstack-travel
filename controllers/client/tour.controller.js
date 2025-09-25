const Category = require("../../models/category.model");
const City = require("../../models/city.model");
const Tour = require("../../models/tour.model");

const moment = require("moment");

module.exports.detail = async (req, res) => {
  const slug = req.params.slug;

  const tourDetail = await Tour.findOne({
    slug: slug,
    deleted: false,
    status: "active",
  });

  if (!tourDetail) {
    res.redirect("/");
    return;
  }

  // Breadcrumb
  const breadcrumb = [];
  if (tourDetail.category) {
    const category = await Category.findOne({
      _id: tourDetail.category,
      deleted: false,
      status: "active",
    });

    if (category) {
      breadcrumb.push({
        name: category.name,
        slug: category.slug,
        avatar: category.avatar,
      });
    }
  }

  breadcrumb.push({
    name: tourDetail.name,
    slug: tourDetail.slug,
    avatar: tourDetail.avatar,
  });

  // Format dữ liệu
  if (tourDetail.departureDate) {
    tourDetail.departureDateFormat = moment(tourDetail.departureDate).format(
      "DD/MM/YYYY"
    );
  }

  if (tourDetail.locations.length > 0) {
    tourDetail.locationsDetail = await City.find({
      _id: { $in: tourDetail.locations },
    });
  }

  res.render("client/pages/tour-detail", {
    pageTitle: tourDetail.name,
    breadcrumb: breadcrumb,
    tourDetail: tourDetail,
  });
};
