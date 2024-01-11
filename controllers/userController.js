const connection = require('../config/mysqlConfig');
const { StatusCodes } = require('http-status-codes');

const signup = (req, res) => {
  const { email, password } = req.body;
  const sql = `INSERT INTO users (email, password) VALUES (?, ?)`;
  const values = [email, password];
  console.log(email, password);

  connection.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.CREATED).json(results);
  });
};

module.exports = { signup };
