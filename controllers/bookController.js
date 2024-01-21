const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const connection = require('../config/mysqlConfig');
const ensureAuthorization = require('../utils/auth');

const getAllBooksInfo = (req, res) => {
  const allBooksRes = {};
  const { category_id, news, limit, currentPage } = req.query;

  const offset = limit * (currentPage - 1);

  let sql =
    'SELECT SQL_CALC_FOUND_ROWS *, (SELECT count(*) FROM likes WHERE books.id=liked_book_id) AS likes FROM books';
  let values = [];

  if (category_id && news) {
    sql += ' WHERE category_id=? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 2 MONTH) AND NOW();';
    values = [category_id];
  } else if (category_id) {
    sql += ' WHERE category_id=?';
    values = [category_id];
  } else if (news) {
    sql += ` WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 2 MONTH) AND NOW()`;
  }

  sql += ' LIMIT ? OFFSET ?';
  values.push(parseInt(limit, 10), offset);

  connection.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results.length) {
      results.map((result) => {
        result.pubDate = result.pub_date;
        delete result.pub_date;
        delete result.category_id;
      });
      allBooksRes.books = results;
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });

  sql = 'SELECT found_rows()';

  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const pagination = {};
    pagination.currentPage = parseInt(currentPage, 10);
    pagination.totalCount = results[0]['found_rows()'];

    allBooksRes.pagination = pagination;
    return res.status(StatusCodes.OK).json(allBooksRes);
  });
};

const getBookInfo = (req, res) => {
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

  const book_id = req.params.id;
  const sql =
    authorization instanceof ReferenceError
      ? `SELECT *,
                    (SELECT count(*) FROM likes WHERE books.id=liked_book_id) AS likes
              FROM books 
              LEFT JOIN category
              ON books.category_id = category.category_id
              WHERE books.id=?;`
      : `SELECT *,
              (SELECT count(*) FROM likes WHERE books.id=liked_book_id) AS likes,
              (SELECT EXISTS (SELECT * FROM likes WHERE user_id=? AND liked_book_id=?)) AS liked
        FROM books 
        LEFT JOIN category
        ON books.category_id = category.category_id
        WHERE books.id=?;`;

  const values =
    authorization instanceof ReferenceError ? [book_id] : [authorization.id, book_id, book_id];

  connection.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results[0]) {
      const result = results[0];
      result.categoryName = result.category_name;
      result.pubDate = result.pub_date;
      delete result.category_id;
      delete result.category_name;
      delete result.pub_date;

      return res.status(StatusCodes.OK).json(result);
    }
    return res.status(StatusCodes.NOT_FOUND).end();
  });
};

module.exports = { getAllBooksInfo, getBookInfo };
