const Category = require("../../models/category.model");

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

  res.render("client/pages/tour-list", {
    pageTitle: categoryDetail.name,
    breadcrumb: breadcrumb,
  });
};
