const express = require('express');
const router = express.Router();
const connection = require('../config/mysqlConfig');
const { StatusCodes } = require('http-status-codes');

router.use(express.json());

// 회원가입
router.post('/signup', (req, res) => {
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
});

// 로그인
router.post('/signin', (req, res) => {
  res.json({
    message: '로그인',
  });
});

router
  .route('/reset')
  // 비밀번호 초기화 요청
  .post((req, res) => {
    res.json({
      message: '비밀번호 초기화 요청',
    });
  })
  // 비밀번호 초기화
  .put((req, res) => {
    res.json({
      message: '비밀번호 초기화',
    });
  });

module.exports = router;
