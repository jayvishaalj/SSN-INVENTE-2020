const Joi = require("@hapi/joi");

module.exports.userLoginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});
