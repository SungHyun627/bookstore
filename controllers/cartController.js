const jwt = require('jsonwebtoken');

const { StatusCodes } = require('http-status-codes');
const connection = require('../config/mysqlConfig');
const ensureAuthorization = require('../utils/auth');
const { cartQueries } = require('../utils/queries');

const addTocart = (req, res) => {
  const { book_id, quantity } = req.body;

  const authorization = ensureAuthorization(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '로그인 세션이 만료되었습니다. 다시 로그인 하세요.',
    });
  }
  if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '잘못된 토큰입니다.',
    });
  }

  const sql = cartQueries.insertCartItems;
  const values = [book_id, quantity, authorization.id];

  connection.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

const getCartItems = (req, res) => {
  const { selected } = req.body;
  const authorization = ensureAuthorization(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '로그인 세션이 만료되었습니다. 다시 로그인 하세요.',
    });
  }
  if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '잘못된 토큰입니다.',
    });
  }
  let sql = cartQueries.selectCartItems;

  const values = [authorization.id];

  if (selected) {
    sql += cartQueries.selectSelectedCartItems;
    values.push(selected);
  }
  connection.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (results.length) {
      results.map((result) => {
        result.bookId = result.book_id;
        delete result.book_id;
      });
      return res.status(StatusCodes.OK).json(results);
    }
    return res.status(StatusCodes.NOT_FOUND).end();
  });
};

const removeCartItem = (req, res) => {
  const authorization = ensureAuthorization(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '로그인 세션이 만료되었습니다. 다시 로그인 하세요.',
    });
  }
  if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '잘못된 토큰입니다.',
    });
  }
  const cartItemId = req.params.id;

  const sql = cartQueries.deleteCartItems;

  connection.query(sql, cartItemId, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = {
  addTocart,
  getCartItems,
  removeCartItem,
};
