const { StatusCodes } = require('http-status-codes');
const connection = require('../config/mysqlConfig');

const getAllBooksInfo = (req, res) => {
  const { category_id } = req.query;

  if (category_id) {
    const sql = 'SELECT * FROM books WHERE category_id=?';

    connection.query(sql, category_id, (err, results) => {
      if (err) {
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      if (results.length) {
        return res.status(StatusCodes.OK).json(results);
      }
      return res.status(StatusCodes.NOT_FOUND).end();
    });
  } else {
    const sql = 'SELECT * FROM books';
    connection.query(sql, (err, results) => {
      if (err) {
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
      return res.status(StatusCodes.CREATED).json(results);
    });
  }
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
