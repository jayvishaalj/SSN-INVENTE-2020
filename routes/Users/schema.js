const Joi = require("@hapi/joi");

module.exports.userLoginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

module.exports.userRegisterSchema = Joi.object({
  name: Joi.string().required(),
  phno: Joi.string().min(10).max(10).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(8).required(),
  college: Joi.string().required(),
  regno: Joi.string().required(),
});
