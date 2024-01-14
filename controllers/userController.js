const connection = require('../config/mysqlConfig');
const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { getHashPassword } = require('../utils/password');

const signUp = (req, res) => {
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

const signIn = (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM users WHERE email = ?`;

  connection.query(sql, email, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const signInUser = results[0];

    const hashPassword = getHashPassword(password, signInUser.salt);

    if (signInUser && signInUser.password === hashPassword) {
      const token = jwt.sign(
        {
          email: signInUser.email,
        },
        process.env.PRIVATE_KEY,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
          issuer: process.env.JWT_ISSUER,
        }
      );

      res.cookie('token', token, {
        httpOnly: true,
      });

      return res.status(StatusCodes.OK).json(results);
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
};

const passwordResetRequest = (req, res) => {
  const { email } = req.body;

  let sql = 'SELECT * FROM users WHERE email = ?';

  connection.query(sql, email, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const user = results[0];

    if (user) {
      return res.status(StatusCodes.OK).json({
        email: email,
      });
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
};

const passwordReset = (req, res) => {
  const { email, password } = req.body;

  const sql = `UPDATE users SET password=?, salt=? WHERE email=?`;
  const salt = crypto.randomBytes(10).toString('base64');
  const hashPassword = getHashPassword(password, salt);

  const values = [hashPassword, salt, email];

  connection.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results.affectedRows === 0) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    } else {
      return res.status(StatusCodes.OK).json(results);
    }
  });
};

module.exports = { signUp, signIn, passwordResetRequest, passwordReset };
