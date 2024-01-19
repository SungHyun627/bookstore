const { StatusCodes } = require('http-status-codes');
const connection = require('../config/mysqlConfig');

const addTocart = (req, res) => {
  const { book_id, quantity, user_id } = req.body;

  const sql = 'INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?);';
  const values = [book_id, quantity, user_id];

  connection.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = {
  addTocart,
};
