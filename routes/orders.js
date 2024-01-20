const express = require('express');
const { order } = require('../controllers/orderController');

const router = express.Router();

router.use(express.json());

// 주문하기
router
  .route('/')
  .post(order)
  // 주문 목록 조회
  .get((req, res) => {
    res.json({
      message: '주문 목록 조회',
    });
  });

// 주문 상세 상품 조회
router.get('/:id', (req, res) => {
  res.json({
    message: '주문 상세 상품 조회',
  });
});

module.exports = router;
