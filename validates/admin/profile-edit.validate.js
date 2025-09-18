const Joi = require("joi");

module.exports.editPatch = async (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi
      .string()
      .required()
      .min(5)
      .max(50)
      .messages({
        "string.empty": "Vui lòng nhập họ tên!",
        "string.min": "Họ tên phải có ít nhất 5 ký tự!",
        "string.max": "Họ tên không được vượt quá 50 ký tự!",
      }),

    email: Joi
      .string()
      .required()
      .email()
      .messages({
        "string.empty": "Vui lòng nhập email của bạn!",
        "string.email": "Email không đúng định dạng!",
      }),

    phone: Joi
      .string()
      .required()
      .pattern(/^(0|\+84)(3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-9])[0-9]{7}$/)
      .messages({
        "string.empty": "Vui lòng nhập số điện thoại!",
        "string.pattern.base": "Số điện thoại không đúng định dạng!",
      }),

    avatar: Joi.string().allow(""),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    const errorMessage = error.details[0].message;

    res.json({
      code: "error",
      message: errorMessage,
    });
    return;
  }

  next();
};