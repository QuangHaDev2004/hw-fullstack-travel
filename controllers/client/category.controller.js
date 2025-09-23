const Category = require("../../models/category.model");
const Tour = require("../../models/tour.model");

const moment = require("moment");
const categoryHelper = require("../../helpers/category.helper");

module.exports.list = async (req, res) => {
  const slug = req.params.slug;

  const categoryDetail = await Category.findOne({
    slug: slug,
    deleted: false,
    status: "active",
  });

  if (!categoryDetail) {
    res.redirect("/");
    return;
  }

  // Breadcrumb
  const breadcrumb = [];
  if (categoryDetail.parent) {
    const categoryParent = await Category.findOne({
      _id: categoryDetail.parent,
      deleted: false,
      status: "active",
    });

    if (categoryParent) {
      breadcrumb.push({
        name: categoryParent.name,
        slug: categoryParent.slug,
        avatar: categoryParent.avatar,
      });
    }
  }

  breadcrumb.push({
    name: categoryDetail.name,
    slug: categoryDetail.slug,
    avatar: categoryDetail.avatar,
  });

  // Danh sách Tour theo danh mục
  const categoryId = categoryDetail.id;
  const categoryChild = await categoryHelper.getCategoryChild(categoryId);
  const categoryChildId = categoryChild.map((item) => item.id);

  const tourList = await Tour.find({
    category: {
      $in: [categoryId, ...categoryChildId],
    },
    deleted: false,
    status: "active",
  }).sort({
    position: "desc",
  });

  for (const item of tourList) {
    item.discount = Math.floor(
      ((item.priceAdult - item.priceNewAdult) / item.priceAdult) * 100
    );
    if (item.departureDate) {
      item.departureDateFormat = moment(item.departureDate).format(
        "DD/MM/YYYY"
      );
    }
  }
  // Hết Danh sách Tour theo danh mục

  res.render("client/pages/tour-list", {
    pageTitle: categoryDetail.name,
    breadcrumb: breadcrumb,
    categoryDetail: categoryDetail,
    tourList: tourList,
  });
};
