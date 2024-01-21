const jwt = require('jsonwebtoken');

const { StatusCodes } = require('http-status-codes');
const connection = require('../config/mysqlConfig');
const ensureAuthorization = require('../utils/auth');

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
      message: '잘못된 토큰인입니다.',
    });
  }

  const sql = 'INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?);';
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
      message: '잘못된 토큰인입니다.',
    });
  }
  let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
               FROM cartItems LEFT JOIN books 
               ON cartItems.book_id = books.id
               WHERE user_id=?`;

  const values = [authorization.id];

  if (selected) {
    sql += `AND cartItems.id IN (?)`;
    values.push(selected);
  }
  connection.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

const removeCartItem = (req, res) => {
  const cartItemId = req.params.id;

  const sql = 'DELETE FROM cartItems WHERE id=?;';

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
