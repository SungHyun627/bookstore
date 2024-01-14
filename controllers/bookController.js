const connection = require('../config/mysqlConfig');
const { StatusCodes } = require('http-status-codes');

const getAllBooksInfo = (req, res) => {
  let { category_id } = req.query;

  if (category_id) {
    let sql = 'SELECT * FROM books WHERE category_id=?';

    connection.query(sql, category_id, (err, results) => {
      if (err) {
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      if (results.length) {
        return res.status(StatusCodes.OK).json(results);
      } else {
        return res.status(StatusCodes.NOT_FOUND).end();
      }
    });
  } else {
    let sql = 'SELECT * FROM books';
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
  let sql = 'SELECT * FROM books WHERE id=?';

  connection.query(sql, id, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results[0]) {
      return res.status(StatusCodes.OK).json(results[0]);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });
};

module.exports = { getAllBooksInfo, getBookInfo };
