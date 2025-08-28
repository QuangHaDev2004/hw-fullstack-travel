const Joi = require("joi");

module.exports.registerPost = async (req, res, next) => {
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

    password: Joi
      .string()
      .required()
      .min(8)
      .custom((value, helpers) => {
        if(!/[A-Z]/.test(value)){
          return helpers.error("password.uppercase");
        }

        if(!/[a-z]/.test(value)){
          return helpers.error("password.lowercase");
        }

        if(!/\d/.test(value)){
          return helpers.error("password.number");
        }

        if(!/[^a-zA-Z0-9\s]/.test(value)){
          return helpers.error("password.special");
        }

        return value;
      })
      .messages({
        "string.empty": "Vui lòng nhập mật khẩu!",
        "string.min": "Mật khẩu phải chứa ít nhất 8 ký tự!",
        "password.uppercase": "Mật khẩu phải chứa ký tự viết hoa!",
        "password.lowercase": "Mật khẩu phải chứa ký tự viết thường!",
        "password.number": "Mật khẩu phải chứa chữ số!",
        "password.special": "Mật khẩu phải chứa ký tự đặc biệt!",
      }),
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

module.exports.loginPost = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi
      .string()
      .required()
      .email()
      .messages({
        "string.empty": "Vui lòng nhập email của bạn!",
        "string.email": "Email không đúng định dạng!",
      }),

    password: Joi
      .string()
      .required()
      .messages({
        "string.empty": "Vui lòng nhập mật khẩu!",
      }),
    rememberPassword: Joi.boolean()
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
