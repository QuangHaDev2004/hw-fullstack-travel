const Category = require("../../models/category.model");
const categoryHelper = require("../../helpers/category.helper");
const Template = require("../../models/template.model");

module.exports.edit = async (req, res) => {
  const categoryList = await Category.find({
    deleted: false,
  });

  const categoryTree = categoryHelper.buildCategoryTree(categoryList, "");

  const templateDetail = await Template.findOne({});

  res.render("admin/pages/template", {
    pageTitle: "Cài đặt giao diện",
    categoryList: categoryTree,
    templateDetail: templateDetail
  });
};

module.exports.editPatch = async (req, res) => {
  const template = await Template.findOne({});
  if (!template) {
    const newRecord = new Template(req.body);
    await newRecord.save();
  } else {
    await Template.updateOne(
      {
        _id: template.id,
      },
      req.body
    );
  }

  res.json({
    code: "success",
    message: "Cập nhật thành công!",
  });
};
