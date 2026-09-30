const joi = require('joi');

const registerSchema = joi.object({
  name: joi.string().alphanum().min(3).max(30).required(),
  email: joi.string().email().pattern(new RegExp('^[^\\s@]+@[^\s@]+\\.[^\\s@]+$')).required(),
  password: joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).*$')).required(),
  role: joi.string().valid('company', 'jobseeker').default('jobseeker')
});

const loginSchema = joi.object({
  email: joi.string().email().pattern(new RegExp('^[^\\s@]+@[^\s@]+\\.[^\\s@]+$')).required(),
  password: joi.string().min(8).required()
});

module.exports = {
  registerSchema,
  loginSchema
};