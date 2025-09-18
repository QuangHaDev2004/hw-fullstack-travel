const AccountAdmin = require("../../models/account-admin.model");
const Role = require("../../models/role.model");

module.exports.edit = async (req, res) => {
  console.log(req.account);
  if (req.account.role) {
    const roleInfo = await Role.findOne({
      _id: req.account.role,
    });
    if (roleInfo) {
      req.account.roleName = roleInfo.name;
    }
  }

  res.render("admin/pages/profile-edit", {
    pageTitle: "Thông tin cá nhân",
    profileDetail: req.account,
  });
};

module.exports.editPatch = async (req, res) => {
  const existEmail = await AccountAdmin.findOne({
    _id: { $ne: req.account.id }, // loại trừ tài khoản đang cập nhật
    email: req.body.email,
  });

  if (existEmail) {
    res.json({
      code: "error",
      message: "Email đã tồn tại trong hệ thống!",
    });
    return;
  }

  req.body.updatedBy = req.account.id;
  if (req.file) {
    req.body.avatar = req.file.path;
  } else {
    delete req.body.avatar;
  }

  await AccountAdmin.updateOne(
    {
      _id: req.account.id,
      deleted: false,
    },
    req.body
  );

  res.json({
    code: "success",
    message: "Cập nhật thông tin thành công!",
  });
};

module.exports.changePassword = (req, res) => {
  res.render("admin/pages/profile-change-password", {
    pageTitle: "Đổi mật khẩu",
  });
};
