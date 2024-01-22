const { validationResult, body } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

const validateEachValidation = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    return next();
  }
  return res.status(StatusCodes.BAD_REQUEST).json(err.array());
};
validateBook;

const validateBookId = body('book_id')
  .trim()
  .notEmpty()
  .withMessage('도서 아이디를 입력해주세요')
  .isInt()
  .withMessage('도사 아이디는 숫자여야 합니다.');

const validateQuantity = body(`quantity`)
  .trim()
  .notEmpty()
  .withMessage('구매 수량을 입력해주세요.')
  .isInt()
  .withMessage('구매 수량은 숫자여야 합니다.');

const validateAddToCart = [validateBookId, validateQuantity, validateEachValidation];

module.exports = {
  validateAddToCart,
};
