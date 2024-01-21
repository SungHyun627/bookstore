const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const dotenv = require('dotenv');
const connection = require('../config/mysqlConfig');

dotenv.config();

const addLike = (req, res) => {
  const { id } = req.params;
  const authorization = ensureAuthorization(req);

  const sql = 'INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?);';
  const values = [authorization.id, id];

  connection.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

const removeLike = (req, res) => {
  const book_id = req.params.id;
  const authorization = ensureAuthorization(req);

  const sql = 'DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?;';
  const values = [authorization.id, book_id];

  connection.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

const ensureAuthorization = (req) => {
  const receivedJwt = req.headers.authorization;
  const decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
  return decodedJwt;
};

module.exports = { addLike, removeLike };
