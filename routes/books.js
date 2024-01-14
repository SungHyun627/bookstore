const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const { getAllBooksInfo, getBookInfo } = require('../controllers/bookController');

router.use(express.json());

// 전체 도서 조회
router.get('/', getAllBooksInfo);

// 개별 도서 조회
router.get('/:id', getBookInfo);

// 카테고리별 도서 목록 조회
router.get('/', (req, res) => {
  res.json({
    message: '카테고리별 도서 목록 조회',
  });
});

module.exports = router;
