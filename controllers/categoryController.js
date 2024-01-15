const { StatusCodes } = require('http-status-codes');
const connection = require('../config/mysqlConfig');

const getAllCategories = (req, res) => {
  const sql = 'SELECT * FROM category';

  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = { getAllCategories };
