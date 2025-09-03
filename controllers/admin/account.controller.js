const AccountAdmin = require("../../models/account-admin.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateHelper = require("../../helpers/generate.helper");
const mailHelper = require("../../helpers/mail.helper");
const ForgotPassword = require("../../models/forgot-password.mode");

module.exports.login = (req, res) => {
  res.render("admin/pages/login", {
    pageTitle: "Đăng nhập",
  });
};

module.exports.loginPost = async (req, res) => {
  const { email, password, rememberPassword } = req.body;

  const existAccount = await AccountAdmin.findOne({
    email: email,
  });
  if (!existAccount) {
    res.json({
      code: "error",
      message: "Email không tồn tại trong hệ thống!",
    });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, existAccount.password);
  if (!isPasswordValid) {
    res.json({
      code: "error",
      message: "Sai mật khẩu!",
    });
    return;
  }

  if (existAccount.status != "active") {
    res.json({
      code: "error",
      message: "Tài khoản chưa được kích hoạt!",
    });
    return;
  }

  // sign 3 tham số: thông tin muốn mã hóa, mã bảo mật, thời gian lưu
  const token = jwt.sign(
    {
      id: existAccount.id,
      email: existAccount.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: rememberPassword ? "7d" : "1d",
    }
  );

  res.cookie("token", token, {
    maxAge: rememberPassword ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
  });

  res.json({
    code: "success",
    message: "Đăng nhập thành công!",
  });
};

module.exports.register = (req, res) => {
  res.render("admin/pages/register", {
    pageTitle: "Đăng ký",
  });
};

module.exports.registerPost = async (req, res) => {
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

  req.body.status = "initial";

  // Mã hóa mật khẩu
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  const newAccount = new AccountAdmin(req.body);
  await newAccount.save();

  res.json({
    code: "success",
    message: "Đăng ký tài khoản thành công!",
  });
};

module.exports.registerInitial = (req, res) => {
  res.render("admin/pages/register-initial", {
    pageTitle: "Tài khoản đã được khởi tạo",
  });
};

module.exports.forgotPassword = (req, res) => {
  res.render("admin/pages/forgot-password", {
    pageTitle: "Quên mật khẩu",
  });
};

module.exports.forgotPasswordPost = async (req, res) => {
  const { email } = req.body;

  const existAccount = await AccountAdmin.findOne({
    email: email,
    status: "active",
  });

  if (!existAccount) {
    res.json({
      code: "error",
      message: "Email không tồn tại trong hệ thống!",
    });
    return;
  }

  // Kiểm tra email tồn tại trong Forgot Password chưa
  const existEmailInForgotPassword = await ForgotPassword.findOne({
    email: email,
  });

  if (existEmailInForgotPassword) {
    res.json({
      code: "error",
      message: "Vui lòng gửi lại yêu cầu sau 5 phút",
    });
    return;
  }

  // Tạo OTP
  const otp = generateHelper.generateRandomNumber(6);

  // Lưu vào CSDL bản ghi mới: OTP và Email
  const record = new ForgotPassword({
    email: email,
    otp: otp,
    expireAt: Date.now() + 5 * 60 * 1000,
  });
  await record.save();

  // Gửi OTP tự động
  const title = "Mã OTP lấy lại mật khẩu";
  const content = `
    <p>Xin chào ${existAccount.fullName || "bạn"},</p>
    <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản có email: <strong>${email}</strong>.</p>
    <p>Mã xác thực (OTP) của bạn là:</p>
    <h2 style="color:#2F67F6;letter-spacing:3px">${otp}</h2>
    <p>Mã OTP này chỉ có hiệu lực trong <strong>5 phút</strong>. 
    Vui lòng không chia sẻ mã này với bất kỳ ai để đảm bảo an toàn tài khoản của bạn.</p>
    <p>Nếu bạn không yêu cầu quên mật khẩu, vui lòng bỏ qua email này.</p>
    <br/>
    <p>Trân trọng,</p>
    <p><strong>Đội ngũ Hỗ trợ</strong></p>
  `;
  mailHelper.sendMail(email, title, content);

  res.json({
    code: "success",
    message: "Đã gửi mã OTP qua email!",
  });
};

module.exports.otpPassword = (req, res) => {
  res.render("admin/pages/otp-password", {
    pageTitle: "Nhập mã OTP",
  });
};

module.exports.otpPasswordPost = async (req, res) => {
  const { email, otp } = req.body;

  const existRecord = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });

  if (!existRecord) {
    res.json({
      code: "error",
      message: "Mã OTP không chính xác!",
    });
    return;
  }

  const account = await AccountAdmin.findOne({
    email: email,
  });

  const token = jwt.sign(
    {
      id: account.id,
      email: account.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  res.cookie("token", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
  });

  res.json({
    code: "success",
    message: "Xác thực thành công!",
  });
};

module.exports.resetPassword = (req, res) => {
  res.render("admin/pages/reset-password", {
    pageTitle: "Đổi mật khẩu",
  });
};

module.exports.resetPasswordPost = async (req, res) => {
  const { password } = req.body;

  // Mã hóa mật khẩu
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  await AccountAdmin.updateOne(
    {
      _id: req.account.id,
    },
    {
      password: hashPassword,
    }
  );

  res.json({
    code: "success",
    message: "Đổi mật khẩu thành công!",
  });
};

module.exports.logoutPost = (req, res) => {
  res.clearCookie("token");
  res.json({
    code: "success",
    message: "Đã đăng xuất!",
  });
};
