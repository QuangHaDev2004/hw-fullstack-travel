const Joi = require("joi");

module.exports.roleCreatePost = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi
      .string()
      .required()
      .messages({
        "string.empty": "Vui lòng nhập nhóm quyền!",
      }),
    description: Joi.string().allow(""),
    permissions: Joi.array().allow(""),
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