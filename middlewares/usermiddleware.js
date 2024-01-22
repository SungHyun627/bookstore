const { body, validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const { passwordRegex } = require('../constants/regex');

const validateEachValidation = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    return next();
  }
  return res.status(StatusCodes.BAD_REQUEST).json(err.array());
};
const validateUserEmail = body('email')
  .trim()
  .notEmpty()
  .withMessage('이메일을 입력해주세요.')
  .isEmail()
  .withMessage('올바른 이메일 형식이 아닙니다.');

const validateUserPassword = body('password')
  .trim()
  .notEmpty()
  .withMessage('비밀번호를 입력해주세요.')
  .matches(passwordRegex)
  .withMessage('비밀번호는 최소 하나의 영문자, 숫자, 특수 문자를 포함한 8~20자 길이이어야 합니다.');

const validateSignUp = [validateUserEmail, validateUserPassword, validateEachValidation];
const validateSignIn = [validateUserEmail, validateUserPassword, validateEachValidation];
const validatePasswordResetRequest = [validateUserEmail, validateEachValidation];
const validatePasswordReset = [validateUserEmail, validateUserPassword, validateEachValidation];

module.exports = {
  validateSignUp,
  validateSignIn,
  validatePasswordResetRequest,
  validatePasswordReset,
};
