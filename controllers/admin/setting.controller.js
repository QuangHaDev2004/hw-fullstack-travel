module.exports.list = (req, res) => {
  res.render("admin/pages/setting-list", {
    pageTitle: "Cài đặt chung",
  });
};

module.exports.websiteInfo = (req, res) => {
  res.render("admin/pages/website-info", {
    pageTitle: "Thông tin website",
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

module.exports.roleList = (req, res) => {
  res.render("admin/pages/role-list", {
    pageTitle: "Nhóm quyền",
  });
};

module.exports.roleCreate = (req, res) => {
  res.render("admin/pages/role-create", {
    pageTitle: "Tạo nhóm quyền",
  });
};