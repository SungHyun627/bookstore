const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { StatusCodes } = require('http-status-codes');
const connection = require('../config/mysqlConfig');

const addTocart = (req, res) => {
  const { book_id, quantity } = req.body;

  const authorization = ensureAuthorization(req);

  const sql = 'INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?);';
  const values = [book_id, quantity, authorization.id];

  connection.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

const getCartItems = (req, res) => {
  const { selected } = req.body;
  const authorization = ensureAuthorization(req);

  const sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
               FROM cartItems LEFT JOIN books 
               ON cartItems.book_id = books.id
               WHERE user_id=? AND cartItems.id IN (?)`;

  const values = [authorization.id, selected];
  connection.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

const removeCartItem = (req, res) => {
  const cartItemId = req.params.id;

  const sql = 'DELETE FROM cartItems WHERE id=?;';

  connection.query(sql, cartItemId, (err, results) => {
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

module.exports = {
  addTocart,
  getCartItems,
  removeCartItem,
};
