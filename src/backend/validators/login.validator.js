/**
 * login.validator.js
 * Retail ERP Enterprise — Authentication Request Validator
 *
 * Enforces structural format constraints and validations on incoming user credentials.
 * Leverages Joi package for schema verification checks.
 *
 * Phase 5 — Step 2: Password Encryption & Verification
 */

"use strict";

const Joi = require("joi");
const authConfig = require("../../config/auth.config");

const loginSchema = Joi.object({
  username: Joi.string()
    .trim()
    .min(authConfig.login.usernameMinLength || 3)
    .max(authConfig.login.usernameMaxLength || 50)
    .required()
    .messages({
      "string.empty": "Username is required.",
      "string.min": `Username must be at least ${authConfig.login.usernameMinLength || 3} characters.`,
      "string.max": `Username cannot exceed ${authConfig.login.usernameMaxLength || 50} characters.`,
      "any.required": "Username is required.",
    }),
  password: Joi.string()
    .min(authConfig.login.passwordMinLength || 8)
    .max(authConfig.login.passwordMaxLength || 128)
    .required()
    .messages({
      "string.empty": "Password is required.",
      "string.min": `Password must be at least ${authConfig.login.passwordMinLength || 8} characters.`,
      "string.max": `Password cannot exceed ${authConfig.login.passwordMaxLength || 128} characters.`,
      "any.required": "Password is required.",
    }),
});

/**
 * Validates login parameters request structure.
 * @param {Object} data Input payload (username, password).
 * @returns {Object} Validation result containing { isValid, errors, value }.
 */
function validateLogin(data) {
  const { error, value } = loginSchema.validate(data, { abortEarly: false });
  if (error) {
    const details = error.details.map((d) => d.message);
    return { isValid: false, errors: details };
  }
  return { isValid: true, value };
}

module.exports = {
  validateLogin,
};
