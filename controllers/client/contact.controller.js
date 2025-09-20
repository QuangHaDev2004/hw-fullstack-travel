const Contact = require("../../models/contact.model");

module.exports.createPost = async (req, res) => {
  const email = req.body.email;

  const existEmail = await Contact.findOne({
    email: email,
    deleted: false,
  });

  if (existEmail) {
    res.json({
      code: "error",
      message: "Email đã được đăng ký!",
    });
    return;
  }

  const newRecord = new Contact({
    email: email,
  });
  await newRecord.save();

  res.json({
    code: "success",
    message: "Đăng ký nhận email thành công!",
  });
};
