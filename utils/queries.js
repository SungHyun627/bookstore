const userQueries = Object.freeze({
  insertUserInfo: `INSERT INTO users (email, password, salt) VALUES (?, ?, ?)`,
  selectUser: `SELECT * FROM users WHERE email = ?`,
  updatePassword: `UPDATE users SET password=?, salt=? WHERE email=?`,
});

const categoryQueries = Object.freeze({
  selectCategories: 'SELECT * FROM category',
});

const bookQueries = Object.freeze({
  selectAllBookInfo:
    'SELECT SQL_CALC_FOUND_ROWS *, (SELECT count(*) FROM likes WHERE books.id=liked_book_id) AS likes FROM books',
  setCategoryIdAndNewsConditions:
    ' WHERE category_id=? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 2 MONTH) AND NOW();',
  setCategoryIdCondition: ' WHERE category_id=?',
  setNewsCondition: ` WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 2 MONTH) AND NOW()`,
  setLimitAndPageConditions: ' LIMIT ? OFFSET ?',
  selectFoundRows: 'SELECT found_rows()',
  selectBookDetailInNotAuthorization: `SELECT *,
  (SELECT count(*) FROM likes WHERE books.id=liked_book_id) AS likes
  FROM books 
  LEFT JOIN category
  ON books.category_id = category.category_id
  WHERE books.id=?;`,
  selectBookDetailInAuthorization: `SELECT *,
  (SELECT count(*) FROM likes WHERE books.id=liked_book_id) AS likes,
  (SELECT EXISTS (SELECT * FROM likes WHERE user_id=? AND liked_book_id=?)) AS liked
  FROM books 
  LEFT JOIN category
  ON books.category_id = category.category_id
  WHERE books.id=?;`,
});

const cartQueries = Object.freeze({
  insertCartItems: 'INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?);',
  selectCartItems: `SELECT cartItems.id, book_id, title, summary, quantity, price 
  FROM cartItems LEFT JOIN books 
  ON cartItems.book_id = books.id
  WHERE user_id=?`,
  selectSelectedCartItems: ` AND cartItems.id IN (?)`,
  deleteCartItems: `DELETE FROM cartItems WHERE id=?;`,
});

const likeQueries = Object.freeze({
  addLike: 'INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?);',
  deleteLike: 'DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?;',
});

const orderQueries = Object.freeze({
  deleteSelectedCartItems: `DELETE FROM cartItems WHERE id IN (?)`,
  insertDeliveryInfo: 'INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?);',
  insertOrdersInfo: `INSERT INTO orders (book_title , total_quantity, total_price, user_id, delivery_id)
  VALUES (?, ?, ?, ?, ?);`,
  selectBookIdAndQuatity: 'SELECT book_id, quantity FROM cartItems WHERE id IN (?);',
  insertOrderedBookInfo: `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?;`,
  selectOrders: `SELECT orders.id, created_at, address, receiver, contact, book_title, total_quantity, total_price 
  FROM orders LEFT JOIN delivery ON orders.delivery_id = delivery.id WHERE user_id = ?;`,
  selectOrderDetail: `SELECT book_id, title, author, price, quantity
  FROM orderedBook LEFT JOIN books
  ON orderedBook.book_id = books.id
  WHERE order_id= ?`,
});

module.exports = {
  userQueries,
  categoryQueries,
  bookQueries,
  cartQueries,
  likeQueries,
  orderQueries,
};
