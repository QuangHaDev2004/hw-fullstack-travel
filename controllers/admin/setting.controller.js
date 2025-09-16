const SettingWebsiteInfo = require("../../models/setting-website-info.model");
const Role = require("../../models/role.model");

const { permissionList } = require("../../config/variable.config");

const slugify = require("slugify");

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

module.exports.accountAdminList = (req, res) => {
  res.render("admin/pages/account-admin-list", {
    pageTitle: "Tài khoản quản trị",
  });
};

module.exports.accountAdminCreate = (req, res) => {
  res.render("admin/pages/account-admin-create", {
    pageTitle: "Tạo tài khoản quản trị",
  });
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

module.exports.changeMultiPatch = async (req, res) => {
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
    }
  } catch (error) {
    res.json({
      code: "error",
      message: "Bản ghi không hợp lệ!",
    });
  }
};
