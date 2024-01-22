const { validationResult, params } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

const validateEachValidation = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    return next();
  }
  return res.status(StatusCodes.BAD_REQUEST).json(err.array());
};

const validateLikedBookId = params('id')
  .trim()
  .notEmpty()
  .withMessage('도서 아이디를 입력해주세요')
  .isInt()
  .withMessage('도사 아이디는 숫자여야 합니다.');

const validateLike = [validateLikedBookId, validateEachValidation];

module.exports = {
  validateLike,
};
