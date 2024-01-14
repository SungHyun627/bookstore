const connection = require('../config/mysqlConfig');
const { StatusCodes } = require('http-status-codes');

const getAllBooksInfo = (req, res) => {
  let sql = 'SELECT * FROM books';
  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.CREATED).json(results);
  });
};

module.exports = { getAllBooksInfo };
