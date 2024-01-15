const { StatusCodes } = require('http-status-codes');
const connection = require('../config/mysqlConfig');

const getAllBooksInfo = (req, res) => {
  const { category_id, news } = req.query;

  let sql = 'SELECT * FROM books';
  let values = [];

  if (category_id && news) {
    sql += ' WHERE category_id=? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 2 MONTH) AND NOW();';
    values = [category_id, news];
  } else if (category_id) {
    sql += ' WHERE category_id=?';
    values = category_id;
  } else if (news) {
    sql += `WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 2 MONTH) AND NOW()`;
    values = news;
  }

  connection.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results.length) {
      return res.status(StatusCodes.OK).json(results);
    }
    return res.status(StatusCodes.NOT_FOUND).end();
  });
};

const getBookInfo = (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM books LEFT JOIN category
    ON books.category_id = category.id WHERE books.id=1;`;

  connection.query(sql, id, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results[0]) {
      return res.status(StatusCodes.OK).json(results[0]);
    }
    return res.status(StatusCodes.NOT_FOUND).end();
  });
};

module.exports = { getAllBooksInfo, getBookInfo };
