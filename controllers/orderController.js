const { StatusCodes } = require('http-status-codes');
const mariadb = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();
// const connection = require('../config/mysqlConfig');

const order = async (req, res) => {
  const connection = await mariadb.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    dateStrings: true,
  });
  const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } = req.body;

  // delivery 테이블 삽입
  let sql = 'INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?);';
  let values = [delivery.address, delivery.receiver, delivery.contact];

  let [results] = await connection.execute(sql, values);

  const delivery_id = results.insertId;

  // orders 테이블 삽입
  sql = `INSERT INTO orders (book_title , total_quantity, total_price, user_id, delivery_id)
          VALUES (?, ?, ?, ?, ?);`;
  values = [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id];
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

  results = await connection.query(sql, [values]);

  const result = await deleteCartItems(connection, items);

  return res.status(StatusCodes.OK).json(result);
};

const deleteCartItems = async (connection, items) => {
  const sql = `DELETE FROM cartItems WHERE id IN (?)`;
  const result = await connection.query(sql, [items]);
  return result;
};

module.exports = {
  order,
};
