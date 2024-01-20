const express = require('express');
const { order, getOrders, getOrderDetail } = require('../controllers/orderController');

const router = express.Router();

router.use(express.json());

// 주문하기
router
  .route('/')
  .post(order)
  // 주문 목록 조회
  .get(getOrders);

// 주문 상세 상품 조회
router.get('/:id', getOrderDetail);

module.exports = router;
