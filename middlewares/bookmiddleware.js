const { validationResult, param, query } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

const validateEachValidation = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    return next();
  }
  return res.status(StatusCodes.BAD_REQUEST).json(err.array());
};

const validateBookId = param('id')
  .trim()
  .notEmpty()
  .withMessage('도서 아이디를 입력해주세요')
  .isInt()
  .withMessage('도사 아이디는 숫자여야 합니다.');

const validateCategoryId = query('category_id')
  .optional()
  .trim()
  .notEmpty()
  .withMessage('카테고리 아이디를 입력해주세요.')
  .isInt()
  .withMessage('카테고리 아이디는 숫자이어야 합니다.');

const validateNews = query('news')
  .optional()
  .trim()
  .notEmpty()
  .withMessage('신간 표시 여부를 입력해주세요')
  .isBoolean()
  .withMessage('신간 표시 여부는 Boolean형이어야 합니다.');

const validateLimit = query('limit')
  .trim()
  .notEmpty()
  .withMessage('페이지 당 도서 수를 입력해주세요.')
  .isInt()
  .withMessage('페이지 당 도서 수는 숫자이어야 합니다.');

const validateCurrentPage = query('currentPage')
  .trim()
  .notEmpty()
  .withMessage('현재 페이지를 입력해주세요.')
  .isInt()
  .withMessage('현재 페이지는 숫자이어야 합니다.');

const validateGetAllBooks = [
  validateCategoryId,
  validateNews,
  validateLimit,
  validateCurrentPage,
  validateEachValidation,
];
const validateBook = [validateBookId, validateEachValidation];

module.exports = {
  validateGetAllBooks,
  validateBook,
};
