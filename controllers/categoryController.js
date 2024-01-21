const { StatusCodes } = require('http-status-codes');
const connection = require('../config/mysqlConfig');

const getAllCategories = (req, res) => {
  const sql = 'SELECT * FROM category';

  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results.length) {
      results.map((result) => {
        result.id = result.category_id;
        result.name = result.category_name;
        delete result.category_id;
        delete result.category_name;
      });
      return res.status(StatusCodes.OK).json(results);
    }
  });
};

module.exports = { getAllCategories };
