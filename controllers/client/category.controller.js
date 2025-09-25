const Category = require("../../models/category.model");
const Tour = require("../../models/tour.model");
const City = require("../../models/city.model");

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

  // Sắp xếp theo tiêu chí
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }

  // Danh sách Tour theo danh mục
  const categoryId = categoryDetail.id;
  const categoryChild = await categoryHelper.getCategoryChild(categoryId);
  const categoryChildId = categoryChild.map((item) => item.id);

  let find = {
    category: {
      $in: [categoryId, ...categoryChildId],
    },
    deleted: false,
    status: "active",
  };

  // Phân trang
  const limitItems = 6;
  let page = 1;
  if (req.query.page && parseInt(req.query.page) > 0) {
    page = parseInt(req.query.page);
  }
  const skip = (page - 1) * limitItems;
  const totalRecord = await Tour.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limitItems);
  const pagination = {
    skip: skip,
    totalRecord: totalRecord,
    totalPage: totalPage,
    currentPage: page,
  };

  const tourList = await Tour.find(find)
    .sort(sort)
    .limit(limitItems)
    .skip(skip);

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

  // Danh sách thành phố
  const cityList = await City.find({}).sort({ name: "asc" });

  res.render("client/pages/tour-list", {
    pageTitle: categoryDetail.name,
    breadcrumb: breadcrumb,
    categoryDetail: categoryDetail,
    tourList: tourList,
    cityList: cityList,
    pagination: pagination,
  });
};
