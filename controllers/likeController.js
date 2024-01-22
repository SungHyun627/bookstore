const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const connection = require('../config/mysqlConfig');
const ensureAuthorization = require('../utils/auth');
const { likeQueries } = require('../utils/queries');

const addLike = (req, res) => {
  const book_id = req.params.id;
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

  const sql = likeQueries.addLike;
  const values = [authorization.id, book_id];

  connection.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json();
  });
};

const removeLike = (req, res) => {
  const book_id = req.params.id;
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

  const sql = likeQueries.deleteLike;
  const values = [authorization.id, book_id];

  connection.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json();
  });
};

module.exports = { addLike, removeLike };
