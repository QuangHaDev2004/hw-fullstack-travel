const Category = require("../../models/category.model");
const City = require("../../models/city.model");
const Tour = require("../../models/tour.model");
const AccountAdmin = require("../../models/account-admin.model");

const categoryHelper = require("../../helpers/category.helper");

const moment = require("moment");
const slugify = require("slugify");

module.exports.list = async (req, res) => {
  const find = {
    deleted: false,
  };

  // Lọc theo trạng thái
  if (req.query.status) {
    find.status = req.query.status;
  }

  // Lọc theo người tạo
  if (req.query.createdBy) {
    find.createdBy = req.query.createdBy;
  }

  // Lọc theo ngày tạo
  const dateFilter = {};
  if (req.query.startDate) {
    const startDate = moment(req.query.startDate).toDate();
    dateFilter.$gte = startDate;
  }
  if (req.query.endDate) {
    const endDate = moment(req.query.endDate).toDate();
    dateFilter.$lte = endDate;
  }
  if (Object.keys(dateFilter).length > 0) {
    find.createdAt = dateFilter;
  }

  // Tìm kiếm
  if (req.query.keyword) {
    const keyword = slugify(req.query.keyword);
    const keywordRegex = new RegExp(keyword, "i");
    find.slug = keywordRegex;
  }

  // Phân trang
  const limitItems = 4;
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
  };

  const tourList = await Tour.find(find)
    .sort({
      position: "desc",
    })
    .limit(limitItems)
    .skip(skip);

  for (const item of tourList) {
    if (item.createdBy) {
      const infoAccount = await AccountAdmin.findOne({
        _id: item.createdBy,
      });

      if (infoAccount) {
        item.createdByFullName = infoAccount.fullName;
      }
    }

    if (item.updatedBy) {
      const infoAccount = await AccountAdmin.findOne({
        _id: item.updatedBy,
      });

      if (infoAccount) {
        item.updatedByFullName = infoAccount.fullName;
      }
    }

    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
    item.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YYYY");
  }

  // Danh sách tài khoản quản trị
  const accountAdminList = await AccountAdmin.find({});

  res.render("admin/pages/tour-list", {
    pageTitle: "Quản lý tour",
    tourList: tourList,
    accountAdminList: accountAdminList,
    pagination: pagination,
  });
};

module.exports.create = async (req, res) => {
  const categoryList = await Category.find({
    deleted: false,
  });

  const categoryTree = categoryHelper.buildCategoryTree(categoryList, "");

  const cityList = await City.find({});

  res.render("admin/pages/tour-create", {
    pageTitle: "Tạo tour",
    categoryList: categoryTree,
    cityList: cityList,
  });
};

module.exports.createPost = async (req, res) => {
  if (!req.permissions.includes("tour-create")) {
    res.json({
      code: "error",
      message: "Không có quyền!",
    });
    return;
  }

  if (req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    const totalRecord = await Tour.countDocuments({});
    req.body.position = totalRecord + 1;
  }

  req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult) : 0;
  req.body.priceChildren = req.body.priceChildren
    ? parseInt(req.body.priceChildren)
    : 0;
  req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;

  req.body.priceNewAdult = req.body.priceNewAdult
    ? parseInt(req.body.priceNewAdult)
    : req.body.priceAdult;
  req.body.priceNewChildren = req.body.priceNewChildren
    ? parseInt(req.body.priceNewChildren)
    : req.body.priceChildren;
  req.body.priceNewBaby = req.body.priceNewBaby
    ? parseInt(req.body.priceNewBaby)
    : req.body.priceBaby;

  if (
    req.body.priceAdult <= req.body.priceNewAdult ||
    req.body.priceChildren <= req.body.priceNewChildren ||
    req.body.priceBaby <= req.body.priceNewBaby
  ) {
    res.json({
      code: "error",
      message: "Giá mới phải nhỏ hơn giá cũ!",
    });
    return;
  }

  req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0;
  req.body.stockChildren = req.body.stockChildren
    ? parseInt(req.body.stockChildren)
    : 0;
  req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;

  req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
  req.body.departureDate = req.body.departureDate
    ? new Date(req.body.departureDate)
    : null;
  req.body.schedules = req.body.schedules ? JSON.parse(req.body.schedules) : [];

  req.body.createdBy = req.account.id;
  req.body.updatedBy = req.account.id;
  req.body.avatar = req.file ? req.file.path : "";

  const newRecord = new Tour(req.body);
  await newRecord.save();

  res.json({
    code: "success",
    message: "Tạo tour thành công!",
  });
};

module.exports.edit = async (req, res) => {
  try {
    const { id } = req.params;

    const tourDetail = await Tour.findOne({
      _id: id,
      deleted: false,
    });

    if (tourDetail.departureDate) {
      tourDetail.departureDateFormat = moment(tourDetail.departureDate).format(
        "YYYY-MM-DD"
      );
    }

    const categoryList = await Category.find({
      deleted: false,
    });

    const categoryTree = categoryHelper.buildCategoryTree(categoryList, "");

    const cityList = await City.find({});

    res.render("admin/pages/tour-edit", {
      pageTitle: "Chỉnh sửa tour",
      categoryList: categoryTree,
      cityList: cityList,
      tourDetail: tourDetail,
    });
  } catch (error) {
    res.redirect(`/${pathAdmin}/tour/list`);
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    if (!req.permissions.includes("tour-edit")) {
      res.json({
        code: "error",
        message: "Không có quyền!",
      });
      return;
    }

    const { id } = req.params;

    if (req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const totalRecord = await Tour.countDocuments({});
      req.body.position = totalRecord + 1;
    }

    req.body.priceAdult = req.body.priceAdult
      ? parseInt(req.body.priceAdult)
      : 0;
    req.body.priceChildren = req.body.priceChildren
      ? parseInt(req.body.priceChildren)
      : 0;
    req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;

    req.body.priceNewAdult = req.body.priceNewAdult
      ? parseInt(req.body.priceNewAdult)
      : req.body.priceAdult;
    req.body.priceNewChildren = req.body.priceNewChildren
      ? parseInt(req.body.priceNewChildren)
      : req.body.priceChildren;
    req.body.priceNewBaby = req.body.priceNewBaby
      ? parseInt(req.body.priceNewBaby)
      : req.body.priceBaby;

    if (
      req.body.priceAdult <= req.body.priceNewAdult ||
      req.body.priceChildren <= req.body.priceNewChildren ||
      req.body.priceBaby <= req.body.priceNewBaby
    ) {
      res.json({
        code: "error",
        message: "Giá mới phải nhỏ hơn giá cũ!",
      });
      return;
    }

    req.body.stockAdult = req.body.stockAdult
      ? parseInt(req.body.stockAdult)
      : 0;
    req.body.stockChildren = req.body.stockChildren
      ? parseInt(req.body.stockChildren)
      : 0;
    req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;

    req.body.locations = req.body.locations
      ? JSON.parse(req.body.locations)
      : [];
    req.body.departureDate = req.body.departureDate
      ? new Date(req.body.departureDate)
      : null;
    req.body.schedules = req.body.schedules
      ? JSON.parse(req.body.schedules)
      : [];

    req.body.updatedBy = req.account.id;
    if (req.file) {
      req.body.avatar = req.file.path;
    } else {
      delete req.body.avatar;
    }

    await Tour.updateOne(
      {
        _id: id,
        deleted: false,
      },
      req.body
    );

    res.json({
      code: "success",
      message: "Cập nhật tour thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Bản ghi không hợp lệ!",
    });
  }
};

module.exports.deletePatch = async (req, res) => {
  try {
    if (!req.permissions.includes("tour-delete")) {
      res.json({
        code: "error",
        message: "Không có quyền!",
      });
      return;
    }

    const { id } = req.params;

    await Tour.updateOne(
      {
        _id: id,
      },
      {
        deleted: true,
        deletedBy: req.account.id,
        deletedAt: Date.now(),
      }
    );

    res.json({
      code: "success",
      message: "Xóa tour thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Bản ghi không hợp lệ!",
    });
  }
};

module.exports.trash = async (req, res) => {
  const find = {
    deleted: true,
  };

  // Lọc theo trạng thái
  if (req.query.status) {
    find.status = req.query.status;
  }

  // Lọc theo người tạo
  if (req.query.createdBy) {
    find.createdBy = req.query.createdBy;
  }

  // Lọc theo ngày tạo
  const dateFilter = {};
  if (req.query.startDate) {
    const startDate = moment(req.query.startDate).toDate();
    dateFilter.$gte = startDate;
  }
  if (req.query.endDate) {
    const endDate = moment(req.query.endDate).toDate();
    dateFilter.$lte = endDate;
  }
  if (Object.keys(dateFilter).length > 0) {
    find.createdAt = dateFilter;
  }

  // Tìm kiếm
  if (req.query.keyword) {
    const keyword = slugify(req.query.keyword);
    const keywordRegex = new RegExp(keyword, "i");
    find.slug = keywordRegex;
  }

  // Phân trang
  const limitItems = 4;
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
  };

  const tourList = await Tour.find(find)
    .sort({
      position: "desc",
    })
    .limit(limitItems)
    .skip(skip);

  for (const item of tourList) {
    if (item.createdBy) {
      const infoAccount = await AccountAdmin.findOne({
        _id: item.createdBy,
      });

      if (infoAccount) {
        item.createdByFullName = infoAccount.fullName;
      }
    }

    if (item.deletedBy) {
      const infoAccount = await AccountAdmin.findOne({
        _id: item.deletedBy,
      });

      if (infoAccount) {
        item.deletedByFullName = infoAccount.fullName;
      }
    }

    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
    item.deletedAtFormat = moment(item.deletedAt).format("HH:mm - DD/MM/YYYY");
  }

  // Danh sách tài khoản quản trị
  const accountAdminList = await AccountAdmin.find({});

  res.render("admin/pages/tour-trash", {
    pageTitle: "Thùng rác tour",
    tourList: tourList,
    accountAdminList: accountAdminList,
    pagination: pagination,
  });
};

module.exports.undoPatch = async (req, res) => {
  try {
    if (!req.permissions.includes("tour-trash")) {
      res.json({
        code: "error",
        message: "Không có quyền!",
      });
      return;
    }

    const { id } = req.params;

    await Tour.updateOne(
      {
        _id: id,
      },
      {
        deleted: false,
      }
    );

    res.json({
      code: "success",
      message: "Khôi phục tour thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Bản ghi không hợp lệ!",
    });
  }
};

module.exports.destroyDelete = async (req, res) => {
  try {
    if (!req.permissions.includes("tour-trash")) {
      res.json({
        code: "error",
        message: "Không có quyền!",
      });
      return;
    }

    const { id } = req.params;

    await Tour.deleteOne({
      _id: id,
    });

    res.json({
      code: "success",
      message: "Đã xóa vĩnh viễn!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Bản ghi không hợp lệ!",
    });
  }
};

module.exports.changeMultiPatch = async (req, res) => {
  try {
    const { option, ids } = req.body;

    switch (option) {
      case "active":
      case "inactive":
        if (!req.permissions.includes("tour-edit")) {
          res.json({
            code: "error",
            message: "Không có quyền!",
          });
          return;
        }

        await Tour.updateMany(
          {
            _id: { $in: ids },
          },
          {
            status: option,
          }
        );
        res.json({
          code: "success",
          message: "Cập nhật trạng thái thành công!",
        });
        break;

      case "undo":
        if (!req.permissions.includes("tour-trash")) {
          res.json({
            code: "error",
            message: "Không có quyền!",
          });
          return;
        }

        await Tour.updateMany(
          {
            _id: { $in: ids },
          },
          {
            deleted: false,
          }
        );
        res.json({
          code: "success",
          message: "Khôi phục tour thành công!",
        });
        break;

      case "delete":
        if (!req.permissions.includes("tour-delete")) {
          res.json({
            code: "error",
            message: "Không có quyền!",
          });
          return;
        }

        await Tour.updateMany(
          {
            _id: { $in: ids },
          },
          {
            deleted: true,
            deletedBy: req.account.id,
            deletedAt: Date.now(),
          }
        );
        res.json({
          code: "success",
          message: "Đã xóa thành công!",
        });
        break;

      case "destroy":
        if (!req.permissions.includes("tour-trash")) {
          res.json({
            code: "error",
            message: "Không có quyền!",
          });
          return;
        }

        await Tour.deleteMany({
          _id: { $in: ids },
        });
        res.json({
          code: "success",
          message: "Đã xóa vĩnh viễn!!",
        });
        break;

      default:
        res.json({
          code: "error",
          message: "Hành động không hợp lệ!",
        });
        break;
    }
  } catch (error) {
    res.json({
      code: "error",
      message: "Bản ghi không hợp lệ!",
    });
  }
};
