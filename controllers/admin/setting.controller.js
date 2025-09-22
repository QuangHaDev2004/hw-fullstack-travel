const SettingWebsiteInfo = require("../../models/setting-website-info.model");
const Role = require("../../models/role.model");
const AccountAdmin = require("../../models/account-admin.model");

const { permissionList } = require("../../config/variable.config");

const bcrypt = require("bcryptjs");
const slugify = require("slugify");
const moment = require("moment");

module.exports.list = (req, res) => {
  res.render("admin/pages/setting-list", {
    pageTitle: "Cài đặt chung",
  });
};

module.exports.websiteInfo = async (req, res) => {
  const settingWebsiteInfo = await SettingWebsiteInfo.findOne({});

  res.render("admin/pages/website-info", {
    pageTitle: "Thông tin website",
    settingWebsiteInfo: settingWebsiteInfo,
  });
};

module.exports.websiteInfoPatch = async (req, res) => {
  if (req.files && req.files.logo) {
    req.body.logo = req.files.logo[0].path;
  }

  if (req.files && req.files.favicon) {
    req.body.favicon = req.files.favicon[0].path;
  }

  const settingWebsiteInfo = await SettingWebsiteInfo.findOne({});
  if (!settingWebsiteInfo) {
    const newRecord = new SettingWebsiteInfo(req.body);
    newRecord.save();
  } else {
    await SettingWebsiteInfo.updateOne(
      {
        _id: settingWebsiteInfo.id,
      },
      req.body
    );
  }

  res.json({
    code: "success",
    message: "Cập nhật thành công!",
  });
};

module.exports.accountAdminList = async (req, res) => {
  const find = {
    deleted: false,
  };

  // Lọc theo trạng thái
  if (req.query.status) {
    find.status = req.query.status;
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

  // Lọc theo nhóm quyền
  if (req.query.role) {
    find.role = req.query.role;
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
  const totalRecord = await AccountAdmin.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limitItems);
  const pagination = {
    skip: skip,
    totalRecord: totalRecord,
    totalPage: totalPage,
  };

  const accountAdminList = await AccountAdmin.find(find)
    .sort({
      createdAt: "desc",
    })
    .limit(limitItems)
    .skip(skip);

  for (const item of accountAdminList) {
    if (item.role) {
      const roleInfo = await Role.findOne({
        _id: item.role,
      });
      if (roleInfo) {
        item.roleName = roleInfo.name;
      }
    }
  }

  // Danh sách nhóm quyền
  const roleList = await Role.find({});

  res.render("admin/pages/account-admin-list", {
    pageTitle: "Tài khoản quản trị",
    accountAdminList: accountAdminList,
    roleList: roleList,
    pagination: pagination,
  });
};

module.exports.accountAdminCreate = async (req, res) => {
  const roleList = await Role.find({
    deleted: false,
  });

  res.render("admin/pages/account-admin-create", {
    pageTitle: "Tạo tài khoản quản trị",
    roleList: roleList,
  });
};

module.exports.accountAdminCreatePost = async (req, res) => {
  try {
    const existAccount = await AccountAdmin.findOne({
      email: req.body.email,
    });

    if (existAccount) {
      res.json({
        code: "error",
        message: "Email đã tồn tại trong hệ thống!",
      });
      return;
    }

    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;
    req.body.avatar = req.file ? req.file.path : "";

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const newRecord = new AccountAdmin(req.body);
    await newRecord.save();

    res.json({
      code: "success",
      message: "Tạo tài khoản thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Bản ghi không hợp lệ!",
    });
  }
};

module.exports.accountAdminEdit = async (req, res) => {
  try {
    const id = req.params.id;

    const accountDetail = await AccountAdmin.findOne({
      _id: id,
      deleted: false,
    });

    if (!accountDetail) {
      res.redirect(`/${pathAdmin}/setting/account-admin/list`);
      return;
    }

    const roleList = await Role.find({
      deleted: false,
    });

    res.render("admin/pages/account-admin-edit", {
      pageTitle: "Chỉnh sửa tài khoản quản trị",
      roleList: roleList,
      accountDetail: accountDetail,
    });
  } catch (error) {
    res.redirect(`/${pathAdmin}/setting/account-admin/list`);
  }
};

module.exports.accountAdminEditPatch = async (req, res) => {
  try {
    const id = req.params.id;

    const accountDetail = await AccountAdmin.findOne({
      _id: id,
      deleted: false,
    });

    if (!accountDetail) {
      res.json({
        code: "error",
        message: "Bản ghi không tồn tại!",
      });
      return;
    }

    const existEmail = await AccountAdmin.findOne({
      _id: { $ne: id }, // loại trừ tài khoản đang cập nhật
      email: req.body.email,
    });

    if (existEmail) {
      res.json({
        code: "error",
        message: "Email đã tồn tại trong hệ thống!",
      });
      return;
    }

    if (req.body.password) {
      // Mã hóa mật khẩu
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    } else {
      delete req.body.password;
    }

    req.body.updatedBy = req.account.id;
    if (req.file) {
      req.body.avatar = req.file.path;
    } else {
      delete req.body.avatar;
    }

    await AccountAdmin.updateOne(
      {
        _id: id,
        deleted: false,
      },
      req.body
    );

    res.json({
      code: "success",
      message: "Cập nhật tài khoản thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Bản ghi không hợp lệ!",
    });
  }
};

module.exports.accountAdminChangeMultiPatch = async (req, res) => {
  try {
    const { option, ids } = req.body;

    switch (option) {
      case "initial":
      case "active":
      case "inactive":
        await AccountAdmin.updateMany(
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

      case "delete":
        await AccountAdmin.updateMany(
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

module.exports.accountAdminDeletePatch = async (req, res) => {
  try {
    const { id } = req.params;

    await AccountAdmin.updateOne(
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
      message: "Xóa tài khoản thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Bản ghi không hợp lệ!",
    });
  }
};

module.exports.roleList = async (req, res) => {
  const find = {
    deleted: false,
  };

  // Tìm kiếm
  if (req.query.keyword) {
    const keyword = slugify(req.query.keyword);
    const keywordRegex = new RegExp(keyword, "i");
    find.slug = keywordRegex;
  }

  const roleList = await Role.find(find).sort({
    createdAt: "desc",
  });

  res.render("admin/pages/role-list", {
    pageTitle: "Nhóm quyền",
    roleList: roleList,
  });
};

module.exports.roleCreate = (req, res) => {
  res.render("admin/pages/role-create", {
    pageTitle: "Tạo nhóm quyền",
    permissionList: permissionList,
  });
};

module.exports.roleCreatePost = async (req, res) => {
  try {
    req.body.createBy = req.account.id;
    req.body.updatedBy = req.account.id;

    const newRecord = new Role(req.body);
    await newRecord.save();

    res.json({
      code: "success",
      message: "Tạo nhóm quyền thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Bản ghi không hợp lệ!",
    });
  }
};

module.exports.roleEdit = async (req, res) => {
  try {
    const id = req.params.id;

    const roleDetail = await Role.findOne({
      _id: id,
      deleted: false,
    });

    if (!roleDetail) {
      res.redirect(`/${pathAdmin}/setting/role/list`);
      return;
    }

    res.render("admin/pages/role-edit", {
      pageTitle: "Chỉnh sửa nhóm quyền",
      permissionList: permissionList,
      roleDetail: roleDetail,
    });
  } catch (error) {
    res.redirect(`/${pathAdmin}/setting/role/list`);
  }
};

module.exports.roleEditPatch = async (req, res) => {
  try {
    const id = req.params.id;

    const roleDetail = await Role.findOne({
      _id: id,
      deleted: false,
    });

    if (!roleDetail) {
      res.json({
        code: "error",
        message: "Bản ghi không tồn tại!",
      });
      return;
    }

    req.body.updatedBy = req.account.id;

    await Role.updateOne(
      {
        _id: id,
        deleted: false,
      },
      req.body
    );

    res.json({
      code: "success",
      message: "Cập nhật nhóm quyền thành công!",
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
    const { id } = req.params;

    await Role.updateOne(
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
      message: "Xóa nhóm quyền thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Bản ghi không hợp lệ!",
    });
  }
};

module.exports.roleChangeMultiPatch = async (req, res) => {
  try {
    const { option, ids } = req.body;

    switch (option) {
      case "delete":
        await Role.updateMany(
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
