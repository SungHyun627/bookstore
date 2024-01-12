const connection = require('../config/mysqlConfig');
const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto');
const { getHashPassword } = require('../utils/password');

const signup = (req, res) => {
  const { email, password } = req.body;
  const sql = `INSERT INTO users (email, password, salt) VALUES (?, ?, ?)`;

  const salt = crypto.randomBytes(10).toString('base64');

  const hashPassword = getHashPassword(password, salt);
  const values = [email, hashPassword, salt];

  connection.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.CREATED).json(results);
  });
};

module.exports = { signup };
