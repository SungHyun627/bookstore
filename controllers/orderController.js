const { StatusCodes } = require('http-status-codes');
const mariadb = require('mysql2/promise');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const ensureAuthorization = require('../utils/auth');

dotenv.config();

const deleteCartItems = async (connection, items) => {
  const sql = `DELETE FROM cartItems WHERE id IN (?)`;
  const result = await connection.query(sql, [items]);
  return result;
};

const order = async (req, res) => {
  const connection = await mariadb.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    dateStrings: true,
  });

  const authorization = ensureAuthorization(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '로그인 세션이 만료되었습니다. 다시 로그인 하세요.',
    });
  }
  if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '잘못된 토큰입니다.',
    });
  }
  const { items, delivery, totalQuantity, totalPrice, firstBookTitle } = req.body;

  // delivery 테이블 삽입
  let sql = 'INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?);';
  let values = [delivery.address, delivery.receiver, delivery.contact];

  let [results] = await connection.execute(sql, values);

  const delivery_id = results.insertId;

  // orders 테이블 삽입
  sql = `INSERT INTO orders (book_title , total_quantity, total_price, user_id, delivery_id)
          VALUES (?, ?, ?, ?, ?);`;
  values = [firstBookTitle, totalQuantity, totalPrice, authorization.id, delivery_id];
  [results] = await connection.execute(sql, values);
  const order_id = results.insertId;

  // items를 가지고, 장바구니에서 book_id, quantity를 조회
  sql = 'SELECT book_id, quantity FROM cartItems WHERE id IN (?);';
  const [orderItems, fields] = await connection.query(sql, [items]);

  // orderedBook 테이블 삽입

  sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?;`;
  values = [];
  orderItems.forEach((item) => {
    values.push([order_id, item.book_id, item.quantity]);
  });

  const result = await deleteCartItems(connection, items);

  return res.status(StatusCodes.OK).json(result);
};

const getOrders = async (req, res) => {
  const authorization = ensureAuthorization(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '로그인 세션이 만료되었습니다. 다시 로그인 하세요.',
    });
  }
  if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '잘못된 토큰입니다.',
    });
  }

  const connection = await mariadb.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    dateStrings: true,
  });

  const sql = `SELECT orders.id, created_at, address, receiver, contact, book_title, total_quantity, total_price 
        FROM orders LEFT JOIN delivery ON orders.delivery_id = delivery.id WHERE user_id = ?;`;
  const [rows, fields] = await connection.query(sql, [authorization.id]);
  rows.map((row) => {
    row.createdAt = row.created_at;
    row.bookTitle = row.book_title;
    row.totalQuantity = row.total_quantity;
    row.totalPrice = row.total_price;
    delete row.created_at;
    delete row.book_title;
    delete row.total_quantity;
    delete row.total_price;
  });
  return res.status(StatusCodes.OK).json(rows);
};

const getOrderDetail = async (req, res) => {
  const authorization = ensureAuthorization(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '로그인 세션이 만료되었습니다. 다시 로그인 하세요.',
    });
  }
  if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '잘못된 토큰입니다.',
    });
  }

  const orderId = req.params.id;
  const connection = await mariadb.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    dateStrings: true,
  });
  const sql = `SELECT book_id, title, author, price, quantity
        FROM orderedBook LEFT JOIN books
        ON orderedBook.book_id = books.id
        WHERE order_id= ?`;

  const [rows, fields] = await connection.query(sql, [orderId]);
  rows.map((row) => {
    row.bookId = row.book_id;
    delete row.book_id;
  });
  return res.status(StatusCodes.OK).json(rows);
};

module.exports = {
  order,
  getOrders,
  getOrderDetail,
};
